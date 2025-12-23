// theme.js - 主題切換管理

const Theme = {
    init() {
        const nightModeSwitch = document.getElementById('nightModeSwitch');
        
        // 載入儲存的主題設定
        const isNightMode = Storage.loadNightMode();
        if (isNightMode) {
            document.body.classList.add('night-mode');
            nightModeSwitch.checked = true;
        }

        // 監聽開關切換
        nightModeSwitch.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            document.body.classList.toggle('night-mode', isChecked);
            Storage.saveNightMode(isChecked);
        });
    }
};
