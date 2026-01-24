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

## Data Export & Import

This project includes scripts to export data from Supabase to JSON and import JSON changes back to Supabase.

### Quick Start: Syncing GitHub PR Changes

When you receive a PR with changes to `design_roles_data.json`:

```bash
# 1. Merge PR on GitHub, then pull locally
git pull origin main

# 2. Preview what will change
npm run data:import:dry

# 3. Apply the changes
npm run data:import
```

See `DATA_SYNC_GUIDE.md` for detailed instructions.

### Export Data from Supabase

Export all design roles from Supabase to a JSON file:

```bash
node exportData.js
```

This creates `design_roles_data.json` with all records from the database.

### Import Data to Supabase

Import changes from the JSON file back to Supabase:

```bash
# Preview changes without applying them (recommended first step)
node importData.js --dry-run

# Apply changes (insert new + update existing)
node importData.js

# Apply all changes including deletions
node importData.js --delete-orphans

# Preview all changes including deletions
node importData.js --dry-run --delete-orphans
```

**Import Script Features:**
- ✅ **Dry Run Mode**: Preview changes before applying
- ✅ **Smart Upsert**: Updates existing records, inserts new ones
- ✅ **Change Detection**: Only modifies records that have changed
- ✅ **Detailed Logging**: Shows exactly what will change
- ✅ **Safe by Default**: Won't delete records unless `--delete-orphans` is used

### Workflow for GitHub PRs

When you receive a PR with changes to `design_roles_data.json`:

1. **Review the PR** - Check the JSON changes in GitHub
2. **Merge the PR** - Merge to main branch
3. **Pull changes locally** - `git pull origin main`
4. **Preview import** - `node importData.js --dry-run`
5. **Apply changes** - `node importData.js`
6. **Verify** - Check Supabase to confirm changes

**Optional: Automated Sync with GitHub Actions**

A GitHub Actions workflow is included at `.github/workflows/sync-to-supabase.yml` that can automatically sync JSON changes to Supabase when PRs are merged. To enable:

1. Add Supabase credentials to GitHub Secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. The workflow will run on changes to `design_roles_data.json`
3. Manual approval is required before syncing to production


