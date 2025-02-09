---
title: '"use client" makes sense'
pubDate: "2025-02-09"
revDate: "2025-02-09"
---

[`"use client"`](https://react.dev/reference/rsc/use-client) is a directive that that marks that a file and it's imports should be client-rendered. Client rendered components can access client reactivity primitives.

When importing a file with `"use client"`, the import get changed to a client reference.

```tsx
// client-file.tsx
"use client";

function Component() {
  return <div>Client rendered</div>;
}

// server-file.tsx (source)
import { Component } from "./client-file.tsx";

// server-file.tsx (similar idea of actual output)
const Component = reference("./client-file.tsx", "Component");
```

---

Why does the compiler do the work of changing the import to a reference, if it could be done manually?

Since it's the client component that uses client side reactivity, it should be it's responsibility to be marked as client rendered.
