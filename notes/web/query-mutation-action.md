---
title: "Query, Mutation, Action model"
pubDate: "2024-12-22"
---

Software developers like to organize functionalities with fancy names.
Sometimes those fancy names define behaviors and assumptions that we try to standardize.

HTTP is one of them. It defines operation methods to an URI, like GET, POST, PUT and DELETE.
Those methods allow tools like browsers to assume properties of the request and response,
like idempotency and cacheability. See [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#name-common-method-properties).

Those standards moved the web forward. Architectural pattern that build on top of HTTP, like REST, dictate how a big percentage of how the web works today.

While HTTP defines semantics for the communication interface between client and server, and provide clients assumptions of the server behavior, the server itself is free to implement those methods as it pleases.

I believe that this makes, in practice, the HTTP protocol be the “framework” for the backend instead of an implementation detail.
How much does _the server_ change if we change the HTTP method of an endpoint?
Probably not much.

Also, using HTTP as a framework makes it easier to build stuff that isn't reliable and future-proof. For example, [cookies are considered inappropriate for REST](https://ics.uci.edu/~fielding/pubs/dissertation/evaluation.htm#sec_6_3_4_2), and assumes a browser environment.

[GraphQL](https://graphql.org/) and [tRPC](https://trpc.io/) are architectures that have HTTP as an implementation detail. Both can arguably provide better developer experience and performance. That is, when implemented correctly, which is _hard_ in GraphQL.

Both have 2 types of operations, **queries and mutations** (subscriptions could be considered a special type of queries), and allow the protocol to take advantage of restrictions imposed on the server.

Another example of an architecture with this pattern is [Convex](https://convex.dev), which is a backend framework and a backend as a service, that inspired my thoughts on this note.

## Operations as a framework

Restricting what each operation can do allows certain optimizations without complicating the server implementation. The basic assumption is making queries idempotent and mutations deterministic.

That means that both queries and mutations can't call external services, since an external service call can't guarantee those properties.

### Queries

Making queries idempotent allows:

- Easier client and server cache of the results. The entire query is wrapped in a cache.
- If a query is requested multiple from multiple places, in the client or server, it could be reduced to a single request or operation.
- Multiple different queries could be sent to the server in **parallel**, avoiding the repetitive overhead of multiple requests, both on the HTTP layer and repetitive tasks on the server, like authorization.
- Real time queries can be implemented on top without much effort, since queries are deterministic and cacheable.

To make them idempotent, queries can only read data, calling other queries if needed.

### Mutations

And making mutations deterministic allows:

- Easier transactional and consistent operations, ACID.
- Smart retries on the client and server.
- Easier to implement optimistic updates, since the deterministic result.

To make them deterministic, mutations can read and write data, calling queries and other mutations if needed.

### Actions.

When a function can't be made deterministic, there should be a **escape hatch**. This escapes the restrictions of queries and mutations, but looses the benefits of the optimizations that those abstractions provides.

That's actions. Actions can call queries and mutations, but should not query the database directly. A restriction that treats actions as a system outside the query and mutation model, allowing the separation of safe and unsafe operations, for free.

## The bigger picture

With that, we have a system where:

- Each action could be called directly from the client.
- Operations can be composed easily.
- Queries and mutations will always be consistent.
- Queries could be made real-time without code changes (only architectural).

And that is without sacrificing the flexibility of server code. A lot of backends as a service solutions with real time capabilities talk directly to the database, using rule systems that are usually hard to scale.

Did I mention that this model composes? Not only with our own code, but can be extended with some sort of component architecture. Like PostgreSQL extensions, but allowing the client to call its operations and having the same properties of the query and mutations with isolation with the rest of the system. _Can your backend do that?_

---

I am loving Convex and how this model just clicks. Check out their blog post about been the [Software Defined Database](https://stack.convex.dev/the-software-defined-database).
