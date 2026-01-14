# Design Roles Dashboard

This project is a React application built with Vite that displays a dashboard of design roles and their metadata, fetched from a Supabase database.

## Features

*   **Vite + React:** Modern frontend development setup.
*   **Supabase Integration:** Connects to a Supabase database to fetch design role data.
*   **Dynamic Role Cards:** Displays each design role in a card format, showing the role name, description, responsibilities, and skills.
*   **Colorful Badges:** Dynamically generated colorful badges for 'Industry', 'Org-Level', and 'Medium' properties.
*   **Multi-Select Filters:** Allows users to filter roles by 'Industry', 'Org-Level', and 'Medium' using `react-select` multi-select dropdowns. The 'Industry' filter also handles comma-separated values from the database.
*   **Bullet Point Lists:** Transforms plain text lists in 'Responsibilities' and 'Skills' into proper HTML bullet points.
*   **GitHub Pages Deployment Ready:** Configured for easy deployment to GitHub Pages.

## Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/jenswedin/roles-dashboard.git
    cd roles-dashboard
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Supabase Configuration:**
    *   Create a `.env` file in the root of the `roles-dashboard` directory.
    *   Add your Supabase project URL and public `anon` key:
        ```
        VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
        VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
        ```
    *   Ensure your Supabase database has a `design_roles` table with columns like `role-name`, `description`, `responsibilities`, `skills`, `industry`, `org-level`, and `medium`.
    *   Configure Row Level Security (RLS) policies in your Supabase project to allow `SELECT` access for the `anon` role on the `design_roles` table.

4.  **Run Locally:**
    ```bash
    npm run dev
    ```
    Open your browser to `http://localhost:5173/` (or the address provided in your terminal).

## Deployment to GitHub Pages

This project is configured for deployment to GitHub Pages.

1.  **Install `gh-pages` (if not already installed):**
    ```bash
    npm install gh-pages --save-dev
    ```

2.  **Update `package.json`:**
    Ensure your `package.json` includes the `homepage` and `deploy` script:
    ```json
    {
      "name": "roles-dashboard",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "homepage": "https://jenswedin.github.io/roles-dashboard/", // Add this line
      "scripts": {
        "dev": "vite",
        "build": "vite build",
        "lint": "eslint .",
        "preview": "vite preview",
        "deploy": "gh-pages -d dist" // Add this line
      },
      "dependencies": {
        // ...
      },
      "devDependencies": {
        // ...
        "gh-pages": "^6.3.0", // Ensure gh-pages is listed here
        // ...
      }
    }
    ```
    **Important:** Replace `jenswedin` with your GitHub username and `roles-dashboard` with your repository name in the `homepage` URL if different.

3.  **Update `vite.config.js`:**
    Ensure your `vite.config.js` includes the `base` option:
    ```javascript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
      base: '/roles-dashboard/', // Add this line (must match your repository name)
    })
    ```

4.  **Deploy:**
    ```bash
    npm run build
    npm run deploy
    ```

5.  **Enable GitHub Pages:**
    Go to your GitHub repository settings -> "Pages" and ensure that GitHub Pages is configured to deploy from the `gh-pages` branch.

Your application will then be accessible at the URL specified in your `homepage` field (e.g., `https://jenswedin.github.io/roles-dashboard/`).
