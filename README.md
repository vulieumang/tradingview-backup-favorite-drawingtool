# TradingView Favorites Backup & Restore

A simple set of JavaScript utilities to backup and restore your TradingView favorite drawing tools, timeframes, and indicators locally.

## Features

- **Local Backup**: Export your TradingView settings to a JSON file.
- **Easy Restore**: Import your settings back by simply selecting the JSON file.
- **No Account Required**: Works for both signed-in and guest users (though guest settings are usually lost anyway).
- **Comprehensive**: Backs up favorite drawing tools, quick intervals, recent symbols, and favorite indicators.

## How to Use

### 1. Backup Your Settings

1. Open your **TradingView Chart**.
2. Press `F12` to open the **Developer Tools** and navigate to the **Console** tab.
3. Copy all code from [`backup_script.js`](./backup_script.js) and paste it into the console.
4. Press **Enter**. A JSON file named `tradingview_favorites_backup_YYYY-MM-DD.json` will be downloaded to your computer.

### 2. Restore Your Settings

1. Open the **TradingView Chart** where you want to restore settings.
2. Open the **Console** (`F12`).
3. Copy all code from [`restore_script.js`](./restore_script.js) and paste it into the console.
4. Press **Enter**. A file picker window will appear.
5. Select your previously saved JSON backup file.
6. A confirmation dialog will appear; click **OK** to refresh the page and apply the changes.

## Data Saved

The tool exports the following keys from `TVSettings`:
- `chart.favoriteDrawings`: Favorite drawing tools.
- `IntervalWidget.quicks`: Favorite timeframes.
- `symbollist.recents`: Recently viewed symbols.
- `chart.favoriteIndicators`: Favorite indicators.

## Disclaimer

TradingView typically syncs these settings to your account in the cloud. Using this tool is useful for:
- Moving settings between different accounts.
- Keeping a local history of your favorite tools.
- Restoring settings if they get accidentally reset.

> [!IMPORTANT]
> Always refresh the page after restoring to ensure the UI updates correctly.
