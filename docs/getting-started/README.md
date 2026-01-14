# Getting Started

Welcome to vaulted! This guide will help you create your first escape game.

## Installation

```bash
pnpm add @ilyeshdz/vaulted
```

## Your First Game

Let's create a simple escape room with a locked door and a key.

### 1. Import the Engine

```typescript
import {
    createRoom,
    createItem,
    createPlayer,
    createPuzzle,
    createInitialState,
    addEntity,
    addItemToInventory,
    navigateToRoom,
    attemptPuzzleSolution,
} from '@ilyeshdz/vaulted';
```

### 2. Define Your Entities

Create the game world with rooms, items, and puzzles:

```typescript
// Create rooms
const entrance = createRoom(
    'entrance',
    'Entrance Hall',
    'A dark entrance hall with a locked door to the north.'
);

const library = createRoom('library', 'Library', 'An old library filled with dusty books.', {
    isLocked: true,
    requiredKeyId: 'gold-key',
});

// Create items
const goldKey = createItem('gold-key', 'Gold Key', 'A shiny gold key.', {
    isCollectable: true,
    isKey: true,
});

// Create a puzzle
const codePuzzle = createPuzzle(
    'safe-code',
    'Safe Combination',
    'A safe with a 4-digit combination lock.',
    ['1234', 'one-two-three-four'],
    { hint: 'Check the books on the shelf', rewardItemId: 'treasure' }
);

const treasure = createItem('treasure', 'Ancient Artifact', 'A priceless artifact!');
```

### 3. Create the Player

```typescript
const player = createPlayer('hero', 'Hero', 'The protagonist of our story', entrance.id);
```

### 4. Initialize Game State

```typescript
let state = createInitialState({
    currentRoomId: entrance.id,
});

state = addEntity(state, entrance);
state = addEntity(state, library);
state = addEntity(state, goldKey);
state = addEntity(state, codePuzzle);
state = addEntity(state, treasure);
state = addEntity(state, player);
```

### 5. Connect Rooms with Exits

Add exits to connect the rooms:

```typescript
import { updateEntity, createRoom } from '@ilyeshdz/vaulted';

const entranceWithExit = createRoom(entrance.id, entrance.name, entrance.description, {
    exits: new Map([['north', library.id]]),
});

state = updateEntity(state, entrance.id, entranceWithExit);
```

### 6. Game Loop Example

Here's how a typical game interaction works:

```typescript
// Player picks up the key
const pickupResult = addItemToInventory(state, goldKey.id);
state = pickupResult.newState;
console.log(pickupResult.message); // "Picked up Gold Key"

// Player tries to go to the library
const navigateResult = navigateToRoom(state, player.id, library.id);
if (navigateResult.success) {
    console.log(navigateResult.message); // "Moved to Library"
}

// Player solves the puzzle
const puzzleResult = attemptPuzzleSolution(state, codePuzzle.id, '1234', player.id);
console.log(puzzleResult.message); // "Solved Safe Combination! Received Ancient Artifact!"
```

## Complete Example

See the [Simple Escape Room](../examples/simple-escape-room.md) example for a full working game.

## Next Steps

- Learn about [Entities](../guides/entities.md)
- Explore the [API](../api/README.md)
- Check out more [Examples](../examples/README.md)

## Tips

1. **Keep state immutable** - Always use the `newState` returned by functions
2. **Use EntityId** - Use the `createEntityId()` function for type-safe IDs
3. **Leverage flags** - Use the flags system for game progress tracking
4. **Subscribe to events** - Use EventBus for decoupled game logic
