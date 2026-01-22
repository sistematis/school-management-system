---
active: true
iteration: 1
max_iterations: 30
completion_promise: "COMPLETE"
started_at: "2026-01-22T12:33:34Z"
---

Implement Persistent Auto-Search with Focus-Locked Filter Input.

Requirements:

- Zero-Latency Input Focus: Guarantee that the cursor remains active in the 'Search by name, roll number, or email...' field during and after the API hit/state update. Prevent the field from blurring or losing focus when the loading state toggles or the student list refreshes.
- Debounced API Integration: Implement a 300ms debounce on the input to trigger the data fetch automatically without a 'Search' button click.
- Ref-Based Focus Management: Use a useRef (or equivalent) to ensure the input DOM element remains stable. If the component must re-render, explicitly re-focus the element programmatically.
- Optimistic UI/Non-Blocking Loading: Ensure the loading indicator does not overlay or disable the input field itself, allowing continuous typing while results are fetched in the background.

Success criteria:

- All requirements implemented
- Manual Verification: Typing continuously in the search bar never requires a re-click to regain focus.
- Tests passing with >80% coverage
- No linter errors
- Documentation updated

Output <promise>COMPLETE</promise> when done.
