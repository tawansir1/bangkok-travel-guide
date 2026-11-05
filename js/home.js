/* home.js — draws the list of places as stops on a line */

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('stops');

  list.innerHTML = PLACES.map(place => `
    <li class="stop" style="--line:${lineColor(place.station)}">
      <h3><a href="place.html?id=${place.id}">${esc(place.name)}</a></h3>
      <span class="thai">${esc(place.thai)}</span>
      ${stationBadge(place.station)}
      <p>${esc(place.summary)}</p>
    </li>
  `).join('');
});
