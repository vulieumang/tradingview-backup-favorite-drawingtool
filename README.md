# TradingView Ultimate Backup & Restore Tool

A comprehensive JavaScript utility to backup and restore **all** TradingView settings, including local favorites (drawing tools, timeframes, indicators, recent symbols) and cloud-synced **Drawing Tool Templates & Themes**.

> Combined and upgraded from local TVSettings backup & [victornpb/tradingview-backup](https://github.com/victornpb/tradingview-backup).

---

## 🌟 Key Features

1. **⚡ Quick Favorites Backup & Restore**: Backup local favorites, timeframes (`IntervalWidget.quicks`), recent symbols, and indicator favorites instantly via `TVSettings`.
2. **☁️ Cloud Drawing Templates & Themes**: Fetch, export, and restore custom drawing tool templates (Fib, Trendline, Gann, Risk/Reward, Text, Shapes, etc.) and Chart Color Themes via TradingView API endpoints.
3. **🎛️ Interactive GUI & Floating Button**:
   - Floating Action Button `🛠️` on the bottom-right corner to open/close the panel anytime.
   - Individual item selection list with "Select All" / "Unselect All".
   - Progress bar & live status updates during cloud fetching/restoring.
4. **📂 Smart File Compatibility**: Supports importing:
   - Full Ultimate Backup files (`.json`)
   - Legacy `TVSettings` backup files
   - `victornpb/tradingview-backup` files

---

## 🚀 How to Use

1. Open any **TradingView Chart** page.
2. Press `F12` (or `Cmd+Option+I` on Mac) to open **Developer Tools** and switch to the **Console** tab.
3. Copy all code from [`script.js`](./script.js) and paste it into the console.
4. Press **Enter**.

### Panel Controls:
- **⚡ Quick Favorites Backup**: Instantly download local favorites & settings.
- **☁️ Fetch Cloud Templates & Themes**: Fetch all your saved drawing templates & color themes from TradingView servers.
- **📁 Export Full Backup JSON**: Export selected items into a single backup file.
- **📂 Load Backup File**: Import a `.json` backup file from your device.
- **🚀 Restore Selected Items**: Apply all selected settings, themes, and drawing templates back to TradingView.

---

## 📁 Project Structure

- [`script.js`](./script.js): Combined Ultimate Backup & Restore Tool (Recommended).
- [`backup_script.js`](./backup_script.js): Standalone local backup script.
- [`restore_script.js`](./restore_script.js): Standalone local restore script.

---

## ⚠️ Important Note

Always refresh the TradingView chart page after restoring to ensure all settings, themes, and templates are properly loaded by the interface!
