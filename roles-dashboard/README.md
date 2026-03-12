# Design Roles Dashboard

A curated collection of design industry roles and responsibilities. Browse, search, and filter roles by industry, organizational level, and medium.

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for bundling and development
- **shadcn/ui** component library (Base Nova style)
- **Tailwind CSS v4** for styling
- **Supabase** for data backend
- **Lucide React** for icons

## Features

- Searchable role catalog with debounced search
- Multi-select filters for Industry, Org-Level, and Medium
- Clickable badges to quickly add filters from role cards
- Light/Dark/System theme toggle with localStorage persistence
- Responsive grid layout
- Accessible UI with ARIA labels, keyboard navigation, and screen reader support
- GitHub Pages deployment

## Setup

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/jenswedin/roles-dashboard.git
    cd roles-dashboard
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Supabase Configuration:**
    Create a `.env` file in the root of the `roles-dashboard` directory:
    ```
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```
    Ensure your Supabase database has a `design_roles` table with columns like `role-name`, `description`, `responsibilities`, `skills`, `industry`, `org-level`, and `medium`.

4. **Run Locally:**
    ```bash
    npm run dev
    ```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run data:export` | Export data from Supabase |
| `npm run data:import` | Import data to Supabase |

## Project Structure

```
src/
  components/
    ui/                # shadcn/ui components (Card, Badge, Button, Input, etc.)
    mode-toggle.tsx    # Light/Dark/System theme toggle
    theme-provider.tsx # Theme context provider
    Filters.tsx        # Search and multi-select filter controls
    RoleCard.tsx       # Individual role card display
    RoleList.tsx       # Grid container for role cards
  lib/
    utils.ts           # cn() utility for class merging
  utils/
    utils.ts           # formatToList(), getBadgeColor() helpers
  types.ts             # TypeScript interfaces (Role, FilterOption)
  App.tsx              # Main application component
  main.tsx             # Entry point with ThemeProvider
  supabaseClient.ts    # Supabase client configuration
```

## Deployment to GitHub Pages

The git repository root is the parent directory, so `gh-pages` needs an explicit `--repo` flag:

```bash
npm run build
npx gh-pages -d dist --repo "$(git -C .. remote get-url origin)"
```

Deployed at: https://jens-wedin.github.io/roles-dashboard/

Ensure GitHub Pages is configured to deploy from the `gh-pages` branch in repository settings.

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

```bash
node exportData.js
```

### Import Data to Supabase

```bash
# Preview changes without applying them
node importData.js --dry-run

# Apply changes (insert new + update existing)
node importData.js

# Apply all changes including deletions
node importData.js --delete-orphans
```
