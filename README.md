I built a real-time web app that aggregates and filters gold market news using JavaScript and RSS feeds
# Gold Insight Atlas

A simple web app that aggregates and displays gold-related news and insights from multiple global sources in real-time.

## 🚀 Features

* 📡 Fetches live RSS feeds from major business news sources
* 🔍 Filters content using gold-related keywords (gold, inflation, central bank, etc.)
* 🧠 Automatically tags relevant topics
* 🔄 Auto-refresh every 5 minutes
* 🌐 Clean and responsive UI
* 🏦 Includes curated institutional research links (ACCA, banks, etc.)

## 🛠️ Tech Stack

* HTML
* CSS
* JavaScript (Vanilla JS)
* RSS to JSON API

## ⚙️ How it works

1. RSS feeds are defined in `sources.js`
2. The app fetches data using a public RSS-to-JSON API
3. Content is filtered using predefined keywords
4. Matching articles are displayed in a dynamic grid
5. The app refreshes automatically every 5 minutes

## 📁 Project Structure

* `index.html` – Main structure of the website
* `styles.css` – UI design and layout
* `app.js` – Core logic (fetching, filtering, rendering)
* `sources.js` – RSS feeds, keywords, and institutions

## 📌 Notes

* Runs fully in the browser (no backend required)
* Uses demo data if RSS feeds fail
* Can be customized by editing `sources.js`

## ⚠️ Disclaimer

This project is for educational purposes only and does not provide financial advice.

## 💡 Future Improvements

* Add backend proxy for reliable RSS fetching
* Add search and filtering UI
* Add user personalization
* Deploy online

---
