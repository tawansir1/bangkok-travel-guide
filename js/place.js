/* place.js — fills place.html using ?id=... from the URL */

document.addEventListener('DOMContentLoaded', () => {
  const box = document.getElementById('place');
  const id = new URLSearchParams(location.search).get('id');
  const index = PLACES.findIndex(p => p.id === id);

  if (index === -1) {
    box.innerHTML = `
      <h1>Place not found</h1>
      <p>This link doesn’t match any place in the guide. <a href="index.html#places">See all places</a>.</p>`;
    return;
  }

  const place = PLACES[index];
  const color = lineColor(place.station);
  const prev = PLACES[(index - 1 + PLACES.length) % PLACES.length];
  const next = PLACES[(index + 1) % PLACES.length];
  const walkText = place.walk ? `${place.walk} min walk from` : 'At';

  document.title = `${place.name} | Bangkok Guide`;

  box.innerHTML = `
    <div class="place-head">
      <h1>${esc(place.name)}</h1>
      <p class="thai">${esc(place.thai)}</p>
      <p>${walkText} ${stationBadge(place.station)}</p>
      <div class="place-actions">
        <a class="button" href="route.html?to=${encodeURIComponent(place.name)}">Plan a route here</a>
      </div>
    </div>

    <figure class="place-figure">
      <div class="place-photo" style="--line:${color}">
        <img src="${photoUrl(place, 1600)}" alt="${esc(place.name)}">
      </div>
      ${photoPage(place) ? `<figcaption>Photo from <a href="${photoPage(place)}" target="_blank" rel="noopener">Wikimedia Commons</a>. Open the link for the photographer and license.</figcaption>` : ''}
    </figure>

    <div class="place-body">
      <div class="text">
        ${place.body.map(p => `<p>${esc(p)}</p>`).join('')}
        <h2>Tips</h2>
        <ul class="tip-list">${place.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>
      <dl class="facts">
        ${place.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
      </dl>
    </div>

    <nav class="other-places" aria-label="Other places">
      <a href="place.html?id=${prev.id}">Previous: ${esc(prev.name)}</a>
      <a href="place.html?id=${next.id}">Next: ${esc(next.name)}</a>
    </nav>`;

  // No photo yet? Show the Thai name on the line colour instead.
  const img = box.querySelector('.place-photo img');
  const showFallback = () => {
    const sign = document.createElement('span');
    sign.className = 'fallback';
    sign.textContent = place.thai;
    img.replaceWith(sign);
  };
  img.addEventListener('error', showFallback);
  if (img.complete && img.naturalWidth === 0) showFallback();
});
