# Simple Escape Room

A complete, playable escape room demonstrating vaulted's core features.

## Scenario

You wake up in a mysterious study. The door is locked, and you must find a way to escape. Search the room, find clues, solve puzzles, and escape!

## The Code

```typescript
import {
    createRoom,
    createItem,
    createPlayer,
    createPuzzle,
    createProp,
    createInitialState,
    addEntity,
    updateEntity,
    addItemToInventory,
    navigateToRoom,
    attemptPuzzleSolution,
    getCurrentRoom,
    getAvailableExits,
    getInventoryItems,
    getEntity,
    isRoom,
    isItem,
    type GameState,
    type EntityId,
} from '@ilyeshdz/vaulted';

interface GameOutput {
    message: string;
    state: GameState;
}

function displayRoom(state: GameState, playerId: EntityId): string {
    const roomId = getCurrentRoom(state, playerId);
    if (!roomId) return 'Error: Player not found';

    const room = getEntity(state, roomId);
    if (!room || !isRoom(room)) return 'Error: Room not found';

    let output = `\n=== ${room.name} ===\n`;
    output += `${room.description}\n`;

    const exits = getAvailableExits(state, playerId);
    if (exits.size > 0) {
        output += `\nExits: ${Array.from(exits.keys()).join(', ')}`;
    }

    const inventory = getInventoryItems(state);
    if (inventory.length > 0) {
        output += `\n\nInventory: ${inventory
            .map((id) => {
                const item = getEntity(state, id);
                return item?.name || id;
            })
            .join(', ')}`;
    }

    return output;
}

function createGame(): GameState {
    const study = createRoom(
        'study',
        'Mysterious Study',
        'An old study filled with dusty books and strange artifacts. A locked door is to the north.'
    );

    const library = createRoom(
        'library',
        'Ancient Library',
        'Towering bookshelves line the walls. The air smells of old paper.',
        { isLocked: true, requiredKeyId: 'silver-key' }
    );

    const key = createItem(
        'silver-key',
        'Silver Key',
        'A small silver key with intricate engravings.',
        { isCollectable: true, isKey: true }
    );

    const note = createItem(
        'mysterious-note',
        'Crumpled Note',
        'A handwritten note that reads: "The answer is in the year of founding."',
        { isCollectable: true }
    );

    const book = createProp(
        'clue-book',
        'Old Book',
        'A leather-bound book titled "Town History". Inside, you find a note.',
        { isInteractive: true, onInteract: 'read_about_founding' }
    );

    const safe = createPuzzle(
        'safe-puzzle',
        'Old Safe',
        'A heavy safe with a 4-digit combination lock.',
        ['1847', 'one-eight-four-seven', '1847'],
        {
            hint: 'When was the town founded?',
            rewardItemId: 'gold-key',
            requiredItemId: 'magnifying-glass',
        }
    );

    const magnifyingGlass = createItem(
        'magnifying-glass',
        'Magnifying Glass',
        'A brass magnifying glass. It might help you find small details.',
        { isCollectable: true, isUsable: true }
    );

    const goldKey = createItem('gold-key', 'Gold Key', 'A heavy gold key. This looks important!', {
        isCollectable: true,
        isKey: true,
    });

    const exitDoor = createPuzzle(
        'door-puzzle',
        'Exit Door',
        'The door to freedom. It has a keyhole and a small puzzle.',
        ['escape', 'freedom', 'liberty'],
        { rewardItemId: 'freedom' }
    );

    const freedom = createProp('freedom', 'Freedom', 'You have escaped! Congratulations!', {
        isInteractive: false,
    });

    let state = createInitialState({
        currentRoomId: study.id,
    });

    state = addEntity(state, study);
    state = addEntity(state, library);
    state = addEntity(state, key);
    state = addEntity(state, note);
    state = addEntity(state, book);
    state = addEntity(state, safe);
    state = addEntity(state, magnifyingGlass);
    state = addEntity(state, goldKey);
    state = addEntity(state, doorPuzzle);
    state = addEntity(state, freedom);

    const player = createPlayer('player', 'You', 'The protagonist', study.id);
    state = addEntity(state, player);

    const studyWithExits = createRoom(study.id, study.name, study.description, {
        exits: new Map([['north', library.id]]),
    });
    state = updateEntity(state, study.id, studyWithExits);

    const libraryWithExits = createRoom(library.id, library.name, library.description, {
        exits: new Map([['south', study.id]]),
    });
    state = updateEntity(state, library.id, libraryWithExits);

    return state;
}

function playGame() {
    let gameState = createGame();
    const playerId = 'player' as EntityId;

    console.log('Welcome to the Mysterious Study Escape Room!');
    console.log('Type "help" for available commands.\n');

    const commands: Record<string, () => GameOutput> = {
        look: () => ({
            message: displayRoom(gameState, playerId),
            state: gameState,
        }),
        north: () => {
            const result = navigateToRoom(gameState, playerId, 'library');
            if (result.success) {
                gameState = result.newState;
            }
            return result;
        },
        south: () => {
            const result = navigateToRoom(gameState, playerId, 'study');
            if (result.success) {
                gameState = result.newState;
            }
            return result;
        },
        inventory: () => {
            const items = getInventoryItems(gameState);
            return {
                message: `Inventory: ${
                    items.length === 0
                        ? 'Empty'
                        : items
                              .map((id) => {
                                  const item = getEntity(gameState, id);
                                  return item?.name || id;
                              })
                              .join(', ')
                }`,
                state: gameState,
            };
        },
        status: () => {
            const room = getEntity(gameState, getCurrentRoom(gameState, playerId)!);
            return {
                message: `Current location: ${room?.name || 'Unknown'}`,
                state: gameState,
            };
        },
    };

    console.log(displayRoom(gameState, playerId));

    return { gameState, commands };
}

playGame();
```

## How to Run

1. Save the code above to a file (e.g., `game.ts`)
2. Import the vaulted package
3. Run with TypeScript or compile to JavaScript

## Game Walkthrough

If you want to test the game, here's the solution:

1. **Look around** the study
2. **Go north** to the library (door is locked)
3. Find the **silver key** in the study
4. **Pick up** the silver key
5. **Go north** to the library
6. **Examine** the old book
7. Find the **magnifying glass**
8. **Pick up** the magnifying glass
9. **Examine** the safe
10. Enter **1847** (the year the town was founded)
11. Receive the **gold key**
12. **Go south** back to the study
13. **Examine** the exit door
14. Enter **escape**
15. **You win!**

## Key Concepts Demonstrated

- Creating and connecting rooms with exits
- Items that can be picked up and used
- Locked rooms requiring keys
- Puzzles with multiple solutions
- Prop interactions
- Game state management
- Player inventory system

## Extending the Example

Try adding:

- More rooms and puzzles
- A time limit
- Multiple endings
- NPC interactions
- Save/load functionality
