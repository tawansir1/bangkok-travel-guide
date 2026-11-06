# Bangkok Guide

A travel guide to Bangkok for first-time visitors, with a route planner that finds the fastest train and boat route between two places and adds up the real fares.

**Live demo:** https://ะฟไฟืหรพๅ.github.io/bangkok-travel-guide/

![Screenshot](images/screenshot.png)

## Features
- **Route planner.** Type any place or station (English or Thai). It finds the fastest route across BTS, MRT, Airport Rail Link, Gold Line and the Chao Phraya boats, shows each ride with its fare, and compares the cost with a metered taxi.
- **Place pages.** One template page (`place.html?id=...`) shows opening times, tickets, tips and the nearest station for every place.
- **Transit-map design.** Places are drawn as stops on coloured lines, with station badges in the real line colours.
- Mobile-first, keyboard accessible, no frameworks.

## How the route planner works
1. Every station is a node in a graph. Neighbouring stations, walking transfers and boat links are edges, each with a travel time in minutes.
2. **Dijkstra's algorithm** finds the fastest path. The state includes the line you arrived on, so changing lines adds waiting time.
3. The path is split into rides, and each ride is priced with that operator's fare table (`FARES` in `js/data.js`). BTS uses separate rules for the city section and the extensions, capped at 65 THB.
4. The taxi estimate uses the official meter rates over the approximate road distance.

## Project structure
```
index.html        home page
place.html        one page for every place (reads ?id=)
route.html        route planner
css/style.css     all styles
js/data.js        places, stations, fares (edit facts here)
js/router.js      graph, Dijkstra, fare calculation
js/common.js      shared helpers
js/home.js        draws the place list
js/place.js       fills a place page
js/route-page.js  route planner page
images/           photos
```

## Run locally
Open the folder in VS Code and start **Live Server** on `index.html`. No build step is needed.

## Images
Add photos to `images/` with these names. Until a photo exists, the page shows the place's Thai name on its line colour.

`wat-phra-kaew.jpg`, `wat-pho.jpg`, `wat-arun.jpg`, `yaowarat.jpg`, `chatuchak.jpg`, `iconsiam.jpg`, `chao-phraya.jpg`, `lumphini.jpg`

## Data and limits
- Fares were checked in November 2026 and change often. BTS extension fares and the cross-river ferry are estimates.
- Each operator charges separately, so the total is the sum of each ride.
- Travel times are approximate and don't include delays.

## Built with
HTML, CSS, JavaScript (no libraries), IBM Plex Sans Thai.

## Author
Tawan — [GitHub](https://github.com/YOUR-USERNAME)
