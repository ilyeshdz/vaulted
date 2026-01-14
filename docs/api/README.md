# API Reference

Complete documentation for all vaulted exports.

## Core Types

### EntityId

A branded string type for type-safe entity identifiers.

```typescript
import { createEntityId, type EntityId } from '@ilyeshdz/vaulted';

const roomId = createEntityId('living-room');
// roomId is EntityId, cannot be a regular string
```

### Entity

Base interface for all game entities.

```typescript
interface Entity {
    readonly id: EntityId;
    readonly type: GameObjectType;
    readonly name: string;
    readonly description: string;
    readonly tags: ReadonlySet<string>;
}
```

### Position

3D position for entities.

```typescript
interface Position {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}

function createPosition(x: number, y: number, z: number): Position;
```

### Dimensions

3D dimensions for entities.

```typescript
interface Dimensions {
    readonly width: number;
    readonly height: number;
    readonly depth: number;
}

function createDimensions(width: number, height: number, depth: number): Dimensions;
```

## Entities

### Room

```typescript
interface Room {
    readonly id: EntityId;
    readonly type: 'room';
    readonly name: string;
    readonly description: string;
    readonly tags: ReadonlySet<string>;
    readonly position: Position | null;
    readonly dimensions: Dimensions | null;
    readonly exits: ReadonlyMap<string, EntityId>;
    readonly objects: ReadonlySet<EntityId>;
    readonly isLocked: boolean;
    readonly requiredKeyId: EntityId | null;
}

function createRoom(
    id: string,
    name: string,
    description: string,
    options?: {
        position?: Position | null;
        dimensions?: Dimensions | null;
        exits?: ReadonlyMap<string, EntityId>;
        objects?: ReadonlySet<EntityId>;
        isLocked?: boolean;
        requiredKeyId?: EntityId | null;
        tags?: ReadonlySet<string>;
    }
): Room;

function isRoom(value: unknown): value is Room;
```

### Item

```typescript
interface Item {
    readonly id: EntityId;
    readonly type: 'item';
    readonly name: string;
    readonly description: string;
    readonly tags: ReadonlySet<string>;
    readonly position: Position | null;
    readonly isCollectable: boolean;
    readonly isUsable: boolean;
    readonly isKey: boolean;
    readonly canBeCombined: boolean;
    readonly combinationResultId: EntityId | null;
}

function createItem(
    id: string,
    name: string,
    description: string,
    options?: {
        position?: Position | null;
        isCollectable?: boolean;
        isUsable?: boolean;
        isKey?: boolean;
        canBeCombined?: boolean;
        combinationResultId?: EntityId | null;
        tags?: ReadonlySet<string>;
    }
): Item;

function isItem(value: unknown): value is Item;
```

### Player

```typescript
interface Player {
    readonly id: EntityId;
    readonly type: 'player';
    readonly name: string;
    readonly description: string;
    readonly tags: ReadonlySet<string>;
    readonly currentRoomId: EntityId;
    readonly health: number;
    readonly maxHealth: number;
}

function createPlayer(
    id: string,
    name: string,
    description: string,
    currentRoomId: EntityId,
    options?: {
        health?: number;
        maxHealth?: number;
        tags?: ReadonlySet<string>;
    }
): Player;

function isPlayer(value: unknown): value is Player;
```

### Puzzle

```typescript
interface Puzzle {
    readonly id: EntityId;
    readonly type: 'puzzle';
    readonly name: string;
    readonly description: string;
    readonly tags: ReadonlySet<string>;
    readonly solution: ReadonlyArray<string>;
    readonly isSolved: boolean;
    readonly hint: string | null;
    readonly rewardItemId: EntityId | null;
    readonly requiredItemId: EntityId | null;
}

function createPuzzle(
    id: string,
    name: string,
    description: string,
    solution: ReadonlyArray<string>,
    options?: {
        isSolved?: boolean;
        hint?: string | null;
        rewardItemId?: EntityId | null;
        requiredItemId?: EntityId | null;
        tags?: ReadonlySet<string>;
    }
): Puzzle;

function isPuzzle(value: unknown): value is Puzzle;
```

### Prop

```typescript
interface Prop {
    readonly id: EntityId;
    readonly type: 'prop';
    readonly name: string;
    readonly description: string;
    readonly tags: ReadonlySet<string>;
    readonly position: Position | null;
    readonly isInteractive: boolean;
    readonly onInteract: string | null;
}

function createProp(
    id: string,
    name: string,
    description: string,
    options?: {
        position?: Position | null;
        isInteractive?: boolean;
        onInteract?: string | null;
        tags?: ReadonlySet<string>;
    }
): Prop;

function isProp(value: unknown): value is Prop;
```

## GameState

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

function createInitialState(init?: GameStateInit): GameState;

// Entity operations
function addEntity(state: GameState, entity: Entity): GameState;
function removeEntity(state: GameState, entityId: EntityId): GameState;
function updateEntity(state: GameState, entityId: EntityId, update: Partial<Entity>): GameState;
function getEntity(state: GameState, entityId: EntityId): Entity | undefined;
function getEntitiesByType(state: GameState, type: GameObjectType): ReadonlyArray<Entity>;

// Room operations
function setCurrentRoom(state: GameState, roomId: EntityId | null): GameState;

// Inventory operations
function addToInventory(state: GameState, itemId: EntityId): GameState;
function removeFromInventory(state: GameState, itemId: EntityId): GameState;
function hasInInventory(state: GameState, itemId: EntityId): boolean;

// Flag operations
function setFlag(state: GameState, key: string, value: unknown): GameState;
function getFlag<T>(state: GameState, key: string): T | undefined;
function hasFlag(state: GameState, key: string): boolean;

// Puzzle operations
function markPuzzleCompleted(state: GameState, puzzleId: EntityId): GameState;
function isPuzzleCompleted(state: GameState, puzzleId: EntityId): boolean;

// Game state operations
function setPaused(state: GameState, paused: boolean): GameState;
function setGameOver(state: GameState, gameOver: boolean): GameState;
function logEvent(state: GameState, event: BaseEvent): GameState;
```

## Systems

### InventorySystem

```typescript
interface InventoryActionResult {
    readonly success: boolean;
    readonly message: string;
    readonly newState: GameState;
}

function addItemToInventory(state: GameState, itemId: EntityId): InventoryActionResult;
function removeItemFromInventory(state: GameState, itemId: EntityId): InventoryActionResult;
function hasItem(state: GameState, itemId: EntityId): boolean;
function getInventoryItems(state: GameState): ReadonlyArray<EntityId>;
function combineItems(
    state: GameState,
    itemId1: EntityId,
    itemId2: EntityId
): InventoryActionResult;
```

### NavigationSystem

```typescript
interface NavigationResult {
    readonly success: boolean;
    readonly message: string;
    readonly newState: GameState;
}

function navigateToRoom(
    state: GameState,
    playerId: EntityId,
    targetRoomId: EntityId
): NavigationResult;
function getCurrentRoom(state: GameState, playerId: EntityId): EntityId | null;
function getAvailableExits(state: GameState, playerId: EntityId): ReadonlyMap<string, EntityId>;
```

### PuzzleSystem

```typescript
interface PuzzleResult {
    readonly success: boolean;
    readonly message: string;
    readonly isSolved: boolean;
    readonly newState: GameState;
}

function attemptPuzzleSolution(
    state: GameState,
    puzzleId: EntityId,
    solution: string,
    playerId: EntityId
): PuzzleResult;
function getPuzzleHint(state: GameState, puzzleId: EntityId): string | null;
function isPuzzleSolved(state: GameState, puzzleId: EntityId): boolean;
function getUnsolvedPuzzles(state: GameState): ReadonlyArray<EntityId>;
```

## EventBus

```typescript
interface Subscribable {
    subscribe<T extends BaseEvent>(eventType: EventType, handler: EventHandler<T>): void;
    unsubscribe<T extends BaseEvent>(eventType: EventType, handler: EventHandler<T>): void;
}

class EventBus implements Subscribable {
    emit<T extends BaseEvent>(event: T): void;
    subscribe<T extends BaseEvent>(eventType: EventType, handler: EventHandler<T>): void;
    unsubscribe<T extends BaseEvent>(eventType: EventType, handler: EventHandler<T>): void;
    getHistory(): ReadonlyArray<BaseEvent>;
    clearHistory(): void;
}

function createEventType<T extends string>(value: T): EventType;
function createEventBus(maxHistorySize?: number): EventBus;
```

## Type Guards

All entity types have corresponding type guards:

- `isEntity(value: unknown): value is Entity`
- `isRoom(value: unknown): value is Room`
- `isItem(value: unknown): value is Item`
- `isPlayer(value: unknown): value is Player`
- `isPuzzle(value: unknown): value is Puzzle`
- `isProp(value: unknown): value is Prop`

## Utility Types

```typescript
type GameEntity = Room | Item | Player | Puzzle | Prop;
type GameObjectType = 'room' | 'item' | 'player' | 'puzzle' | 'prop';
```
