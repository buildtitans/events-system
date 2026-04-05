# Service Layer

## Purpose

This directory contains the application layer that sits between the tRPC routers and the database clients.

The goal of this layer is to keep:

- routers thin
- authorization explicit
- business rules testable
- data shaping reusable
- database access focused on persistence instead of orchestration

At a high level, this layer is responsible for deciding **what should happen** for a request, while the DB layer is responsible for **how data is stored or fetched**.

---

## Directory Layout

### `appServices.ts`

Creates the service entry point attached to tRPC context.

- `api` is a `ContextApi` instance
- `layout` is a `LayoutFormatter` instance

### `api/contextApi.ts`

Builds the service graph for each request context:

1. creates a `DBClient`
2. creates a `RoleBasedAccessHandler`
3. creates an `Authorization` policy object
4. creates `Domains`

This gives the app one place where the core service dependencies are wired together.

### `domains/`

Groups the main service classes by domain:

- `session`
- `participations`
- `users`
- `groups`
- `events`
- `notifications`

This is the main API routers call through `ctx.services.api.domains`.

### `services/`

Contains the primary domain services.

Examples:

- `EventService`
- `GroupService`
- `ParticipationsService`
- `SessionService`
- `UserService`
- `NotificationService`
- `LayoutFormatter`

These classes coordinate workflows, enforce policy, and decide which handlers or DB operations are needed.

### `handlers/`

Contains narrower pieces of application logic that would make the services noisy if kept inline.

Examples:

- `GroupLifecycleHandler`
- `MembershipHandler`
- `EventHydrationHandler`
- `ParticipationDtoHandler`
- `CensusHandler`
- `SessionHandler`

These handlers exist to isolate focused orchestration, transformation, and request-specific behavior.

### `auth/`

Contains the authorization layer:

- `Authorization` exposes application-facing guard methods like `requireAuthenticated`, `requireToken`, `requireCanCreateEvent`, `requireCanManageGroup`, and `requireCanChangeMembership`
- `RoleBasedAccessHandler` resolves a user's role in a group and maps that role to allowed actions

### `tests/`

Contains unit tests for the service, handler, and auth layers.

The tests are organized by responsibility:

- `tests/services`
- `tests/handlers`
- `tests/auth`

---

## Request Flow

The usual request path looks like this:

`router -> service/domain -> handler/auth -> db`

For example, `events.newEvent` in the router eventually calls `EventService.createEvent(...)`, which:

1. requires an authenticated user
2. checks whether that user can create an event for the target group
3. delegates persistence to `db.events.createNewEvent(...)`

Another example is RSVP retrieval in `ParticipationsService.getRsvpdEvents(...)`, which:

1. requires authentication
2. loads raw attendance records and groups
3. filters records down to meaningful RSVP states
4. short-circuits early when there are no qualifying RSVPs
5. shapes the response through `ParticipationDtoHandler`

This keeps the routers simple and keeps orchestration in one testable place.

---

## Responsibilities By Layer

### Routers

Routers should stay small.

They are responsible for:

- validating input
- reading request/session context
- calling the appropriate service method
- returning the result

They are not meant to hold business rules or data-shaping logic.

### Services

Services are the main domain entry points.

They are responsible for:

- coordinating use cases
- invoking authorization rules
- delegating focused work to handlers
- selecting the right DB operations
- returning frontend-usable results

Examples in this codebase:

- `EventService` handles event creation, event status updates, event lookup logic, and event hydration entry points
- `GroupService` exposes group reads and delegates lifecycle and membership workflows to handlers
- `ParticipationsService` handles RSVP updates, membership lookups, attendance lookups, and RSVP shaping
- `SessionService` handles login normalization, logout, and session recovery

### Handlers

Handlers pull out focused logic that is still application logic, but narrower than a whole service.

Examples:

- `GroupLifecycleHandler` creates a group and assigns the organizer membership
- `MembershipHandler` handles join/leave behavior and role lookup
- `EventHydrationHandler` assembles drawer-ready event state such as RSVP status, counts, and viewer role
- `ParticipationDtoHandler` shapes RSVP and membership data for the frontend
- `CensusHandler` derives counts and popular event IDs from attendance records
- `SessionHandler` writes and clears the session cookie on the Fastify request/response pair

### Authorization

Authorization is kept out of the routers and mostly out of the DB layer.

`Authorization` is the application-facing policy layer.
`RoleBasedAccessHandler` is the lower-level role/permission resolver.

This makes permission checks explicit and easier to test directly.

### Formatting / Layout

`LayoutFormatter` is part of the service layer because event layout is treated as application-level formatting rather than a UI-only concern.

It:

- paginates event lists
- converts events into card/stack layout slots
- validates the final layout shape before returning it

This allows the client to consume a stable layout contract instead of rebuilding layout decisions itself.

---

## Business Rules In This Layer

Some of the important rules enforced here include:

- authentication is required before mutating RSVP state
- authentication is required before reading viewer-specific membership or RSVP data
- only organizers can create or manage events
- only group members or group organizer can RSVP or change RSVP status to an event
- membership changes are gated by role-aware permission checks
- user-facing membership and RSVP data is shaped into DTOs before leaving the service layer
- some methods short-circuit early when no meaningful data exists, such as when a user has no qualifying RSVP records
- event hydration depends on both viewer state and event context

These rules are intentionally kept here so they are easy to locate, reason about, and test.

---

## Testing Strategy

This layer is covered primarily with unit tests.

The tests focus first on high-ROI behavior:

- authentication and authorization branches
- orchestration across collaborators
- transformation logic
- early returns and edge cases
- permission-sensitive workflows

Examples of direct test coverage in this directory:

- `EventService`
- `ParticipationsService`
- `GroupService`
- `SessionService`
- `UserService`
- `NotificationService`
- `LayoutFormatter`
- `MembershipHandler`
- `EventHydrationHandler`
- `ParticipationDtoHandler`
- `CensusHandler`
- `Authorization`
- `RoleBasedAccessHandler`

The intent is not just coverage for its own sake.
The goal is to protect the code where regressions would most likely break business behavior.

---

## Why This Structure

This service layer is organized this way to make the application easier to:

- test
- refactor
- extend
- reason about

In practice, this structure helps avoid a few common problems:

- routers growing into business-logic controllers
- database clients becoming responsible for application decisions
- authorization checks being scattered across the codebase
- frontend-specific response shaping leaking into unrelated layers

The result is a service layer where the important application behavior has a clear home and a clear set of tests around it.
