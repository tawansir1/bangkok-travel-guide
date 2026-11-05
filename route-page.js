/* route-page.js — reads the form, runs planTrip() and draws the result */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.route-form');
  const result = document.getElementById('result');

  // Fill the form from the URL, e.g. route.html?from=Asok&to=Wat%20Arun
  const params = new URLSearchParams(location.search);
  form.elements.from.value = params.get('from') || '';
  form.elements.to.value = params.get('to') || '';
  if (form.elements.from.value && form.elements.to.value) show();
  else if (form.elements.to.value) form.elements.from.focus();

  form.addEventListener('submit', event => {
    event.preventDefault();
    const url = new URL(location.href);
    url.searchParams.set('from', form.elements.from.value);
    url.searchParams.set('to', form.elements.to.value);
    history.replaceState(null, '', url);
    show();
  });

  function show() {
    const trip = planTrip(form.elements.from.value, form.elements.to.value);
    result.innerHTML = render(trip);
    if (trip.error) form.elements[trip.error === 'to' ? 'to' : 'from'].focus();
  }
});

function render(trip) {
  if (trip.error) return `<p class="error">${esc(trip.message)}</p>`;

  if (trip.sameStop) {
    return `<p class="error" style="border-color:var(--bts-sukhumvit);background:var(--ground)">
      ${esc(trip.from.label)} and ${esc(trip.to.label)} use the same station. Just walk, it takes about ${trip.minutes} minutes.</p>`;
  }

  const changes = trip.rides.length - 1;
  return `
    <div class="result-summary">
      <div><div class="big">${trip.total} THB</div><div class="label">Total fare${trip.hasEstimate ? ', partly estimated' : ''}</div></div>
      <div><div class="big">${trip.minutes} min</div><div class="label">About, door to door</div></div>
      <div><div class="big">${changes}</div><div class="label">${changes === 1 ? 'Change' : 'Changes'}</div></div>
    </div>

    <ol class="legs">
      ${startStep(trip)}
      ${trip.legs.map((leg, i) => legStep(leg, i, trip)).join('')}
      ${endStep(trip)}
    </ol>

    ${taxiBox(trip.taxi)}`;
}

function startStep(trip) {
  const first = trip.legs[0].stops[0];
  const walk = trip.from.walk
    ? `<p>Walk about ${trip.from.walk} min to ${stationBadge(first)}</p>`
    : '';
  return `<li class="leg walk"><div class="leg-head"><strong>Start at ${esc(trip.from.label)}</strong></div>${walk}</li>`;
}

function endStep(trip) {
  const walk = trip.to.walk ? `<p>Then walk about ${trip.to.walk} min.</p>` : '';
  const color = lineColor(trip.to.node);
  return `<li class="leg end" style="--line:${color}"><div class="leg-head"><strong>Arrive at ${esc(trip.to.label)}</strong></div>${walk}</li>`;
}

function legStep(leg, index, trip) {
  const from = leg.stops[0];
  const to = leg.stops[leg.stops.length - 1];
  const minutes = Math.round(leg.minutes);

  if (leg.line === 'walk') {
    const sameName = stationName[from] === stationName[to];
    const nextLine = trip.legs[index + 1] ? LINES[trip.legs[index + 1].line].name : '';
    const title = sameName ? `Change to the ${nextLine}` : `Walk to ${stationName[to]}`;
    return `<li class="leg walk"><div class="leg-head"><strong>${esc(title)}</strong></div>
      <p>About ${minutes} min, including the wait.</p></li>`;
  }

  // fare: shown on the first leg of each ride, "included" on a continuing BTS leg
  const ride = trip.rides.find(r => r.legs.includes(leg));
  const fareText = ride.legs[0] === leg
    ? `${ride.fare.estimate ? 'about ' : ''}${ride.fare.amount} THB`
    : 'same ticket';

  const line = LINES[leg.line];
  const title = leg.line === 'ferry' ? 'Take the ferry across the river' : `Ride the ${line.name}`;
  const stopsWord = leg.hops === 1 ? 'stop' : 'stops';
  const middle = leg.stops.slice(1, -1);
  const list = middle.length
    ? `<details><summary>Show ${middle.length} stops in between</summary>
         <ol>${middle.map(s => `<li>${esc(stationName[s])}</li>`).join('')}</ol></details>`
    : '';

  return `<li class="leg" style="--line:${line.color}">
    <div class="leg-head"><strong>${esc(title)}</strong><span class="leg-fare">${fareText}</span></div>
    <p>${stationBadge(from)} to ${stationBadge(to)}</p>
    <p>${leg.hops} ${stopsWord}, about ${minutes} min</p>
    ${list}
  </li>`;
}

function taxiBox(taxi) {
  return `
    <div class="compare">
      <h3>By taxi instead: ${taxi.low}–${taxi.high} THB</h3>
      <p class="muted" style="margin:0">About ${taxi.km} km on the meter. The lower price is a clear road, the higher one is rush hour.
      ${taxi.airport ? 'Includes the 50 THB airport surcharge. ' : ''}Expressway tolls are extra.
      Grab shows a fixed price before you book, usually a little more than the meter.</p>
    </div>`;
}
