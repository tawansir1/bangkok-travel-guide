/* =========================================================
   common.js — small helpers shared by every page.
   Load after data.js and router.js.
   ========================================================= */

/* Stop text from becoming HTML (safe for user input) */
function esc(text) {
  return String(text).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function lineColor(stationCode) {
  if (stationCode === 'WATARUN') return LINES.ferry.color;
  const line = findLineOf(stationCode);
  return line ? LINES[line].color : '#1b2440';
}

/* <span class="badge"><b>BL31</b><span>Sanam Chai</span></span> */
function stationBadge(code) {
  const shortCode = code === 'WATARUN' ? 'Ferry' : code.replace('P-', '');
  return `<span class="badge" style="--line:${lineColor(code)}"><b>${esc(shortCode)}</b><span>${esc(stationName[code])}</span></span>`;
}

/* Fill every <datalist id="place-options"> with places and stations */
function fillPlaceOptions() {
  const list = document.getElementById('place-options');
  if (!list) return;
  list.innerHTML = SEARCH_INDEX
    .map(item => `<option value="${esc(item.label)}">${item.thai ? esc(item.thai) : ''}</option>`)
    .join('');
}

/* "Swap" button: swap the from and to fields */
function setUpSwap(form) {
  const button = form.querySelector('.planner-swap');
  if (!button) return;
  button.addEventListener('click', () => {
    const from = form.elements.from, to = form.elements.to;
    [from.value, to.value] = [to.value, from.value];
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fillPlaceOptions();
  document.querySelectorAll('form.planner, form.route-form').forEach(setUpSwap);
});
