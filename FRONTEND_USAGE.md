# Frontend usage

This small UI implements an Admin Dashboard for the Agro Agent backend API.

Requirements:
- Backend Spring Boot app running on http://localhost:8080 (default)

Run steps:
1. cd into `agro-agent-web-ui`
2. `npm install`
3. `npm start`

If your backend runs on a different host/port, edit `src/api.js` and update `baseURL`.

Features implemented:
- Left sidebar listing Sales Managers (small contact-like entries)
- Manager detail view: manage products, record sales, view sales history
- Create/update/delete Sales Managers and Products

Notes:
- Axios is used to call backend endpoints
- Styles are minimal and included in `src/App.css` and `src/components/Sidebar.css`
