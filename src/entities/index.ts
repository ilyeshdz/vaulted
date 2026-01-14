import type { EntityId, Position, Dimensions } from '../core/types';
import { createEntityId } from '../core/types';

export interface Room {
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

export function createRoom(
    id: string,
    name: string,
    description: string,
    options: {
        position?: Position | null;
        dimensions?: Dimensions | null;
        exits?: ReadonlyMap<string, EntityId>;
        objects?: ReadonlySet<EntityId>;
        isLocked?: boolean;
        requiredKeyId?: EntityId | null;
        tags?: ReadonlySet<string>;
    } = {}
): Room {
    return {
        id: createEntityId(id),
        type: 'room',
        name,
        description,
        position: options.position ?? null,
        dimensions: options.dimensions ?? null,
        exits: options.exits ?? new Map(),
        objects: options.objects ?? new Set(),
        isLocked: options.isLocked ?? false,
        requiredKeyId: options.requiredKeyId ?? null,
        tags: options.tags ?? new Set(),
    };
}

export function isRoom(value: unknown): value is Room {
    return (
        typeof value === 'object' &&
        value !== null &&
        (value as Room).type === 'room' &&
        'id' in value &&
        'name' in value
    );
}

export interface Item {
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

export function createItem(
    id: string,
    name: string,
    description: string,
    options: {
        position?: Position | null;
        isCollectable?: boolean;
        isUsable?: boolean;
        isKey?: boolean;
        canBeCombined?: boolean;
        combinationResultId?: EntityId | null;
        tags?: ReadonlySet<string>;
    } = {}
): Item {
    return {
        id: createEntityId(id),
        type: 'item',
        name,
        description,
        position: options.position ?? null,
        isCollectable: options.isCollectable ?? true,
        isUsable: options.isUsable ?? false,
        isKey: options.isKey ?? false,
        canBeCombined: options.canBeCombined ?? false,
        combinationResultId: options.combinationResultId ?? null,
        tags: options.tags ?? new Set(),
    };
}

export function isItem(value: unknown): value is Item {
    return (
        typeof value === 'object' &&
        value !== null &&
        (value as Item).type === 'item' &&
        'id' in value &&
        'name' in value
    );
}

export interface Player {
    readonly id: EntityId;
    readonly type: 'player';
    readonly name: string;
    readonly description: string;
    readonly tags: ReadonlySet<string>;
    readonly currentRoomId: EntityId;
    readonly health: number;
    readonly maxHealth: number;
}

export function createPlayer(
    id: string,
    name: string,
    description: string,
    currentRoomId: EntityId,
    options: {
        health?: number;
        maxHealth?: number;
        tags?: ReadonlySet<string>;
    } = {}
): Player {
    const maxHealth = options.maxHealth ?? 100;
    const health = Math.min(options.health ?? maxHealth, maxHealth);
    return {
        id: createEntityId(id),
        type: 'player',
        name,
        description,
        currentRoomId,
        health,
        maxHealth,
        tags: options.tags ?? new Set(),
    };
}

export function isPlayer(value: unknown): value is Player {
    return (
        typeof value === 'object' &&
        value !== null &&
        (value as Player).type === 'player' &&
        'id' in value &&
        'name' in value
    );
}

export interface Puzzle {
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

export function createPuzzle(
    id: string,
    name: string,
    description: string,
    solution: ReadonlyArray<string>,
    options: {
        isSolved?: boolean;
        hint?: string | null;
        rewardItemId?: EntityId | null;
        requiredItemId?: EntityId | null;
        tags?: ReadonlySet<string>;
    } = {}
): Puzzle {
    return {
        id: createEntityId(id),
        type: 'puzzle',
        name,
        description,
        solution,
        isSolved: options.isSolved ?? false,
        hint: options.hint ?? null,
        rewardItemId: options.rewardItemId ?? null,
        requiredItemId: options.requiredItemId ?? null,
        tags: options.tags ?? new Set(),
    };
}

export function isPuzzle(value: unknown): value is Puzzle {
    return (
        typeof value === 'object' &&
        value !== null &&
        (value as Puzzle).type === 'puzzle' &&
        'id' in value &&
        'name' in value
    );
}

export interface Prop {
    readonly id: EntityId;
    readonly type: 'prop';
    readonly name: string;
    readonly description: string;
    readonly tags: ReadonlySet<string>;
    readonly position: Position | null;
    readonly isInteractive: boolean;
    readonly onInteract: string | null;
}

export function createProp(
    id: string,
    name: string,
    description: string,
    options: {
        position?: Position | null;
        isInteractive?: boolean;
        onInteract?: string | null;
        tags?: ReadonlySet<string>;
    } = {}
): Prop {
    return {
        id: createEntityId(id),
        type: 'prop',
        name,
        description,
        position: options.position ?? null,
        isInteractive: options.isInteractive ?? false,
        onInteract: options.onInteract ?? null,
        tags: options.tags ?? new Set(),
    };
}

export function isProp(value: unknown): value is Prop {
    return (
        typeof value === 'object' &&
        value !== null &&
        (value as Prop).type === 'prop' &&
        'id' in value &&
        'name' in value
    );
}

export type GameEntity = Room | Item | Player | Puzzle | Prop;
