# Debugging React Hooks Errors in Blog Components

## Common Error: "Rendered more hooks than during the previous render"

### What it Means

This error occurs when the number or order of React hooks (useState, useEffect, useMemo, etc.) changes between renders. It usually happens if hooks are called conditionally, inside loops, or after a return statement.

---

## Checklist for Debugging

### 1. **Hooks Placement**

- Always declare all hooks at the top of your component.
- Never call hooks inside conditionals, loops, or after an early return.

### 2. **Early Returns**

- Early returns (like loading spinners or error messages) must come **after** all hooks.
- Example (correct):
  ```tsx
  const [data, setData] = useState(null);
  if (!data) return <Spinner />;
  ```
- Example (incorrect):
  ```tsx
  if (!data) return <Spinner />;
  const [data, setData] = useState(null); // ❌
  ```

### 3. **Custom Hooks**

- Ensure custom hooks (e.g. `useHasMounted`) do not call hooks conditionally.
- Example of a safe custom hook:
  ```tsx
  export function useHasMounted() {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
      setHasMounted(true);
    }, []);
    return hasMounted;
  }
  ```

### 4. **Child Components**

- If a child component breaks the Rules of Hooks, it can cause errors in the parent.
- Audit all children for conditional hooks or hooks after returns.

### 5. **Hot Reload/Dev Server**

- Sometimes, Fast Refresh or a stale dev server can cause false positives. Restart your dev server if you see persistent issues.

---

## Example: Safe Blog Component Pattern

```tsx
export default function BlogPostPageClient({ slug }) {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasMounted = useHasMounted();
  // ...other hooks

  if (!hasMounted) return <Spinner />;
  if (isLoading) return <Spinner />;
  if (!post) return <ErrorMsg />;

  // ...render post
}
```

---

## Advanced: Debugging Steps

- Grep for `return` and check for hooks after returns.
- Grep for `use` and check for conditional/looped hooks.
- Check for dynamic imports or feature flags that swap components at runtime.
- Review custom hooks and children.

---

## References

- [Rules of Hooks (React Docs)](https://react.dev/reference/rules/rules-of-hooks)
- [React Docs: Hooks FAQ](https://react.dev/reference/react/hooks#hooks-faq)

---

_Last updated: 2025-05-17_
