# Game State Management

vaulted uses an immutable state management pattern for predictable game behavior.

## The GameState Interface

```typescript
interface GameState {
    readonly entities: ReadonlyMap<EntityId, Entity>;
    readonly currentRoomId: EntityId | null;
    readonly inventory: ReadonlySet<EntityId>;
    readonly flags: ReadonlyMap<string, unknown>;
    readonly completedPuzzles: ReadonlySet<EntityId>;
    readonly isGameOver: boolean;
    readonly isPaused: boolean;
    readonly eventLog: ReadonlyArray<BaseEvent>;
}
```

## Immutable Updates

All state operations return a **new** state object:

```typescript
import { createInitialState, addEntity, addToInventory } from '@ilyeshdz/vaulted';

let state = createInitialState();
const room = createRoom('room-1', 'Room', 'A room');

// addEntity returns a NEW state
const newState = addEntity(state, room);

// Old state is unchanged
console.log(state.entities.size); // 0
console.log(newState.entities.size); // 1
```

## Initialization

```typescript
import { createInitialState } from '@ilyeshdz/vaulted';

// Empty state
const state = createInitialState();

// Pre-populated state
const state = createInitialState({
    currentRoomId: roomId,
    isPaused: false,
});
```

## Entity Operations

### Adding Entities

```typescript
import { addEntity } from '@ilyeshdz/vaulted';

state = addEntity(state, room);
```

### Updating Entities

```typescript
import { updateEntity, createRoom } from '@ilyeshdz/vaulted';

const updatedRoom = createRoom(room.id, room.name, 'New description');
state = updateEntity(state, room.id, updatedRoom);
```

### Removing Entities

```typescript
import { removeEntity } from '@lyeshdz/vaulted';

state = removeEntity(state, itemId);
```

## Inventory Management

```typescript
import { addToInventory, removeFromInventory, hasInInventory } from '@ilyeshdz/vaulted';

// Add item
state = addToInventory(state, itemId).newState;

// Remove item
state = removeFromInventory(state, itemId).newState;

// Check if player has item
if (hasInInventory(state, itemId)) {
    // Player has the item
}
```

## Flag System

Use flags for tracking game progress:

```typescript
import { setFlag, getFlag, hasFlag } from '@ilyeshdz/vaulted';

// Set a flag
state = setFlag(state, 'doorOpened', true);

// Check a flag
if (hasFlag(state, 'doorOpened')) {
    // Door is open
}

// Get flag value
const isOpen = getFlag<boolean>(state, 'doorOpened');
```

## Best Practices

### Always Use the Returned State

```typescript
// ❌ Wrong - state is unchanged
addToInventory(state, itemId);

// ✅ Correct - use the new state
state = addToInventory(state, itemId).newState;
```

### Batch Updates

```typescript
// ❌ Multiple state assignments
state = addEntity(state, room1);
state = addEntity(state, room2);
state = addEntity(state, item);

// ✅ Functional composition
state = [room1, room2, item].reduce((s, entity) => addEntity(s, entity), createInitialState());
```

### Store Complex Objects in Flags

```typescript
// ✅ Good - complex data in flags
state = setFlag(state, 'playerStats', { health: 100, mana: 50 });

// ❌ Bad - entities are for simple references
```

## State History

The engine maintains an event log for debugging:

```typescript
import { logEvent, createEventType } from '@ilyeshdz/vaulted';

const event = {
    type: createEventType('game:start'),
    timestamp: Date.now(),
};

state = logEvent(state, event);

// Access history
for (const loggedEvent of state.eventLog) {
    console.log(loggedEvent.type, loggedEvent.timestamp);
}
```

## Time Travel Debugging

Because state is immutable, you can implement time travel:

```typescript
class StateHistory {
    private history: GameState[] = [];

    push(state: GameState): void {
        this.history.push(state);
    }

    undo(): GameState | null {
        return this.history.length > 1 ? this.history[this.history.length - 2] : null;
    }

    getCurrent(): GameState | null {
        return this.history[this.history.length - 1] || null;
    }
}
```
