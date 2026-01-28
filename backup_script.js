/**
 * TradingView Favorites Backup Script
 * Run this in the Browser Console (F12 -> Console) on a TradingView Chart page.
 */
(function () {
    if (typeof TVSettings === 'undefined') {
        console.error("TVSettings not found. Please make sure you are on a TradingView Chart page.");
        return;
    }

    const keysToBackup = [
        'chart.favoriteDrawings',
        'IntervalWidget.quicks',
        'symbollist.recents',
        'chart.favoriteIndicators'
    ];

    const backupData = {};
    keysToBackup.forEach(key => {
        const val = TVSettings.getValue(key);
        if (val !== undefined && val !== null) {
            backupData[key] = val;
        }
    });

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradingview_favorites_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Success! Your TradingView favorites backup has been downloaded.", backupData);
})();
