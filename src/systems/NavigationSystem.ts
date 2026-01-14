import type { EntityId } from '../core/types';
import type { GameState } from '../core/state';
import { isRoom } from '../entities';

export interface NavigationResult {
    readonly success: boolean;
    readonly message: string;
    readonly newState: GameState;
}

export function navigateToRoom(
    state: GameState,
    playerId: EntityId,
    targetRoomId: EntityId
): NavigationResult {
    const player = state.entities.get(playerId);
    if (!player || player.type !== 'player') {
        return {
            success: false,
            message: 'Player not found',
            newState: state,
        };
    }

    const currentRoom = state.entities.get(player.currentRoomId);
    if (!currentRoom || !isRoom(currentRoom)) {
        return {
            success: false,
            message: 'Current room not found',
            newState: state,
        };
    }

    const exits = currentRoom.exits;
    let direction: string | undefined;
    for (const [dir, id] of exits.entries()) {
        if (id === targetRoomId) {
            direction = dir;
            break;
        }
    }

    if (!direction) {
        return {
            success: false,
            message: `Cannot go from ${currentRoom.name} to room ${targetRoomId}`,
            newState: state,
        };
    }

    const targetRoom = state.entities.get(targetRoomId);
    if (!targetRoom || !isRoom(targetRoom)) {
        return {
            success: false,
            message: `Room ${targetRoomId} not found`,
            newState: state,
        };
    }

    if (targetRoom.isLocked) {
        if (targetRoom.requiredKeyId && !hasItem(state, targetRoom.requiredKeyId)) {
            return {
                success: false,
                message: `${targetRoom.name} is locked. You need a key.`,
                newState: state,
            };
        }
    }

    const newState = {
        ...state,
        currentRoomId: targetRoomId,
        entities: new Map(state.entities),
    };

    const updatedPlayer = {
        ...player,
        currentRoomId: targetRoomId,
    };
    newState.entities.set(playerId, updatedPlayer);

    return {
        success: true,
        message: `Moved to ${targetRoom.name}`,
        newState,
    };
}

export function getCurrentRoom(state: GameState, playerId: EntityId): EntityId | null {
    const player = state.entities.get(playerId);
    if (!player || player.type !== 'player') {
        return null;
    }
    return player.currentRoomId;
}

export function getAvailableExits(
    state: GameState,
    playerId: EntityId
): ReadonlyMap<string, EntityId> {
    const player = state.entities.get(playerId);
    if (!player || player.type !== 'player') {
        return new Map();
    }

    const currentRoom = state.entities.get(player.currentRoomId);
    if (!currentRoom || !isRoom(currentRoom)) {
        return new Map();
    }

    const availableExits = new Map<string, EntityId>();
    for (const [direction, roomId] of currentRoom.exits) {
        const room = state.entities.get(roomId);
        if (room && isRoom(room) && (!room.isLocked || hasItem(state, room.requiredKeyId!))) {
            availableExits.set(direction, roomId);
        }
    }
    return availableExits;
}

function hasItem(state: GameState, itemId: EntityId): boolean {
    return state.inventory.has(itemId);
}
