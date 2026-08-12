# Client Services

This directory contains client-side orchestration that sits between hooks or
Redux thunks and the typed tRPC client. The broader client-state architecture
is documented in the [store README](../README.md).

Services do not own React or Redux state. They accept their dependencies,
perform a client workflow, and return a result for the calling hook or thunk to
handle.

## What Belongs Here

Use a service when an operation includes meaningful client-side behavior such
as:

- selecting an endpoint based on a typed option;
- coordinating multiple related reads;
- transforming or combining server responses;
- applying partial-failure or fallback behavior;
- preparing a request payload shared by multiple callers.

A single tRPC call does not need a service unless the wrapper establishes a
useful boundary or is expected to gain orchestration behavior.

Services should not contain:

- component rendering or React event state;
- Redux dispatches or slice transitions;
- server-side authorization or business rules;
- presentation decisions such as drawer, snackbar, or fallback content.

Hooks own component interaction, thunks own Redux-aware async workflows, and
the server remains authoritative for business rules and access control.

## Organization

```text
services/
├── filter/         # Resolve display filters into domain queries
├── hydration/      # Compose data required to initialize client views
├── notifications/  # Build and submit notification workflows
├── search/         # Query and compile application search results
└── types.ts        # Shared service result types
```

Services receive the typed tRPC client through their constructor. Keeping the
transport dependency explicit makes the workflow easy to test and avoids
coupling it to a particular component or store instance.

## Testing

Keep service tests beside the service they cover. Test observable behavior:

- endpoint selection and forwarded arguments;
- response transformation and composition;
- branching and boundary conditions;
- fallback and failure results;
- request payload construction.

Avoid testing private methods or duplicating assertions already guaranteed by
TypeScript. A service test should protect an application decision or workflow,
not merely increase a coverage percentage.
