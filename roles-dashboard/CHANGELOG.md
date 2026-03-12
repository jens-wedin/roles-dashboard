# Changelog

## [1.0.1] - 2026-03-12

### Fixed
- Skill badges now wrap long text instead of being clipped

## [1.0.0] - 2026-03-12

### Added
- Light/Dark/System theme toggle with localStorage persistence
- Custom multi-select component built with shadcn/ui Popover + Command
- TypeScript support across the entire codebase
- `tsconfig.json` and `tsconfig.app.json` with strict mode and path aliases
- shadcn/ui components: Card, Badge, Button, Input, Popover, Command, DropdownMenu, Skeleton, Separator
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- README.md and CHANGELOG.md documentation

### Changed
- Migrated UI from custom CSS to shadcn/ui component library
- Replaced custom CSS variables with shadcn/ui theme system (oklch color space)
- Replaced `react-select` with custom shadcn/ui-based multi-select
- Converted all source files from JSX/JS to TSX/TS
- Updated Vite config with Tailwind CSS plugin and `@/` path aliases

### Removed
- `App.css` - all styles now handled by Tailwind utilities and shadcn/ui
- `index.css` custom variables - replaced by shadcn/ui theme system
- `react-select` dependency
