const Theme = {
    init() {
        const nightModeSwitch = document.getElementById('nightModeSwitch');
        
        const isNightMode = Storage.loadNightMode();
        if (isNightMode) {
            document.body.classList.add('night-mode');
            nightModeSwitch.checked = true;
        }
        nightModeSwitch.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            document.body.classList.toggle('night-mode', isChecked);
            Storage.saveNightMode(isChecked);
        });
    }
};
