async function initializeGallery() {
const albums = await fetch('./resources/events/albums.json').then(response => response.json());
const select = document.querySelector('#event-album');
const stage = document.querySelector('.event-stage');
const photo = document.querySelector('#event-photo');
const play = document.querySelector('#event-play');
let album = 0;
let index = 0;
let timer;
function show() {
  select.selectedIndex = album;
  photo.src = './resources/events/' + albums[album][index];
  photo.alt = 'Event photograph from ' + select.options[album].text;
}
function step(direction) {
  index += direction;
  if (index >= albums[album].length || index < 0) {
    album = (album + direction + albums.length) % albums.length;
    index = direction > 0 ? 0 : albums[album].length - 1;
  }
  show();
}
function pause() {
  clearInterval(timer);
  timer = undefined;
  play.textContent = 'Play slideshow';
}
function browse(direction) {
  pause();
  step(direction);
}
select.onchange = () => { pause(); album = select.selectedIndex; index = 0; show(); };
document.querySelector('#event-prev').onclick = () => browse(-1);
document.querySelector('#event-next').onclick = () => browse(1);
play.onclick = () => {
  if (timer) return pause();
  play.textContent = 'Pause slideshow';
  timer = setInterval(() => step(1), 5000);
};
stage.onkeydown = event => {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
    browse(event.key === 'ArrowRight' ? 1 : -1);
  }
};
let start;
photo.ontouchstart = event => { start = event.touches[0]; };
photo.ontouchend = event => {
  if (!start) return;
  const dx = event.changedTouches[0].clientX - start.clientX;
  const dy = event.changedTouches[0].clientY - start.clientY;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) browse(dx < 0 ? 1 : -1);
  start = undefined;
};
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
}
initializeGallery();
