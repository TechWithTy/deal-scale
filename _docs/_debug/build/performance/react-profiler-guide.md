# React DevTools Profiler Guide

**Purpose:** Use React DevTools Profiler to verify component rendering optimizations, identify re-render issues, and measure performance improvements.

---

## 📦 Setup

### 1. Install React DevTools Extension

**Chrome/Edge:**
- Install from [Chrome Web Store](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

**Firefox:**
- Install from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

**Standalone (if extension doesn't work):**
```bash
npm install -g react-devtools
# Then run: react-devtools
```

---

## 🎯 Using the Profiler

### Step 1: Open DevTools & Select Profiler Tab

1. Open your app in the browser (`http://localhost:3000`)
2. Press `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
3. Look for the **React DevTools** tabs at the top (separate from browser DevTools)
   - If you don't see React tabs, the extension isn't installed or active
4. Click the **"Profiler"** tab (usually has a flame/graph icon)

### Step 2: Start Recording

1. Click the **circular "Record" button** (usually blue/red) at the top left
   - Button turns red when recording
2. Perform actions on your page that you want to profile:
   - **Initial page load** (reload the page)
   - **Scroll through the page** (triggers lazy-loaded components)
   - **Click buttons/interactions**
   - **Navigate between routes**
3. Click the **"Stop" button** to end recording

---

## 📊 Understanding the Profiler View

### Flamegraph View (Default)

**What it shows:**
- Component tree with render time bars
- **Bar width** = time spent rendering that component
- **Color intensity** = commit phase (yellow = slower)

**What to look for:**
- ✅ **Thin bars** = fast renders (< 16ms)
- ⚠️ **Wide bars** = slow renders (> 16ms)
- 🔴 **Red/yellow bars** = performance bottlenecks

### Ranked View

**What it shows:**
- Components sorted by render time (slowest first)
- Shows commit time per component

**What to look for:**
- Components at the top = biggest performance impact
- Check "Actual Duration" vs "Base Duration"
  - **Actual Duration** = time including children
  - **Base Duration** = time for component alone

---

## ✅ Verifying Our Optimizations

### 1. Code Splitting (Dynamic Imports)

**What to check:**
- Scroll down the page and watch for components loading
- In the Profiler, you should see:
  - Initial render shows only above-the-fold components (`HeroSessionMonitorClientWithModal`, `Services`, `TrustedByScroller`)
  - Below-the-fold components (`AboutUsSection`, `CaseStudyGrid`, etc.) appear **after** scroll triggers them

**How to verify:**
1. Start recording
2. Reload the page
3. Stop recording immediately (before scrolling)
4. Check Flamegraph - you should **NOT** see `AboutUsSection`, `CaseStudyGrid`, `Pricing`, etc. in the initial render
5. Start new recording
6. Reload page, scroll down
7. Stop recording
8. Now you should see those components appear

### 2. Component Re-renders

**What to check:**
- Components should not re-render unnecessarily
- Look for components with **multiple commits** when props haven't changed

**How to verify:**
1. Record an interaction (e.g., clicking a button)
2. In Ranked view, check if unrelated components re-render
3. Click on a component in Flamegraph to see:
   - **"Why did this render?"** - shows if props/state changed
   - If it says "The parent component rendered" but props didn't change, that's a problem

### 3. Expensive Renders

**What to check:**
- Components with long render times
- Look for components with **Actual Duration > 16ms** (target for 60fps)

**How to verify:**
1. Use Ranked view after a recording
2. Sort by "Actual Duration"
3. Focus on components at the top of the list
4. Click to see what's causing slow renders

---

## 🔍 Common Issues to Look For

### Issue 1: Unnecessary Re-renders

**Symptom:**
- Component renders multiple times with same props
- "Why did this render?" shows "The parent component rendered" without prop changes

**Fix:**
- Use `React.memo()` for expensive components
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for stable function references

### Issue 2: Expensive Calculations in Render

**Symptom:**
- Component has high "Base Duration"
- Slow to render even in isolation

**Fix:**
- Move calculations to `useMemo()`
- Extract heavy logic to separate hooks
- Consider virtualization for long lists

### Issue 3: Large Component Trees

**Symptom:**
- Many small components render together
- High "Actual Duration" but low "Base Duration"

**Fix:**
- Use code splitting (already done with dynamic imports)
- Lazy load sections of the tree
- Virtualize long lists

### Issue 4: Props Changing on Every Render

**Symptom:**
- "Why did this render?" shows props changed, but they look the same
- Inline functions/objects being created

**Fix:**
- Move functions/objects outside render or use `useCallback()`/`useMemo()`
- Use stable references for props

---

## 📈 Performance Metrics to Track

### Before Optimizations (Baseline)

Record and note:
- **Total commit time** (bottom of Profiler)
- **Components rendered** (count in Flamegraph)
- **Slowest component** (top of Ranked view)
- **Re-render count** (how many commits for same component)

### After Optimizations

Compare to baseline:
- ✅ **Total commit time** should decrease
- ✅ **Components rendered** on initial load should decrease (code splitting)
- ✅ **Slowest component** render time should improve
- ✅ **Re-render count** should decrease for memoized components

---

## 🎬 Step-by-Step Testing Guide

### Test 1: Initial Page Load ⚠️ **IMPORTANT: Workaround for Reload Issue**

**Problem:** React DevTools reloads with the page, making it hard to capture initial load.

**Solution - Method 1: Record Before Navigation (Recommended)**
1. **Start with page already loaded** (any page on your site)
2. Open React DevTools Profiler tab
3. Click **"Record"** (red circle) - recording should start
4. **Navigate to the page you want to test** (e.g., type `http://localhost:3000` in address bar and press Enter)
   - OR use browser navigation to go to a different route
5. Wait for page to fully load
6. Click **"Stop"** to end recording

**Solution - Method 2: Quick Reload**
1. Open React DevTools Profiler tab
2. Click **"Record"** immediately (as fast as possible)
3. **Quickly press `Ctrl+R` or `Cmd+R`** to reload
4. The Profiler should capture the reload
5. Wait for page to fully load
6. Click **"Stop"**

**Solution - Method 3: Use Browser Performance Tab (Best for Initial Load)**
1. Open browser DevTools (F12)
2. Go to **"Performance"** tab (NOT React Profiler)
3. Click **"Record"** (circle icon)
4. Reload page (`Ctrl+R` or `Cmd+R`)
5. Wait for page to fully load
6. Click **"Stop"**
7. This shows overall page load including React renders

**Solution - Method 4: Record Multiple Commits**
1. Start recording
2. Reload page
3. Let it record for 2-3 seconds after load
4. Stop recording
5. In the timeline, click on the **first commit** (leftmost) to see initial render

**Expected Results:**
- Only above-the-fold components render initially
- Total commit time < 100ms (ideal)
- Components like `AboutUsSection`, `Pricing`, `ContactForm` should NOT appear in the first commit

### Test 2: Scroll to Load Lazy Components

1. **First, let the page fully load** (wait 2-3 seconds after initial load)
2. Open React DevTools Profiler
3. Click **"Record"**
4. Scroll down the page slowly (at normal scroll speed)
5. Stop after scrolling past all sections

**Expected Results:**
- Components appear as you scroll (triggered by `ViewportLazy`)
- Each component loads separately (code splitting working)
- New commits appear in timeline as components enter viewport
- No unnecessary re-renders of already-loaded components

**Tip:** You can see when components load by watching the commit timeline at the bottom - new commits appear as you scroll.

### Test 3: Interaction Testing

1. Start recording
2. Click buttons, interact with forms, etc.
3. Stop recording

**Expected Results:**
- Only components that need to update re-render
- No cascade of unnecessary re-renders
- Fast response times (< 16ms for smooth 60fps)

---

## 🛠️ Advanced Tips

### Filtering Components

- Use the search box to filter specific components
- Useful for finding all instances of a component

### Commits Timeline

- Click on different commits in the timeline to see different render phases
- Compare commits to see what changed between renders

### Component Details

- Click on any component in Flamegraph to see:
  - Props and state
  - Render time breakdown
  - Why it rendered
  - When it last rendered

### Saving Profiles

- Click "Save profile" to export a `.json` file
- Share with team or compare before/after optimizations

---

## 🎯 Quick Checklist for Our Optimizations

After running the Profiler, verify:

- [ ] Initial load shows only `HeroSessionMonitorClientWithModal`, `Services`, `TrustedByScroller`
  - **Check:** Look at the first commit in the timeline after reload
  - **Filter:** Search for `AboutUsSection` - should NOT appear in first commit
- [ ] Below-the-fold components (`AboutUsSection`, `CaseStudyGrid`, etc.) load on scroll
  - **Check:** Scroll during recording - see new commits appear in timeline
- [ ] Total commit time on initial load < 100ms
  - **Check:** Bottom of Profiler shows total time for selected commit
- [ ] No unnecessary re-renders when scrolling
  - **Check:** Components should only render once when entering viewport
- [ ] Components wrapped in `ViewportLazy` only render when in viewport
  - **Check:** Components appear in timeline when scrolled into view, not before
- [ ] Dynamic imports work (components load asynchronously)
  - **Check:** Components appear in separate commits, not all at once
- [ ] Memoized components don't re-render with same props
  - **Check:** Click component, see "Why did this render?" - should not show unnecessary renders

## 💡 Pro Tips for Load Testing

### Tip 1: Use the Timeline
- After recording, the timeline at the bottom shows all commits
- **Click on the first commit** (leftmost) to see initial render
- This is easier than trying to catch the reload

### Tip 2: Filter Components
- Use the search box to filter for specific components
- Type `AboutUsSection` to see if it appears in first commit (it shouldn't)

### Tip 3: Compare Commits
- Click through different commits in the timeline
- Compare first commit (initial load) vs later commits (after scroll)
- First commit should have fewer components

### Tip 4: Use Browser Performance Tab for Overall Load
- Browser's Performance tab (not React Profiler) is better for:
  - Overall page load time
  - Network requests
  - JavaScript execution time
  - React Profiler is better for component-level analysis

### Tip 5: Clear Cache Between Tests
- Use `Ctrl+Shift+R` (or `Cmd+Shift+R`) for hard reload
- This ensures you're testing fresh load, not cached resources

---

## 📚 Resources

- [React Profiler Docs](https://react.dev/learn/react-developer-tools#profiler)
- [Profiler API](https://react.dev/reference/react/Profiler)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

---

**Last Updated:** Nov 1, 2025  
**Related:** `_docs/_debug/build/performance/implementation-status.md`

