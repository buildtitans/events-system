## Dynamic data in Redux Toolkit slices is modeled using discriminated unions.

#### Why?
• Async data is modeled as a discriminated union state machine instead of nullable values and boolean flags.
• This removes impossible states and makes render logic predictable and exhaustive.

#### How this affects UI architecture


Components render directly from the state machine using exhaustive `switch` statements.

Instead of checking multiple booleans or null values, components can map state → UI in a single, predictable render pipeline:

• `idle` → nothing hydrated / drawer closed  
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
type GroupHydrated =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "ready"; data: GroupSchemaType }
  | { status: "failed"; error: string };
```



#### How it's leveraged

> [!NOTE] 
> Components consume the discriminated-union state and render UI via an exhaustive switch.

```ts
"use client";
import { LinearIndeterminate } from "../../ui/feedback";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import type { EventsPages } from "@/src/lib/store/slices/events/EventsSlice";
import ViewGroupSection from "../../sections/group/viewGroupSection";
import type { JSX } from "react";
import type { GroupHydrated } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import NoGroups from "../../ui/feedback/failure/noGroups";

type RenderOpenedGroupProps = {
    group: GroupHydrated,
    events: EventsPages
};

export function RenderOpenedGroup({
    group,
    events
}: RenderOpenedGroupProps
): JSX.Element | null {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const status = useSelector((s: RootState) => s.openGroup.syncStatus);

    switch (group.status) {

        case "idle":
            return null;
        case "pending":
            return (
                <LinearIndeterminate
                />
            )
        case "failed":
            return <NoGroups />
        case "ready":
            return (
                <ViewGroupSection
                    key="opened-group"
                    userKind={userKind}
                    group={group.data}
                    events={events}
                    status={status}
                />
            )
    }
}

```