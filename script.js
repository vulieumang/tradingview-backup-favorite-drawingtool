/**
 * TradingView Ultimate Backup & Restore Tool
 * Combines local TVSettings favorites backup & cloud Drawing Tool Templates / Themes backup.
 * Inspired by victornpb/tradingview-backup & TradingView Favorites Backup.
 *
 * Run this in Browser Console (F12 -> Console) on a TradingView Chart page.
 */
(function () {
    'use strict';

    if (typeof TVSettings === 'undefined') {
        const errorMsg = "TVSettings not found. Please make sure you are on a TradingView Chart page.";
        console.error(errorMsg);
        alert(errorMsg);
        return;
    }

    const TV_SETTINGS_KEYS = [
        'chart.favoriteDrawings',
        'IntervalWidget.quicks',
        'symbollist.recents',
        'chart.favoriteIndicators'
    ];

    const TOOL_TYPES = [
        // Lines
        'LineToolTrendLine', 'LineToolRay', 'LineToolInfoLine', 'LineToolExtended', 'LineToolTrendAngle',
        'LineToolHorzLine', 'LineToolHorzRay', 'LineToolVertLine', 'LineToolCrossLine',
        // Fib
        'LineToolFibRetracement', 'LineToolTrendBasedFibExtension', 'LineToolFibChannel', 'LineToolFibTimeZone',
        'LineToolFibSpeedResistanceFan', 'LineToolTrendBasedFibTime', 'LineToolFibCircles', 'LineToolFibSpiral',
        'LineToolFibSpeedResistanceArcs', 'LineToolFibWedge', 'LineToolPitchfan',
        // Gann
        'LineToolGannSquare', 'LineToolGannFixed', 'LineToolGannComplex', 'LineToolGannFan',
        // Projection
        'LineToolRiskRewardLong', 'LineToolRiskRewardShort',
        // Brushes
        'LineToolBrush', 'LineToolHighlighter',
        // Arrows
        'LineToolArrowMarker', 'LineToolArrow', 'LineToolArrowMarkUp', 'LineToolArrowMarkDown',
        // Shapes
        'LineToolRectangle', 'LineToolRotatedRectangle', 'LineToolPath', 'LineToolCircle', 'LineToolEllipse', 'LineToolPolyline',
        'LineToolTriangle', 'LineToolArc', 'LineToolBezierQuadro', 'LineToolBezierCubic',
        // Text
        'LineToolText', 'LineToolTextAbsolute', 'LineToolTextNote', 'LineToolPriceNote', 'LineToolNote',
        'LineToolTable', 'LineToolCallout', 'LineToolComment', 'LineToolPriceLabel', 'LineToolSignpost'
    ];

    const userData = {
        SETTINGS: {},
        THEMES: {},
        TOOLS: {}
    };

    // Remove existing elements if already running
    const oldFab = document.getElementById('tvBackupToolFab');
    if (oldFab) oldFab.remove();
    const oldUI = document.getElementById('tvBackupToolUI');
    if (oldUI) oldUI.remove();
    const oldCSS = document.getElementById('tvBackupToolCSS');
    if (oldCSS) oldCSS.remove();

    // Style injection
    const styles = `
        #tvBackupToolFab {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 42px;
            height: 42px;
            background: #1e222d;
            border: 1px solid #363a45;
            border-radius: 50%;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
            color: #fff;
            font-size: 20px;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
            z-index: 999999;
            user-select: none;
            transition: all 0.2s ease;
        }
        #tvBackupToolFab:hover {
            transform: scale(1.08);
            border-color: #2962ff;
        }
        #tvBackupToolFab.active {
            border-color: #2962ff;
            background: #2962ff;
        }
        #tvBackupToolUI {
            position: fixed;
            bottom: 72px;
            right: 20px;
            width: 480px;
            max-width: calc(100vw - 40px);
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            padding: 16px;
            background: #1e222d;
            color: #d1d4dc;
            border: 1px solid #2a2e39;
            font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
            z-index: 999998;
            box-sizing: border-box;
        }
        #tvBackupToolUI.hidden { display: none; }
        #tvBackupToolUI header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #2a2e39;
        }
        #tvBackupToolUI header h3 {
            margin: 0;
            color: #f0f3fa;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        #tvBackupToolUI #closeUI {
            background: transparent;
            border: none;
            color: #787b86;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        #tvBackupToolUI #closeUI:hover { color: #f0f3fa; }
        
        .tv-btn-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 12px;
        }
        .tv-btn-card {
            background: #2a2e39;
            border: 1px solid #363a45;
            border-radius: 8px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .tv-btn-card h4 {
            margin: 0 0 4px 0;
            font-size: 13px;
            color: #9db2f5;
        }
        .tv-btn {
            background: #2962ff;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 8px 10px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.15s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .tv-btn:hover { background: #1e53e5; }
        .tv-btn-secondary {
            background: #363a45;
            color: #d1d4dc;
            border: 1px solid #434651;
        }
        .tv-btn-secondary:hover { background: #434651; color: #fff; }

        #tvBackupStatus {
            font-size: 12px;
            color: #2962ff;
            margin: 6px 0;
            min-height: 18px;
            text-align: center;
        }
        #tvProgressBar {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            margin-bottom: 10px;
            accent-color: #2962ff;
        }
        #tvPanelContainer {
            flex: 1;
            overflow-y: auto;
            max-height: 260px;
            border: 1px solid #2a2e39;
            border-radius: 6px;
            padding: 8px 12px;
            background: #131722;
        }
        #tvPanelContainer .sectionTitle {
            font-weight: 600;
            font-size: 12px;
            color: #787b86;
            margin-top: 10px;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        #tvPanelContainer section label {
            display: block;
            font-size: 13px;
            color: #b2b5be;
            padding: 3px 0;
            cursor: pointer;
        }
        #tvPanelContainer section label:hover { color: #f0f3fa; }
        .tv-toolbar {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            margin-bottom: 6px;
            color: #787b86;
        }
        .tv-toolbar a {
            color: #2962ff;
            text-decoration: none;
            cursor: pointer;
        }
        .tv-toolbar a:hover { text-decoration: underline; }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'tvBackupToolCSS';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Inject FAB & UI
    const STORAGE_KEY = 'tvBackupToolPrefs';
    const prefs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"show": true}');

    const fab = document.createElement('div');
    fab.id = 'tvBackupToolFab';
    fab.title = 'TradingView Backup & Restore (Toggle Panel)';
    fab.textContent = '🛠️';
    document.body.appendChild(fab);

    const ui = document.createElement('div');
    ui.id = 'tvBackupToolUI';
    ui.innerHTML = `
        <header>
            <h3>📊 TradingView Backup Manager</h3>
            <button id="closeUI" title="Close">&times;</button>
        </header>
        <div class="tv-btn-grid">
            <div class="tv-btn-card">
                <h4>💾 Export / Backup</h4>
                <button class="tv-btn" id="btnQuickBackup">⚡ Quick Favorites Backup</button>
                <button class="tv-btn tv-btn-secondary" id="btnFetchTemplates">☁️ Fetch Cloud Templates & Themes</button>
                <button class="tv-btn tv-btn-secondary" id="btnExportFull">📁 Export Full Backup JSON</button>
            </div>
            <div class="tv-btn-card">
                <h4>↩️ Import / Restore</h4>
                <button class="tv-btn" id="btnImportFile">📂 Load Backup File</button>
                <button class="tv-btn tv-btn-secondary" id="btnApplyAll">🚀 Restore Selected Items</button>
                <input type="file" id="tvFileInput" accept=".json,application/json" style="display:none;" />
            </div>
        </div>
        <progress id="tvProgressBar" value="0" max="100"></progress>
        <div id="tvBackupStatus">Ready</div>
        <div class="tv-toolbar">
            <span>Items to Export/Restore:</span>
            <div>
                <a id="btnSelectAll">Select All</a> | <a id="btnUnselectAll">Unselect All</a>
            </div>
        </div>
        <div id="tvPanelContainer"></div>
    `;
    document.body.appendChild(ui);

    if (!prefs.show) ui.classList.add('hidden');
    else fab.classList.add('active');

    fab.onclick = () => {
        const isHidden = ui.classList.toggle('hidden');
        fab.classList.toggle('active', !isHidden);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ show: !isHidden }));
    };
    ui.querySelector('#closeUI').onclick = () => fab.click();

    const progressBar = ui.querySelector('#tvProgressBar');
    const statusEl = ui.querySelector('#tvBackupStatus');
    const panel = ui.querySelector('#tvPanelContainer');
    const fileInput = ui.querySelector('#tvFileInput');

    // Build panel sections: SETTINGS, THEMES, TOOL_TYPES
    function buildPanelSections() {
        panel.innerHTML = '';
        ['SETTINGS', 'THEMES', ...TOOL_TYPES].forEach(toolName => {
            const titleElm = document.createElement('div');
            titleElm.className = 'sectionTitle';
            titleElm.textContent = toolName === 'SETTINGS' ? 'Favorites & Local Settings' : (toolName === 'THEMES' ? 'Chart Themes' : toolName.replace('LineTool', ''));
            panel.appendChild(titleElm);

            const sec = document.createElement('section');
            sec.setAttribute('data-tool', toolName);
            panel.appendChild(sec);
        });
    }

    buildPanelSections();

    // Populate local settings into SETTINGS section
    function loadLocalSettingsData() {
        const sec = panel.querySelector('section[data-tool="SETTINGS"]');
        sec.innerHTML = '';
        userData.SETTINGS = {};
        TV_SETTINGS_KEYS.forEach(key => {
            const val = TVSettings.getValue(key);
            if (val !== undefined && val !== null) {
                userData.SETTINGS[key] = val;
                const label = document.createElement('label');
                label.innerHTML = `<input type="checkbox" data-tool="SETTINGS" value="${key}" checked /> ${key}`;
                sec.appendChild(label);
            }
        });
    }
    loadLocalSettingsData();

    function updateStatus(msg) {
        statusEl.innerHTML = msg;
    }

    function updateProgress(pct) {
        if (pct >= 0) progressBar.value = pct;
        else progressBar.removeAttribute('value');
    }

    function getCheckedItems() {
        const checkboxes = Array.from(panel.querySelectorAll('input[type="checkbox"]:checked'));
        return checkboxes.map(c => ({ tool: c.dataset.tool, value: c.value }));
    }

    // --- QUICK BACKUP & RESTORE ---
    window.TVBackup = function () {
        loadLocalSettingsData();
        const backupData = userData.SETTINGS;
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `tradingview_favorites_backup_${dateStr}.json`;
        downloadJSON(backupData, filename);
        updateStatus('✅ Quick Backup downloaded!');
        return backupData;
    };

    window.TVRestore = function (fileData) {
        if (fileData) {
            applySettingsObject(fileData);
            return;
        }
        fileInput.click();
    };

    function downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- FETCH CLOUD TEMPLATES & THEMES ---
    async function fetchThemes() {
        try {
            updateStatus('Fetching themes...');
            const response = await fetch("https://www.tradingview.com/themes/", { method: "GET", credentials: "include" });
            const themeNames = await response.json();
            userData.THEMES = {};

            const sec = panel.querySelector('section[data-tool="THEMES"]');
            sec.innerHTML = '';

            for (const theme of themeNames) {
                updateStatus(`Fetching theme: ${theme}...`);
                const themeResponse = await fetch(`https://www.tradingview.com/theme/?themeName=${encodeURIComponent(theme)}`, { method: "GET", credentials: "include" });
                const themeContent = await themeResponse.json();
                userData.THEMES[theme] = JSON.parse(themeContent.content);

                const item = document.createElement('label');
                item.innerHTML = `<input type="checkbox" data-tool="THEMES" value="${theme}" checked /> ${theme}`;
                sec.appendChild(item);
            }
        } catch (err) {
            console.error('Error fetching themes:', err);
        }
    }

    async function fetchCloudTemplates() {
        updateProgress(0);
        await fetchThemes();

        for (let i = 0; i < TOOL_TYPES.length; i++) {
            const tool = TOOL_TYPES[i];
            updateStatus(`Fetching ${tool.replace('LineTool','')} templates...`);
            try {
                const response = await fetch(`https://www.tradingview.com/drawing-templates/${tool}/`, { method: "GET", credentials: "include" });
                const templateNames = await response.json();
                userData.TOOLS[tool] = {};

                for (let j = 0; j < templateNames.length; j++) {
                    const name = templateNames[j];
                    const templateResponse = await fetch(`https://www.tradingview.com/drawing-template/${tool}/?templateName=${encodeURIComponent(name)}`, { method: "GET", credentials: "include" });
                    const templateContent = await templateResponse.json();
                    userData.TOOLS[tool][name] = JSON.parse(templateContent.content);
                }

                const sec = panel.querySelector(`section[data-tool="${tool}"]`);
                sec.innerHTML = '';
                for (const name in userData.TOOLS[tool]) {
                    const li = document.createElement('label');
                    li.innerHTML = `<input type="checkbox" data-tool="${tool}" value="${name}" checked /> ${name}`;
                    sec.appendChild(li);
                }
            } catch (err) {
                console.error(`Error fetching template ${tool}:`, err);
            }
            updateProgress(((i + 1) / TOOL_TYPES.length) * 100);
        }
        updateStatus('✅ Themes & Templates fetched successfully!');
    }

    // Export Full Backup File
    function exportFullBackup() {
        loadLocalSettingsData();
        let username = 'user';
        try {
            if (window.initData && window.initData.metaInfo) username = window.initData.metaInfo.username;
        } catch (_) {}

        const exportData = {
            _: {
                INFO: "TradingView Ultimate Backup (Favorites, Themes & Templates)",
                USER: username,
                DATE: new Date().toISOString()
            },
            SETTINGS: {},
            THEMES: {},
            TOOLS: {}
        };

        const checkedItems = getCheckedItems();
        if (checkedItems.length === 0) {
            alert('No items selected! Please fetch or select items first.');
            return;
        }

        checkedItems.forEach(({ tool, value }) => {
            if (tool === "SETTINGS") {
                if (userData.SETTINGS[value] !== undefined) exportData.SETTINGS[value] = userData.SETTINGS[value];
            } else if (tool === "THEMES") {
                if (userData.THEMES && userData.THEMES[value]) exportData.THEMES[value] = userData.THEMES[value];
            } else {
                if (userData.TOOLS && userData.TOOLS[tool] && userData.TOOLS[tool][value]) {
                    if (!exportData.TOOLS[tool]) exportData.TOOLS[tool] = {};
                    exportData.TOOLS[tool][value] = userData.TOOLS[tool][value];
                }
            }
        });

        const dateStr = new Date().toISOString().split('T')[0];
        downloadJSON(exportData, `TradingView_Ultimate_Backup_${username}_${dateStr}.json`);
        updateStatus('✅ Full export completed!');
    }

    // Apply Settings / Restore
    async function applySelectedItems() {
        const checkedItems = getCheckedItems();
        if (checkedItems.length === 0) {
            alert('No items selected to restore.');
            return;
        }

        updateStatus('Restoring selected items...');
        let restoredCount = 0;

        // 1. Local Settings
        checkedItems.filter(i => i.tool === 'SETTINGS').forEach(({ value }) => {
            if (userData.SETTINGS[value] !== undefined) {
                TVSettings.setValue(value, userData.SETTINGS[value]);
                console.log(`Restored TVSetting: ${value}`);
                restoredCount++;
            }
        });

        // 2. Themes
        const selectedThemes = checkedItems.filter(i => i.tool === 'THEMES');
        for (const { value: theme } of selectedThemes) {
            if (userData.THEMES && userData.THEMES[theme]) {
                updateStatus(`Applying Theme "${theme}"...`);
                const formData = new FormData();
                formData.append('name', theme);
                formData.append('content', JSON.stringify(userData.THEMES[theme]));
                await fetch("https://www.tradingview.com/save-theme/", { method: "POST", credentials: "include", body: formData });
                restoredCount++;
            }
        }

        // 3. Tool Templates
        const selectedTools = checkedItems.filter(i => i.tool !== 'SETTINGS' && i.tool !== 'THEMES');
        for (let i = 0; i < selectedTools.length; i++) {
            const { tool, value: name } = selectedTools[i];
            if (userData.TOOLS && userData.TOOLS[tool] && userData.TOOLS[tool][name]) {
                updateStatus(`Applying ${tool.replace('LineTool','')} template "${name}"...`);
                const formData = new FormData();
                formData.append('name', name);
                formData.append('tool', tool);
                formData.append('content', JSON.stringify(userData.TOOLS[tool][name]));
                await fetch("https://www.tradingview.com/save-drawing-template/", { method: "POST", credentials: "include", body: formData });
                restoredCount++;
            }
            updateProgress(((i + 1) / selectedTools.length) * 100);
        }

        updateStatus(`🎉 ${restoredCount} items restored successfully!`);
        if (confirm(`Restored ${restoredCount} items! Reload page to apply changes now?`)) {
            window.location.reload();
        }
    }

    // Parse imported file
    function handleImportFile(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                applySettingsObject(data);
            } catch (err) {
                alert('Lỗi: File JSON không hợp lệ!');
                console.error(err);
            }
        };
        reader.readAsText(file);
    }

    function applySettingsObject(data) {
        // Handle legacy flat TVSettings backup file vs Victornpb backup vs Full backup
        if (!data.SETTINGS && !data.THEMES && !data.TOOLS) {
            userData.SETTINGS = data;
        } else {
            if (data.SETTINGS) userData.SETTINGS = data.SETTINGS;
            if (data.THEMES) userData.THEMES = data.THEMES;
            if (data.TOOLS) userData.TOOLS = data.TOOLS;
        }

        buildPanelSections();

        // Render SETTINGS
        const secSettings = panel.querySelector('section[data-tool="SETTINGS"]');
        for (const key in userData.SETTINGS) {
            const item = document.createElement('label');
            item.innerHTML = `<input type="checkbox" data-tool="SETTINGS" value="${key}" checked /> ${key}`;
            secSettings.appendChild(item);
        }

        // Render THEMES
        const secThemes = panel.querySelector('section[data-tool="THEMES"]');
        for (const theme in userData.THEMES) {
            const item = document.createElement('label');
            item.innerHTML = `<input type="checkbox" data-tool="THEMES" value="${theme}" checked /> ${theme}`;
            secThemes.appendChild(item);
        }

        // Render TOOLS
        for (const tool in userData.TOOLS) {
            const sec = panel.querySelector(`section[data-tool="${tool}"]`);
            if (sec) {
                for (const tName in userData.TOOLS[tool]) {
                    const item = document.createElement('label');
                    item.innerHTML = `<input type="checkbox" data-tool="${tool}" value="${tName}" checked /> ${tName}`;
                    sec.appendChild(item);
                }
            }
        }

        updateStatus('📂 Backup file loaded! Click "Restore Selected Items" to apply.');
    }

    // Attach Event Listeners
    ui.querySelector('#btnQuickBackup').onclick = () => window.TVBackup();
    ui.querySelector('#btnFetchTemplates').onclick = () => fetchCloudTemplates();
    ui.querySelector('#btnExportFull').onclick = () => exportFullBackup();
    ui.querySelector('#btnImportFile').onclick = () => fileInput.click();
    ui.querySelector('#btnApplyAll').onclick = () => applySelectedItems();
    fileInput.onchange = handleImportFile;

    ui.querySelector('#btnSelectAll').onclick = () => {
        panel.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = true);
    };
    ui.querySelector('#btnUnselectAll').onclick = () => {
        panel.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
    };

    console.log("🚀 TradingView Ultimate Backup Tool loaded!");
})();
