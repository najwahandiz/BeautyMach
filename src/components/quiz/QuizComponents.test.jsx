/**
 * ============================================================
 * 3️⃣ REACT COMPONENT TEST
 * ============================================================
 *
 * WHAT render() DOES:
 * - Renders the component into a fake DOM (jsdom) so we can query it.
 * - We don't need a real browser; tests run in Node with a simulated DOM.
 *
 * WHAT screen.getByText DOES:
 * - Queries the rendered output to find an element by its text content.
 * - If not found, the test fails with a clear message. We test what the user "sees".
 *
 * WHAT fireEvent DOES:
 * - Simulates user actions (click, type, etc.) on the DOM.
 * - Triggers the same events the component would get in a real app.
 *
 * WHY WE TEST BEHAVIOUR, NOT IMPLEMENTATION:
 * - We don't care if the button uses <button> or a div with onClick.
 * - We care: "When the user clicks 'Next', does the onClick callback run?"
 * - So we find by text, click, and assert the callback was called.
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizButton } from './QuizComponents';

describe('QuizButton (React component)', () => {
  // Render the component and check that the label text appears
  test('renders children text', () => {
    render(<QuizButton>Next</QuizButton>);
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  // Simulate a click and verify the onClick handler was called
  test('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<QuizButton onClick={handleClick}>Submit</QuizButton>);
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // When disabled, button should be disabled (behavior the user experiences)
  test('is disabled when disabled prop is true', () => {
    render(<QuizButton disabled>Next</QuizButton>);
    const button = screen.getByText('Next');
    expect(button).toBeDisabled();
  });
});
