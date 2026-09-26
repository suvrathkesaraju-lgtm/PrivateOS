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
  }
}

function openWindow(currentApp) {
  const targetWindow = document.querySelector(currentApp);
  if (targetWindow) {
    targetWindow.style.display = "block";
  }
}

dragElement(document.getElementById("notes"));

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
