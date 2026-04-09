# Layout Formatter Service

This directory contains service-layer logic that shapes event data into the
layout contract consumed by the client.

The main class here is `LayoutFormatter`.

## What `LayoutFormatter` Does

`LayoutFormatter` takes already-formatted event schema objects and compiles them
into a paginated layout plan.

Input:

- `EventSchemaType[]`

Output:

- `PaginatedLayoutSchemaType`

That output is the server-approved layout structure the client render pipeline
can trust and consume directly.

## Why It Lives in the Service Layer

This logic is not UI rendering, but it is still application behavior.

`LayoutFormatter` decides:

- how many events belong on a page
- which positions become hero cards
- which positions become thumbnail cards
- when two events should be grouped into a stack

That makes it service-layer formatting logic rather than a React concern.

## Current Structure

The layout behavior now lives inside `layoutFormatter.ts` instead of being split
across a separate `core/layout` directory.

The public entry point is:

- `compileLayout(events)`

The private helper methods inside the class are:

- `buildLayoutSlots(...)`
- `chunkEventsIntoPages(...)`
- `designateLayoutSlot(...)`
- `getCardSizing(...)`

## Layout Rules

The current rules are deterministic:

- events are chunked into pages of 6
- index `3` becomes a stacked slot when at least 2 events remain
- indexes `2` and `5` become thumbnail cards
- all other card slots become hero cards

Those rules are applied page-by-page.

## Validation

After the layout is assembled, `LayoutFormatter` validates the final structure
with `layoutSlotValidator(...)`.

That ensures only schema-valid layout instructions leave the service layer.

## Why This Exists

Keeping layout compilation on the server gives you:

- deterministic feed structure
- simpler client rendering
- one typed contract between server and UI
- easier pagination behavior

The client is still responsible for rendering the layout, but the server is now
responsible for deciding what the layout should be.
