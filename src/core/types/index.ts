export type EntityId = string & { readonly brand: unique symbol };

export function createEntityId(value: string): EntityId {
    if (value.length === 0) {
        throw new Error('EntityId cannot be empty');
    }
    return value as EntityId;
}

export type GameObjectType = 'room' | 'item' | 'player' | 'puzzle' | 'prop';

export interface Entity {
    readonly id: EntityId;
    readonly type: GameObjectType;
    readonly name: string;
    readonly description: string;
    readonly tags: ReadonlySet<string>;
}

export function isEntity(value: unknown): value is Entity {
    return (
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'type' in value &&
        'name' in value &&
        'description' in value &&
        'tags' in value
    );
}

export interface Position {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}

export function createPosition(x: number, y: number, z: number): Position {
    return { x, y, z };
}

export interface Dimensions {
    readonly width: number;
    readonly height: number;
    readonly depth: number;
}

export function createDimensions(width: number, height: number, depth: number): Dimensions {
    return { width, height, depth };
}
