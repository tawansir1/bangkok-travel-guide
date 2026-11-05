/* =========================================================
   router.js — finds the fastest route and adds up the fares.

   1. Build a graph: every station is a node, every link
      between two stations is an edge with a travel time.
   2. Run Dijkstra's algorithm to find the fastest path.
   3. Group the path into legs (one per line) and price
      each ride with that operator's fare table.

   Needs data.js loaded first.
   ========================================================= */

const MINUTES_PER_HOP = { bts: 2.5, mrt: 2.5, arl: 3.5, gold: 2, boat: 5 };
const WAIT_TO_BOARD = 4; // minutes waiting on the platform

/* ---------- 1. Build the graph ---------- */
const stationName = {};   // code -> name
const graph = {};         // code -> [{ to, line, minutes }]

function addEdge(a, b, line, minutes) {
  (graph[a] = graph[a] || []).push({ to: b, line, minutes });
  (graph[b] = graph[b] || []).push({ to: a, line, minutes });
}

function lineOfList(listKey) {
  return listKey === 'blueTail' ? 'blue' : listKey;
}

for (const [listKey, stations] of Object.entries(STATIONS)) {
  const line = lineOfList(listKey);
  const minutes = MINUTES_PER_HOP[LINES[line].system];
  stations.forEach(([code, name], i) => {
    stationName[code] = name;
    if (i > 0) addEdge(stations[i - 1][0], code, line, minutes);
  });
}
Object.assign(stationName, EXTRA_NODES);
EXTRA_LINKS.forEach(([a, b, line, min]) => addEdge(a, b, line, min));
TRANSFERS.forEach(([a, b, min]) => addEdge(a, b, 'walk', min + WAIT_TO_BOARD));

/* ---------- Search: turn what the user typed into a node ---------- */
function normalise(text) {
  return text.toLowerCase().replace(/[^a-z0-9ก-๙]/g, '');
}

/* Every place, extra destination and station the user can pick */
function buildSearchIndex() {
  const items = [];
  PLACES.forEach(p => items.push({ label: p.name, thai: p.thai, node: p.station, walk: p.walk, placeId: p.id }));
  DESTINATIONS.forEach(d => items.push({ label: d.name, thai: d.thai, node: d.station, walk: d.walk }));
  Object.entries(stationName).forEach(([code, name]) => {
    if (code === 'WATARUN') return;
    const line = findLineOf(code);
    const suffix = line ? ` (${LINES[line].short} ${code.replace('P-', '')})` : '';
    items.push({ label: name + suffix, node: code, walk: 0, isStation: true });
  });
  return items;
}

function findLineOf(code) {
  for (const [listKey, stations] of Object.entries(STATIONS)) {
    if (stations.some(([c]) => c === code)) return lineOfList(listKey);
  }
  return null;
}

const SEARCH_INDEX = buildSearchIndex();

function findPlace(text) {
  const q = normalise(text || '');
  if (!q) return null;
  const exact = SEARCH_INDEX.find(item =>
    normalise(item.label) === q || (item.thai && normalise(item.thai) === q) ||
    normalise(item.label.replace(/\s*\(.*\)$/, '')) === q || normalise(item.node) === q);
  if (exact) return exact;
  // otherwise the first item that contains what was typed
  return SEARCH_INDEX.find(item =>
    normalise(item.label).includes(q) || (item.thai && normalise(item.thai).includes(q))) || null;
}

/* ---------- 2. Dijkstra ----------
   A state is "at this station, having arrived on this line",
   so changing lines at the same station (e.g. Siam) can cost
   waiting time. */
function shortestPath(start, goal) {
  const best = {};
  const prev = {};
  const queue = [{ key: start + '|', node: start, line: null, cost: 0 }];
  best[start + '|'] = 0;

  while (queue.length) {
    // take the cheapest state (the graph is small, so a sort is fine)
    queue.sort((a, b) => a.cost - b.cost);
    const cur = queue.shift();
    if (cur.cost > best[cur.key]) continue;
    if (cur.node === goal) return rebuild(prev, cur.key, cur.cost);

    for (const edge of graph[cur.node] || []) {
      let cost = cur.cost + edge.minutes;
      const isRide = edge.line !== 'walk';
      if (isRide && (cur.line === null || (cur.line !== 'walk' && cur.line !== edge.line))) {
        cost += WAIT_TO_BOARD; // first train, or change of line without walking
      }
      const key = edge.to + '|' + edge.line;
      if (best[key] === undefined || cost < best[key]) {
        best[key] = cost;
        prev[key] = { from: cur.key, node: cur.node, edge };
        queue.push({ key, node: edge.to, line: edge.line, cost });
      }
    }
  }
  return null;
}

function rebuild(prev, endKey, cost) {
  const edges = [];
  let key = endKey;
  while (prev[key]) {
    edges.unshift({ from: prev[key].node, to: key.split('|')[0], line: prev[key].edge.line, minutes: prev[key].edge.minutes });
    key = prev[key].from;
  }
  return { edges, minutes: cost };
}

/* ---------- 3. Legs and fares ---------- */
function toLegs(edges) {
  const legs = [];
  edges.forEach(e => {
    const last = legs[legs.length - 1];
    if (last && last.line === e.line) {
      last.stops.push(e.to);
      last.minutes += e.minutes;
    } else {
      legs.push({ line: e.line, stops: [e.from, e.to], minutes: e.minutes });
    }
  });
  legs.forEach(l => { l.hops = l.stops.length - 1; });
  return legs;
}

/* Group legs into "rides": one ticket each.
   Sukhumvit + Silom at Siam is one BTS ride. */
function toRides(legs) {
  const rides = [];
  legs.forEach(leg => {
    const system = LINES[leg.line].system;
    if (system === 'walk') return;
    const last = rides[rides.length - 1];
    const continues = last && last.system === system && last.legs[last.legs.length - 1] === legs[legs.indexOf(leg) - 1];
    if (continues && system === 'bts') last.legs.push(leg);
    else rides.push({ system, legs: [leg] });
  });
  rides.forEach(r => { r.fare = priceRide(r); });
  return rides;
}

function priceRide(ride) {
  const hops = ride.legs.reduce((n, l) => n + l.hops, 0);
  switch (ride.system) {
    case 'bts': {
      let core = 0, ext = 0;
      ride.legs.forEach(leg => {
        for (let i = 1; i < leg.stops.length; i++) {
          const inCore = BTS_CORE.has(leg.stops[i - 1]) && BTS_CORE.has(leg.stops[i]);
          inCore ? core++ : ext++;
        }
      });
      const coreFare = core ? FARES.btsCore[Math.min(core, FARES.btsCore.length - 1)] : 0;
      const extFare = ext ? FARES.btsExt(ext) : 0;
      return { amount: Math.min(FARES.btsCap, coreFare + extFare), estimate: ext > 0 };
    }
    case 'mrt': return { amount: FARES.mrtBlue[Math.min(hops, FARES.mrtBlue.length - 1)], estimate: false };
    case 'arl': return { amount: FARES.arl[Math.min(hops, FARES.arl.length - 1)], estimate: false };
    case 'gold': return { amount: FARES.gold, estimate: false };
    case 'boat': return { amount: FARES.boat, estimate: false };
    case 'ferry': return { amount: FARES.ferry, estimate: true };
    default: return { amount: 0, estimate: false };
  }
}

/* ---------- Taxi comparison ---------- */
function taxiMeter(km) {
  let fare = TAXI.flag;
  let done = 1;
  for (const [upTo, rate] of TAXI.brackets) {
    if (km <= done) break;
    const part = Math.min(km, upTo) - done;
    fare += part * rate;
    done = Math.min(km, upTo);
  }
  return fare;
}

function taxiEstimate(legs, fromAirport) {
  const trackKm = legs.reduce((km, l) => km + l.hops * KM_PER_HOP[LINES[l.line].system], 0);
  const km = Math.max(1, trackKm * 1.2); // roads are rarely as straight as rail
  const extra = fromAirport ? TAXI.airportSurcharge : 0;
  const low = taxiMeter(km) + extra;
  const high = low + km * 1.5 * TAXI.perMinuteInTraffic; // ~1.5 min stuck per km at rush hour
  return {
    km: Math.round(km * 10) / 10,
    low: Math.round(low / 5) * 5,
    high: Math.round(high / 5) * 5,
    airport: fromAirport
  };
}

/* ---------- Public: plan a trip ---------- */
function planTrip(fromText, toText) {
  const from = findPlace(fromText);
  const to = findPlace(toText);
  if (!from) return { error: 'from', message: `We couldn’t find “${fromText}”. Pick a place or station from the list.` };
  if (!to) return { error: 'to', message: `We couldn’t find “${toText}”. Pick a place or station from the list.` };
  if (from.node === to.node) {
    return { from, to, sameStop: true, minutes: from.walk + to.walk, legs: [], rides: [], total: 0 };
  }

  const path = shortestPath(from.node, to.node);
  if (!path) return { error: 'route', message: 'There’s no rail or boat route between these two places yet.' };

  const legs = toLegs(path.edges);
  const rides = toRides(legs);
  const total = rides.reduce((sum, r) => sum + r.fare.amount, 0);
  const minutes = Math.round(path.minutes + from.walk + to.walk);

  return {
    from, to, legs, rides, total, minutes,
    hasEstimate: rides.some(r => r.fare.estimate),
    taxi: taxiEstimate(legs, from.node === 'A1')
  };
}

/* Let Node.js load this file for testing */
if (typeof module !== 'undefined') {
  module.exports = { planTrip, findPlace, SEARCH_INDEX, stationName, taxiMeter };
}
