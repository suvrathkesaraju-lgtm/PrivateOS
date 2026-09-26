function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString();
}
updateClock();
setInterval(updateClock, 1000);

const batteryStatus = document.getElementById('battery-level');

if ('getBattery' in navigator) {
    navigator.getBattery().then(function(battery) {
        function updateBatteryStatus() {
            batteryStatus.innerText = `${Math.round(battery.level * 100)}%`;
        }
        updateBatteryStatus();
        battery.addEventListener('levelchange', updateBatteryStatus);
    });
} else {
    batteryStatus.innerText = 'N/A';
}

function downloadNote() {
    const txt = document.getElementById('notes-form').value;
    const blob = new Blob([txt], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-note.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

}
function closeWindow(currentApp) {
  const targetWindow = document.querySelector(currentApp);
  if (targetWindow) {
    targetWindow.style.display = "none";
    if (targetWindow.contains(audio)) {
      audio.pause();
    }
  }
}

function openWindow(currentApp) {
  const targetWindow = document.querySelector(currentApp);
  if (targetWindow) {
    targetWindow.style.display = "block";
  }
}

dragElement(document.getElementById("notes"));
dragElement(document.getElementById("audioPlayer"));

function dragElement(elmnt) {

    var initialX = 0, initialY = 0, currentX = 0, currentY = 0;

    if (document.getElementById(elmnt.id + "Header")) {
        document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
    }

   function dragMouseDown(e) {

    e = e || window.event;
    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {

    e = e || window.event;
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }



  function closeDragElement() {

    document.onmouseup = null;
    document.onmousemove = null;

  }
}

/* Audio Player */

const fileInput = document.getElementById('fileInput');
const filenameEl = document.getElementById('filename');
const audio = document.getElementById('audio');
const seekBar = document.getElementById('time-bar');
const currentTimeEl = document.getElementById('current-time-audio');
const remainingTimeEl = document.getElementById('remaining-time-audio');
const playBtn = document.getElementById('playbtn');

let objectUrl = null;

const PLAY_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const PAUSE_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';

function setPlayIcon(playing) {
  playBtn.innerHTML = playing ? PAUSE_ICON : PLAY_ICON;
  playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}

function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

function updateSeekBarFill() {
  const pct = seekBar.max > 0 ? (seekBar.value / seekBar.max) * 100 : 0;
  seekBar.style.background = `linear-gradient(to right, var(--accent) ${pct}%, #555 ${pct}%)`;
}

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file);
  audio.src = objectUrl;
  filenameEl.textContent = file.name;
  playBtn.disabled = false;
  // Play whatever file was selected
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.error('Playback failed:', err);
      filenameEl.textContent = 'Playback error: ' + err.message;
    });
  }
});

audio.addEventListener('loadedmetadata', () => {
  seekBar.max = audio.duration;
  seekBar.value = 0;
  currentTimeEl.textContent = formatTime(0);
  remainingTimeEl.textContent = '-' + formatTime(audio.duration);
  updateSeekBarFill();
});

audio.addEventListener('timeupdate', () => {
  if (!seekBar.matches(':active')) {
    seekBar.value = audio.currentTime;
  }
  currentTimeEl.textContent = formatTime(audio.currentTime);
  remainingTimeEl.textContent = '-' + formatTime(audio.duration - audio.currentTime);
  updateSeekBarFill();
});

seekBar.addEventListener('input', () => {
  audio.currentTime = seekBar.value;
  currentTimeEl.textContent = formatTime(seekBar.value);
  remainingTimeEl.textContent = '-' + formatTime(audio.duration - seekBar.value);
  updateSeekBarFill();
});

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.error('Playback failed:', err);
        filenameEl.textContent = 'Playback error: ' + err.message;
      });
    }
  } else {
    audio.pause();
  }
});

audio.addEventListener('play', () => setPlayIcon(true));
audio.addEventListener('pause', () => setPlayIcon(false));
audio.addEventListener('ended', () => setPlayIcon(false));

audio.addEventListener('error', () => {
  const err = audio.error;
  let msg = 'Unknown audio error';
  if (err) {
    const codes = {1: 'Aborted', 2: 'Network error', 3: 'Decode error - unsupported file', 4: 'Source not supported'};
    msg = codes[err.code] || msg;
  }
  filenameEl.textContent = 'Error: ' + msg;
  console.error('Audio error:', err);
});
