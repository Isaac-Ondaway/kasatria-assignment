
# Kasatria 3D Data Visualization

An interactive 3D data visualization web application built with Three.js, Google OAuth and Google Sheets API.

The application retrieves 200 records from Google Sheets and visualizes them as interactive 3D cards through four different layouts.

## Live Demo

**[View Kasatria 3D Visualization](https://kasatria-assignment-alpha.vercel.app/)**

## Features

- **Google Authentication:** Authenticate users through Google OAuth.
- **Google Sheets Integration:** Retrieve spreadsheet data dynamically using Google Sheets API.
- **Interactive 3D Visualization:** Display 200 records using Three.js CSS3DRenderer.
- **Net Worth Color Coding:**
  - Red: Below $100,000
  - Orange: $100,000–$200,000
  - Green: Above $200,000
- **Four Visualization Layouts:**
  - Table: 20 × 10 arrangement
  - Sphere: Spherical arrangement
  - Double Helix: Two intertwined strands
  - Grid: 5 × 4 × 10 arrangement
- **Interactive Controls:** Zoom, rotate and navigate the 3D visualization.

## Technologies Used

| Technology | Purpose |
|---|---|
| JavaScript | Application logic |
| Three.js | 3D visualization |
| CSS3DRenderer | HTML-based 3D objects |
| Google OAuth | User authorization |
| Google Sheets API | Spreadsheet data retrieval |
| PapaParse | CSV parsing during initial development |
| Vite | Development and production build |
| Vercel | Application deployment |

## Getting Started

### Prerequisites

- Node.js
- npm
- Google Cloud project
- Google OAuth Client ID
- Google Sheets API enabled

### Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd kasatria-assignment
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

### Run Locally

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite, usually `http://localhost:5173`.

### Production Build

```bash
npm run build
```

## Google Cloud Configuration

1. Create a Google Cloud project.
2. Enable Google Sheets API.
3. Configure Google OAuth consent screen.
4. Create an OAuth 2.0 Web Client ID.
5. Configure authorized JavaScript origins.
6. Add the required Google accounts as test users if the application remains in Testing mode.

The application requests read-only access to Google Sheets.

## Original Reference and Acknowledgements

This project is based on and adapted from the original Three.js CSS3D Periodic Table example.

- Original project: [Three.js](https://github.com/mrdoob/three.js)
- Original example: [CSS3D Periodic Table](https://github.com/mrdoob/three.js/blob/dev/examples/css3d_periodictable.html)
- License: MIT License

The original example provided the foundation for CSS3D rendering, 3D object positioning, camera controls and animated layout transitions.

This assignment extends the original implementation with Google OAuth authentication, Google Sheets integration, custom person cards, Net Worth-based color coding and a double-helix layout.

All credit for the original implementation belongs to the respective Three.js authors and contributors.

## Deployment

The application is deployed using Vercel.

**Live URL:** https://kasatria-assignment-alpha.vercel.app/

## Acknowledgements

This project is based on and adapted from the original **Three.js CSS3D Periodic Table** example.

- Original project: [Three.js](https://github.com/mrdoob/three.js)
- Original example: [CSS3D Periodic Table](https://github.com/mrdoob/three.js/blob/dev/examples/css3d_periodictable.html)
- Original authors and contributors: Three.js contributors
- License: MIT License

The original implementation provided the foundation for the 3D object positioning, CSS3D rendering, camera controls, and animated layout transitions.

This assignment extends the original example by integrating Google OAuth, Google Sheets API data retrieval, custom person cards, Net Worth-based colour coding, and a double-helix layout.

All credit for the original implementation belongs to the respective Three.js authors and contributors.