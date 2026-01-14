import { describe, it, expect } from 'vitest';
import { createInitialState, addEntity, updateEntity } from '../../src/core/state';
import { createRoom, createItem, createPlayer } from '../../src/entities';
import { createEntityId } from '../../src/core/types';
import {
    navigateToRoom,
    getCurrentRoom,
    getAvailableExits,
} from '../../src/systems/NavigationSystem';
import { addItemToInventory } from '../../src/systems/InventorySystem';

describe('NavigationSystem', () => {
    describe('navigateToRoom', () => {
        it('should navigate to adjacent room', () => {
            const state = createInitialState();
            const room1 = createRoom('room-1', 'Room 1', 'First room');
            const room2 = createRoom('room-2', 'Room 2', 'Second room', {
                exits: new Map(),
            });
            const player = createPlayer('player-1', 'Player', 'A player', room1.id);

            let s = addEntity(state, room1);
            s = addEntity(s, room2);
            s = addEntity(s, player);

            const roomWithExit = createRoom('room-1', 'Room 1', 'First room', {
                exits: new Map([['north', room2.id]]),
            });
            s = updateEntity(s, room1.id, roomWithExit);

            const result = navigateToRoom(s, player.id, room2.id);

            expect(result.success).toBe(true);
            expect(result.message).toContain('Room 2');
        });

        it('should fail for non-adjacent room', () => {
            const state = createInitialState();
            const room1 = createRoom('room-1', 'Room 1', 'First room');
            const room3 = createRoom('room-3', 'Room 3', 'Third room');
            const player = createPlayer('player-1', 'Player', 'A player', room1.id);

            let s = addEntity(state, room1);
            s = addEntity(s, room3);
            s = addEntity(s, player);

            const result = navigateToRoom(s, player.id, room3.id);

            expect(result.success).toBe(false);
            expect(result.message).toContain('Cannot go');
        });

        it('should fail for locked room without key', () => {
            const state = createInitialState();
            const room1 = createRoom('room-1', 'Room 1', 'First room');
            const key = createItem('key-1', 'Key', 'A key');
            const lockedRoom = createRoom('room-2', 'Locked Room', 'A locked room', {
                isLocked: true,
                requiredKeyId: key.id,
                exits: new Map(),
            });
            const player = createPlayer('player-1', 'Player', 'A player', room1.id);

            let s = addEntity(state, room1);
            s = addEntity(s, key);
            s = addEntity(s, lockedRoom);
            s = addEntity(s, player);

            const roomWithExit = createRoom('room-1', 'Room 1', 'First room', {
                exits: new Map([['north', lockedRoom.id]]),
            });
            s = updateEntity(s, room1.id, roomWithExit);

            const result = navigateToRoom(s, player.id, lockedRoom.id);

            expect(result.success).toBe(false);
            expect(result.message).toContain('locked');
        });

        it('should enter locked room with key', () => {
            const state = createInitialState();
            const room1 = createRoom('room-1', 'Room 1', 'First room');
            const key = createItem('key-1', 'Key', 'A key');
            const lockedRoom = createRoom('room-2', 'Locked Room', 'A locked room', {
                isLocked: true,
                requiredKeyId: key.id,
                exits: new Map(),
            });
            const player = createPlayer('player-1', 'Player', 'A player', room1.id);

            let s = addEntity(state, room1);
            s = addEntity(s, key);
            s = addEntity(s, lockedRoom);
            s = addEntity(s, player);
            s = addItemToInventory(s, key.id).newState;

            const roomWithExit = createRoom('room-1', 'Room 1', 'First room', {
                exits: new Map([['north', lockedRoom.id]]),
            });
            s = updateEntity(s, room1.id, roomWithExit);

            const result = navigateToRoom(s, player.id, lockedRoom.id);

            expect(result.success).toBe(true);
        });
    });

    describe('getCurrentRoom', () => {
        it('should return current room id', () => {
            const state = createInitialState();
            const room = createRoom('room-1', 'Room', 'Room');
            const player = createPlayer('player-1', 'Player', 'Player', room.id);
            let s = addEntity(state, room);
            s = addEntity(s, player);

            const currentRoom = getCurrentRoom(s, player.id);

            expect(currentRoom).toBe(room.id);
        });

        it('should return null for non-existent player', () => {
            const state = createInitialState();
            const fakeId = createEntityId('non-existent');

            const currentRoom = getCurrentRoom(state, fakeId);

            expect(currentRoom).toBeNull();
        });
    });

    describe('getAvailableExits', () => {
        it('should return available exits', () => {
            const state = createInitialState();
            const room1 = createRoom('room-1', 'Room 1', 'First room');
            const room2 = createRoom('room-2', 'Room 2', 'Second room', {
                exits: new Map(),
            });
            const player = createPlayer('player-1', 'Player', 'A player', room1.id);

            let s = addEntity(state, room1);
            s = addEntity(s, room2);
            s = addEntity(s, player);

            const roomWithExit = createRoom('room-1', 'Room 1', 'First room', {
                exits: new Map([['north', room2.id]]),
            });
            s = updateEntity(s, room1.id, roomWithExit);

            const availableExits = getAvailableExits(s, player.id);

            expect(availableExits.get('north')).toBe(room2.id);
        });

        it('should exclude locked rooms without key', () => {
            const state = createInitialState();
            const room1 = createRoom('room-1', 'Room 1', 'First room');
            const lockedRoom = createRoom('room-2', 'Locked', 'Locked', {
                isLocked: true,
                requiredKeyId: createEntityId('key-1'),
                exits: new Map(),
            });
            const player = createPlayer('player-1', 'Player', 'A player', room1.id);

            let s = addEntity(state, room1);
            s = addEntity(s, lockedRoom);
            s = addEntity(s, player);

            const roomWithExit = createRoom('room-1', 'Room 1', 'First room', {
                exits: new Map([['north', lockedRoom.id]]),
            });
            s = updateEntity(s, room1.id, roomWithExit);

            const availableExits = getAvailableExits(s, player.id);

            expect(availableExits.has('north')).toBe(false);
        });
    });
});
