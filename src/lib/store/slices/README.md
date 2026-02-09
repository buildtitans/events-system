## Dynamic data in Redux Toolkit slices is modeled using discriminated unions.

#### Why?
• Async data is modeled as a discriminated union state machine instead of nullable values and boolean flags.
• This removes impossible states and makes render logic predictable and exhaustive.

#### How this affects UI architecture


Components render directly from the state machine using exhaustive `switch` statements.

Instead of checking multiple booleans or null values, components can map state → UI in a single, predictable render pipeline:

• `idle` → nothing selected / drawer closed  
• `pending` → skeletons or loading spinners  
• `failed` → error or fallback UI  
• `ready` → fully hydrated content  

This keeps rendering logic simple, colocates loading and error transitions with the data they belong to, and prevents UI from entering inconsistent states.



##### @/src/lib/store/slices/events/eventDrawerSlice.ts

```ts
type OpenedEvent = { status: "idle" } 
| { status: "pending" } 
| { status: "ready", data: EventSchemaType } 
| { status: "failed", error: string } 
```

##### @/src/lib/store/slices/groups/openedGroupSlice.ts

```ts
type OpenedEvent =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "ready"; data: EventSchemaType }
  | { status: "failed"; error: string };
```
