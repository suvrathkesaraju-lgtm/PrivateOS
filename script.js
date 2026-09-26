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