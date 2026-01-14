# Working with Entities

Entities are the building blocks of your escape game. This guide covers creating and managing entities.

## Entity Types

vaulted provides five entity types:

| Type     | Description                        |
| -------- | ---------------------------------- |
| `Room`   | Physical locations in your game    |
| `Item`   | Collectible and usable objects     |
| `Player` | The main character                 |
| `Puzzle` | Challenges for the player          |
| `Prop`   | Decorative and interactive objects |

## Creating Entities

### Rooms

Rooms represent locations in your game world.

```typescript
import { createRoom } from '@ilyeshdz/vaulted';

const livingRoom = createRoom(
    'living-room',
    'Living Room',
    'A dusty living room with old furniture.'
);

const kitchen = createRoom('kitchen', 'Kitchen', 'A small kitchen with a strange smell.', {
    position: { x: 10, y: 0, z: 0 },
    dimensions: { width: 5, height: 3, depth: 5 },
    isLocked: true,
    requiredKeyId: 'kitchen-key',
    exits: new Map([
        ['south', 'living-room'],
        ['north', 'pantry'],
    ]),
    tags: new Set(['indoor', 'locked']),
});
```

### Items

Items can be collected, used, and combined.

```typescript
import { createItem } from '@ilyeshdz/vaulted';

// A simple collectible key
const key = createItem('gold-key', 'Gold Key', 'A shiny gold key.', {
    isCollectable: true,
    isKey: true,
});

// A usable item
const flashlight = createItem('flashlight', 'Flashlight', 'A battery-powered flashlight.', {
    isCollectable: true,
    isUsable: true,
});

// A combinable item
const battery = createItem('battery', 'Battery', 'A fresh AA battery.', {
    isCollectable: true,
    canBeCombined: true,
    combinationResultId: 'working-flashlight',
});

const workingFlashlight = createItem(
    'working-flashlight',
    'Working Flashlight',
    'A flashlight with a fresh battery.',
    {
        isCollectable: true,
        isUsable: true,
    }
);
```

### Player

The player entity tracks the protagonist's state.

```typescript
import { createPlayer } from '@ilyeshdz/vaulted';

const player = createPlayer('hero', 'Hero', 'The protagonist of our story', 'starting-room-id', {
    health: 100,
    maxHealth: 100,
    tags: new Set(['protagonist']),
});
```

### Puzzles

Puzzles challenge the player with solutions.

```typescript
import { createPuzzle } from '@ilyeshdz/vaulted';

const codePuzzle = createPuzzle(
    'safe-code',
    'Safe Combination',
    'A safe with a combination lock.',
    ['1234', 'one-two-three-four'], // Multiple valid solutions
    {
        hint: 'The year the house was built',
        rewardItemId: 'treasure',
        requiredItemId: 'magnifying-glass',
    }
);

const wordPuzzle = createPuzzle(
    'riddle',
    'Ancient Riddle',
    'An inscription on the wall.',
    ['time', 'the answer is time', 'time'],
    {
        hint: 'What comes once in a minute, twice in a moment, but never in a thousand years?',
    }
);
```

### Props

Props are decorative or interactive objects.

```typescript
import { createProp } from '@ilyeshdz/vaulted';

const bookshelf = createProp('bookshelf', 'Old Bookshelf', 'A dusty bookshelf filled with books.', {
    position: { x: 2, y: 0, z: 5 },
    isInteractive: true,
    onInteract: 'examine_books',
});

const painting = createProp('painting', 'Portrait', 'An old portrait of a stern-looking man.', {
    isInteractive: true,
    onInteract: 'move_painting',
});
```

## Managing Entities

### Adding to State

```typescript
import { createInitialState, addEntity } from '@ilyeshdz/vaulted';

let state = createInitialState();

const room = createRoom('room-1', 'Room', 'A room');
const item = createItem('item-1', 'Item', 'An item');

state = addEntity(state, room);
state = addEntity(state, item);
```

### Updating Entities

```typescript
import { updateEntity, createRoom } from '@ilyeshdz/vaulted';

// Create an updated version of a room
const updatedRoom = createRoom(room.id, room.name, room.description, {
    exits: new Map([['north', 'new-room-id']]),
});

state = updateEntity(state, room.id, updatedRoom);
```

### Removing Entities

```typescript
import { removeEntity } from '@ilyeshdz/vaulted';

state = removeEntity(state, item.id);
```

### Querying Entities

```typescript
import { getEntity, getEntitiesByType } from '@ilyeshdz/vaulted';

// Get a specific entity
const room = getEntity(state, 'room-1');

// Get all entities of a type
const allItems = getEntitiesByType(state, 'item');
const allPuzzles = getEntitiesByType(state, 'puzzle');
```

## Type Guards

Use type guards to safely narrow entity types:

```typescript
import { isRoom, isItem, isPlayer, getEntity } from '@ilyeshdz/vaulted';

const entity = getEntity(state, 'some-id');

if (isRoom(entity)) {
    // entity is now typed as Room
    console.log(entity.exits);
} else if (isItem(entity)) {
    // entity is now typed as Item
    console.log(entity.isCollectable);
} else if (isPlayer(entity)) {
    // entity is now typed as Player
    console.log(entity.health);
}
```

## Best Practices

1. **Use descriptive IDs** - 'kitchen-key' is better than 'key-1'
2. **Set appropriate flags** - Use `isLocked`, `isCollectable`, etc.
3. **Add meaningful descriptions** - Help players understand the world
4. **Use tags for categorization** - Group entities by type or location
5. **Keep entity data minimal** - Store dynamic data in GameState
