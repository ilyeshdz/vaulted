import type { Entity, EntityId, GameObjectType } from '../types';
import type { BaseEvent } from '../events';

export interface GameState {
    readonly entities: ReadonlyMap<EntityId, Entity>;
    readonly currentRoomId: EntityId | null;
    readonly inventory: ReadonlySet<EntityId>;
    readonly flags: ReadonlyMap<string, unknown>;
    readonly completedPuzzles: ReadonlySet<EntityId>;
    readonly isGameOver: boolean;
    readonly isPaused: boolean;
    readonly eventLog: ReadonlyArray<BaseEvent>;
}

export interface GameStateInit {
    readonly entities?: ReadonlyMap<EntityId, Entity>;
    readonly currentRoomId?: EntityId | null;
    readonly inventory?: ReadonlySet<EntityId>;
    readonly flags?: ReadonlyMap<string, unknown>;
    readonly completedPuzzles?: ReadonlySet<EntityId>;
    readonly isGameOver?: boolean;
    readonly isPaused?: boolean;
}

export function createInitialState(init: GameStateInit = {}): GameState {
    return {
        entities: init.entities ?? new Map(),
        currentRoomId: init.currentRoomId ?? null,
        inventory: init.inventory ?? new Set(),
        flags: init.flags ?? new Map(),
        completedPuzzles: init.completedPuzzles ?? new Set(),
        isGameOver: init.isGameOver ?? false,
        isPaused: init.isPaused ?? false,
        eventLog: [],
    };
}

export function addEntity(state: GameState, entity: Entity): GameState {
    if (state.entities.has(entity.id)) {
        throw new Error(`Entity with id ${entity.id} already exists`);
    }
    return {
        ...state,
        entities: new Map(state.entities).set(entity.id, entity),
    };
}

export function removeEntity(state: GameState, entityId: EntityId): GameState {
    const newEntities = new Map(state.entities);
    newEntities.delete(entityId);
    const newInventory = new Set(state.inventory);
    newInventory.delete(entityId);
    const newCompletedPuzzles = new Set(state.completedPuzzles);
    newCompletedPuzzles.delete(entityId);
    return {
        ...state,
        entities: newEntities,
        inventory: newInventory,
        completedPuzzles: newCompletedPuzzles,
    };
}

export function updateEntity(
    state: GameState,
    entityId: EntityId,
    update: Partial<Entity>
): GameState {
    const existing = state.entities.get(entityId);
    if (!existing) {
        throw new Error(`Entity with id ${entityId} not found`);
    }
    const newEntities = new Map(state.entities);
    newEntities.set(entityId, { ...existing, ...update });
    return {
        ...state,
        entities: newEntities,
    };
}

export function getEntity(state: GameState, entityId: EntityId): Entity | undefined {
    return state.entities.get(entityId);
}

export function getEntitiesByType(state: GameState, type: GameObjectType): ReadonlyArray<Entity> {
    const result: Entity[] = [];
    for (const entity of state.entities.values()) {
        if (entity.type === type) {
            result.push(entity);
        }
    }
    return result;
}

export function setCurrentRoom(state: GameState, roomId: EntityId | null): GameState {
    return {
        ...state,
        currentRoomId: roomId,
    };
}

export function addToInventory(state: GameState, itemId: EntityId): GameState {
    if (!state.entities.has(itemId)) {
        throw new Error(`Item with id ${itemId} not found`);
    }
    return {
        ...state,
        inventory: new Set(state.inventory).add(itemId),
    };
}

export function removeFromInventory(state: GameState, itemId: EntityId): GameState {
    const newInventory = new Set(state.inventory);
    newInventory.delete(itemId);
    return {
        ...state,
        inventory: newInventory,
    };
}

export function hasInInventory(state: GameState, itemId: EntityId): boolean {
    return state.inventory.has(itemId);
}

export function setFlag(state: GameState, key: string, value: unknown): GameState {
    return {
        ...state,
        flags: new Map(state.flags).set(key, value),
    };
}

export function getFlag<T>(state: GameState, key: string): T | undefined {
    return state.flags.get(key) as T | undefined;
}

export function hasFlag(state: GameState, key: string): boolean {
    return state.flags.has(key);
}

export function markPuzzleCompleted(state: GameState, puzzleId: EntityId): GameState {
    return {
        ...state,
        completedPuzzles: new Set(state.completedPuzzles).add(puzzleId),
    };
}

export function isPuzzleCompleted(state: GameState, puzzleId: EntityId): boolean {
    return state.completedPuzzles.has(puzzleId);
}

export function setPaused(state: GameState, paused: boolean): GameState {
    return {
        ...state,
        isPaused: paused,
    };
}

export function setGameOver(state: GameState, gameOver: boolean): GameState {
    return {
        ...state,
        isGameOver: gameOver,
    };
}

export function logEvent(state: GameState, event: BaseEvent): GameState {
    return {
        ...state,
        eventLog: [...state.eventLog, event].slice(-100),
    };
}
