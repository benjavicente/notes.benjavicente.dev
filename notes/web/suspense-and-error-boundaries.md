---
title: "Why there are Suspense and Error Boundaries"
pubDate: "2024-12-21"
revDate: "2024-12-22"
---

Components should compose. To compose they need to be decoupled.

```tsx
function Component() {
  const { data, isError, isLoading } = useQuery();
  if (isLoading) return <Loading />;
  if (isError) return <Error />;
  return ...
}
```

That is coupled. It doesn't work when we scale.

```tsx
function App() {
  return (
    <>
      <ComponentA />
      <ComponentB />
    </>
  );
}
function ComponentA() {
  const { data, isError, isLoading } = useQueryA();
  return ...
}

function ComponentB({ data }) {
  const { data, isError, isLoading } = useQueryB();
  return ...
}
```

What if we wanted to show a loading or error component when both components are loading or one of them has an error?
This is a common pattern that should be considered in the component composability of the library, specially since loading and error UI is normally different from the main UI.

```tsx
function App() {
  const { data: dataA, isError: isLoadingA, isLoading: isLoadingA } = useQueryA();
  const { data: dataB, isError: isLoadingB, isLoading: isLoadingB } = useQueryB();

  if (isLoadingA || isLoadingB) return <Loading />;
  if (isErrorA || isErrorB) return <Error />;

  return (
    <>
      <ComponentA data={dataA} />
      <ComponentB data={dataB} />
    </>
  );
}
```

That's awful code. If only the component itself can handle their loading and error states, we can't compose them. Data would tend to be far away where it's used.

Errors and loading state should bubble up in the component tree.

```tsx
function App() {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        {/* Components only responsibility is to render their stuff */}
        <ComponentA />
        <ComponentB />
      </Suspense>
    </ErrorBoundary>
  );
}
```

With that, loading and error handling can be composed freely.

---

There could be another states besides loading and error, but there aren't as common as those two. Think like what type of error you see in the browser. Normally one could see HTTP errors and a loading states, nothing more.

---

Error and suspense boundaries not only helps on composability,
but also on providing better integration with other tools.

Suspense is used commonly with streaming, for example, in [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense).

Error boundaries as a code primitive allow libraries to provide global error reporting, like the [`onXError` methods in React's `createRoot`](https://react.dev/reference/react-dom/client/createRoot#parameters).
