# Theme System Documentation

## Color Conversion Reference

| Old Color Class | New Theme Class     | Usage Context                         | Example Usage                          |
| --------------- | ------------------- | ------------------------------------- | -------------------------------------- |
| `cyber-blue`    | `primary`           | Primary brand color, main CTAs        | `bg-primary`, `text-primary`           |
| `cyber-purple`  | `focus`             | Focus states, secondary accents       | `border-focus`, `to-focus/30`          |
| `cyber-accent`  | `accent`            | Accent colors, highlights             | `from-accent/20`, `text-accent`        |
| `cyber-neon`    | `accent`            | Bright highlights, important elements | `border-accent`, `shadow-accent`       |
| `cyber-darker`  | `background-darker` | Dark backgrounds                      | `bg-background-darker`                 |
| `cyber-dark`    | `background-dark`   | Slightly lighter dark backgrounds     | `bg-background-dark`                   |
| `cyber-card`    | `card`              | Card backgrounds                      | `bg-card`, `border-card`               |
| `cyber-glow`    | Custom Glow Class   | Glowing effects                       | See "Glow Effect Implementation" below |

## Theme Implementation

### 1. Root Layout Setup

In `src/app/layout.tsx`:

```tsx
<body className="theme-cyberoni min-h-screen bg-background font-sans antialiased">
  {/* Your app content */}
</body>
```

### 2. Theme Variables

The theme is defined in `src/index.css` with CSS variables:

```css
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 263.4 100% 50%;
  --primary-foreground: 0 0% 100%;
  --accent: 316.4 100% 50%;
  --accent-foreground: 0 0% 100%;
  --focus: 271.8 91.3% 65.1%;
  --focus-foreground: 0 0% 100%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 263.4 100% 50%;
}
```

### 3. Glow Effect Implementation

We've added reusable glow utility classes to make it easier to add glow effects:

#### Basic Glow

```tsx
<div className="glow">
  <!-- Your content -->
</div>
```

#### Hover Glow

```tsx
<button className="glow glow-hover">Hover for glow</button>
```

#### Active/Selected State

```tsx
<button className="glow glow-active">Active Glow</button>
```

#### Combining with Other Classes

```tsx
<Card className="glow hover:glow-active">
  <CardHeader>
    <CardTitle>Glowing Card</CardTitle>
  </CardHeader>
  <CardContent>This card has a subtle glow effect</CardContent>
</Card>
```

#### Customization

You can adjust the glow intensity by overriding the opacity:

```tsx
<div className="glow before:opacity-30">Lighter glow</div>
```

### 4. Common Patterns

#### Theme-Aware Assets & UI Patterns

- **Logo & Images:**
  - Use Tailwind's `dark:block` and `dark:hidden` utilities to conditionally render light/dark logo assets:
    ```tsx
    <Image
      src="/logos/Logo_Dark_Text.png"
      alt="Logo"
      className="block dark:hidden"
      ...
    />
    <Image
      src="/logos/Logo_Light_Text.png"
      alt="Logo"
      className="hidden dark:block"
      ...
    />
    ```
- **Category/Filter Pills:**
  - Use theme tokens for background, border, and text (e.g., `bg-accent`, `text-accent-foreground`, `border-focus`).
  - For clear/"x" buttons, use `flex items-center justify-center rounded-full` for centering and shape, and theme colors for bg/text.
  - Example:
    ```tsx
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground ...">×</span>
    ```
- **Carousel/Slider Indicators:**
  - Use theme-aware borders and backgrounds for dots (e.g., `border-neutral-200 dark:border-neutral-700 bg-black/20 dark:bg-white/20`).
  - Ensure high contrast and visibility in both themes.
- **Accessibility:**
  - Always provide `aria-label` and `aria-selected` for interactive elements.
  - Use `focus:ring-*` utilities for visible focus states.
- **Alignment:**
  - Use `flex` utilities (`items-center`, `justify-center`) for perfect centering/alignment of icons and buttons.

#### Buttons

```tsx
// Primary button
<Button className="bg-gradient-to-r from-primary to-focus text-white">
  Click me
</Button>

// Outline button
<Button variant="outline" className="border-border hover:bg-accent/10">
  Secondary
</Button>
```

#### Cards

```tsx
<div className="rounded-lg border border-border bg-card p-6">
  <h3 className="text-foreground">Card Title</h3>
  <p className="text-muted-foreground">Card content</p>
</div>
```

### 5. Best Practices

1. **Use Theme Variables**: Always use theme variables instead of hardcoded colors
2. **Theme-Aware Assets**: Use Tailwind's `dark:` utilities to switch images/logos for dark/light mode
3. **Opacity Control**: Use opacity modifiers (e.g., `primary/80`) for hover states
4. **Dark Mode**: The theme includes dark mode by default
5. **Consistent Spacing**: Use the spacing scale (0.25rem = 1)
6. **Responsive Design**: Use responsive prefixes (sm:, md:, lg:, xl:)
7. **Accessible UI**: Always provide aria-labels, focus rings, and use semantic HTML for interactive elements
8. **Alignment**: Use flex utilities for centering icons/buttons, especially for pills and close/clear buttons

### 6. Adding New Theme Colors

To add a new color to the theme:

1. Add the color to `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      // ... existing colors
      'new-color': 'hsl(var(--new-color) / <alpha-value>)',
    }
  }
}
```

2. Add the CSS variable in `:root` in `index.css`:

```css
:root {
  --new-color: 200 100% 50%;
}
```

3. Use it in your components:

```tsx
<div className="text-new-color">New color text</div>
```
