# FlowMoney 記帳

這是一個可直接部署到 GitHub Pages 的 iPhone 友善個人財務總覽網頁。

## 功能

- 淨資產、資產、負債、投資市值總覽
- 資產帳戶與負債管理
- 投資持股管理，只輸入台股代號與股數，程式用最近收盤價自動計算市值
- 台股價格由 GitHub Actions 更新到同站 `prices.json`，避免 iPhone 瀏覽器跨網域抓價失敗
- 收入、支出、刷卡消費與還款直接在各帳戶/負債項目上操作
- 資料儲存在瀏覽器 `localStorage`
- iPhone 加入主畫面後可用近似 App 的體驗

## GitHub Pages

部署後到 GitHub repository 的 `Settings` → `Pages`，將來源設為 `Deploy from a branch`，分支選 `master`，資料夾選 `/root`。
