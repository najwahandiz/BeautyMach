# Testing Guide – Beginner-Friendly

This guide explains how to run tests, how they are organized, and the main concepts so you can explain them clearly during your soutenance.

---

## 1. How to Run Tests

- **Watch mode** (re-runs when you change files):  
  ```bash
  npm test
  ```
- **Single run** (e.g. for CI or a quick check):  
  ```bash
  npm run test:run
  ```

The project uses **Vitest** (because the app is built with Vite). The commands above run all files matching `*.test.js` or `*.test.jsx`.

---

## 2. Folder Structure for Tests

Tests are placed **next to the code they test**, with the same name + `.test.js` or `.test.jsx`:

```
src/
└── features/
    └── cart/
        ├── cartUtils.js
        ├── cartSlice.js
        └── cartSlice.test.js      ← tests for cartSlice
```

This is called **co-located tests**: each test file lives next to the source file. Benefits: easy to find tests and to see what is covered.

---

## 3. What `describe`, `test`, and `expect` Mean

- **`describe('name', () => { ... })`**  
  Groups related tests under one label. In the report you see: `cartSlice > addToCart adds a new item`. It does not run anything by itself; it only organizes tests.

- **`test('what we are testing', () => { ... })`**  
  Defines one test (you can also use `it(...)` – same thing). The string should describe the behaviour in plain language. The function runs once per test; if something throws or an `expect` fails, the test fails.

- **`expect(value)`**  
  Starts an assertion. You chain a matcher to say what you expect:
  - `expect(x).toBe(y)` – strict equality (`===`)
  - `expect(array).toHaveLength(3)`
  - `expect(element).toBeInTheDocument()` (from `@testing-library/jest-dom`)
  - `expect(fn).toHaveBeenCalledTimes(1)` (for mocks)

Example:

```js
test('formats a number as price', () => {
  const price = 19.99;
  const result = `${price.toFixed(2)} MAD`;
  expect(result).toBe('19.99 MAD');
});
```

So: **describe** = group, **test** = one scenario, **expect** = check a value.

---

## 4. What "Mocking" Means (Simple Explanation)

In real life, when you **mock** something you replace it with a fake that you control.

In tests:

- We **don't** want to call the real API (slow, needs network, can fail).
- We **don't** want to use real `localStorage` (could affect other tests or the machine).

So we **mock**: we replace the real function/module with a fake one that returns what we decide.

- Example: `loadCartFromStorage()` is mocked to return `null` so the cart slice tests always start from an empty cart.

**In short:** mocking = "use a fake X so the test only checks what we care about, without side effects."

---

## 5. Suggested Test (Quality Over Quantity)

The cart slice tests give the most value for understanding and for your soutenance:

| # | Test | Why it's useful |
|---|------|------------------|
| 1 | **cartSlice – addToCart** | Core business logic: "when we add an item, state looks like this." Shows reducer testing. |
| 2 | **cartSlice – increaseQuantity** | Covers another key path: updating an existing item. |

Run the cart tests:

- `src/features/cart/cartSlice.test.js`

---

## Quick Recap for Your Soutenance

- **Unit test** = test one unit (function, reducer) in isolation, with mocks for the rest.
- **Pure functions** are the easiest: same input ⇒ same output, no mocks needed.
- **Reducers** = pure functions (state, action) ⇒ new state; we test by calling the reducer and checking the result.

Running the suite: `npm test` or `npm run test:run`.
