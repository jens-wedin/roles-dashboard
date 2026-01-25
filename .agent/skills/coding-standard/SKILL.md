---
name: coding-standard
description: Enforces the architectural and coding standards for JS, React, TypeScript, HTML, CSS, and Accessibility. Use this when writing, refactoring, or reviewing code to ensure premium, high-quality output.
---

# Senior Developer Coding Standards

This skill provides the comprehensive guide for our project's engineering excellence across the full stack. Whenever you are tasked with creating or modifying code, refer to these standards to ensure the output is performant, accessible, and maintainable.

## 1. General Principles
- **Clean Code**: Follow SOLID principles. Code should be self-documenting.
- **DRY (Don't Repeat Yourself)**: Extract common logic into custom hooks or utility functions.
- **KISS (Keep It Simple, Stupid)**: Avoid over-engineering. Preference for readable code over "clever" one-liners.

## 2. TypeScript Standards
- **Strict Mode**: No `any`. Use `unknown` if the type truly isn't known.
- **Interfaces vs. Types**: Use `interface` for object definitions and API contracts. Use `type` for unions, intersections, and primitives.
- **Naming**: Use PascalCase for Interfaces, camelCase for variables/functions.
- **Explicit Returns**: Always define the return type of a function.

## 3. React Standards
- **Functional Components**: Use only functional components with hooks.
- **Prop Destructuring**: Always destructure props in the function signature.
- **Component Size**: Keep components under 150 lines. Extract sub-components if they grow too large.
- **Hooks**: Logic shared between components must live in a custom hook. 
- **Performance**: Use `useMemo` for expensive calculations and `useCallback` for functions passed to memoized children.

## 4. Modern CSS & Styling
- **Aesthetics First**: Use curated color palettes (HSL), modern typography, and smooth transitions.
- **Variables**: Use CSS variables or a theme object for all colors, spacing, and shadows.
- **Transitions**: Every interaction (hover, click) should have a subtle micro-animation.
- **Layout**: Use CSS Grid for high-level layouts and Flexbox for component-level alignment.

## 5. HTML & Semantic Web
- **Structure**: Always use semantic tags (`<header>`, `<footer>`, `<main>`, `<section>`, `<article>`).
- **Hierarchy**: Ensure a logical heading hierarchy (`h1` -> `h2` -> `h3`). Max one `h1` per page.

## 6. Accessibility (A11y)
- **Alt Text**: Every `<img>` must have an `alt` attribute. If decorative, use `alt=""`.
- **Interactive Elements**: Every button or link must have a descriptive label. Use `aria-label` if the text is not present.
- **Keyboard Nav**: Ensure every interactive element is focusable and has a visible `:focus` state.
- **WCAG 2.1 AA**: Aim for high contrast ratios and appropriate touch target sizes (min 44x44px).

## Instructions
1. Before generating code, review these standards.
2. Check `examples/refactor_example.tsx` to see how these principles are applied to turn "Junior" code into "Senior" code.
3. If the user's current codebase violates these standards, proactively suggest refactoring them as part of your task.
