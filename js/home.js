/* home.js — draws the list of places as stops on a line, each with a photo */

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('stops');

  list.innerHTML = PLACES.map(place => `
    <li class="stop" style="--line:${lineColor(place.station)}">
      <div class="stop-text">
        <h3><a href="place.html?id=${place.id}">${esc(place.name)}</a></h3>
        <span class="thai">${esc(place.thai)}</span>
        ${stationBadge(place.station)}
        <p>${esc(place.summary)}</p>
      </div>
      <a class="stop-photo" href="place.html?id=${place.id}" tabindex="-1" aria-hidden="true">
        <img src="${photoUrl(place, 480)}" alt="" loading="lazy" width="480" height="320">
      </a>
    </li>
  `).join('');

  // If a photo can't load, remove its frame so the layout stays clean
  list.querySelectorAll('.stop-photo img').forEach(img => {
    img.addEventListener('error', () => img.parentElement.remove());
  });
});
