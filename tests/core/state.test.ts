import { describe, it, expect } from 'vitest';
import {
    createInitialState,
    addEntity,
    removeEntity,
    updateEntity,
    getEntity,
    getEntitiesByType,
    addToInventory,
    removeFromInventory,
    hasInInventory,
    setFlag,
    getFlag,
    hasFlag,
} from '../../src/core/state';
import { createRoom, createItem, createPlayer } from '../../src/entities';
import { createEntityId } from '../../src/core/types';

describe('GameState', () => {
    describe('createInitialState', () => {
        it('should create empty state with defaults', () => {
            const state = createInitialState();
            expect(state.entities.size).toBe(0);
            expect(state.currentRoomId).toBeNull();
            expect(state.inventory.size).toBe(0);
            expect(state.flags.size).toBe(0);
            expect(state.completedPuzzles.size).toBe(0);
            expect(state.isGameOver).toBe(false);
            expect(state.isPaused).toBe(false);
        });

        it('should accept custom initial values', () => {
            const room = createRoom('room-1', 'Test Room', 'A test room');
            const state = createInitialState({
                entities: new Map([[room.id, room]]),
                currentRoomId: room.id,
            });
            expect(state.entities.size).toBe(1);
            expect(state.currentRoomId).toBe(room.id);
        });
    });

    describe('addEntity', () => {
        it('should add entity to state', () => {
            const state = createInitialState();
            const room = createRoom('room-1', 'Test Room', 'A test room');
            const newState = addEntity(state, room);

            expect(newState.entities.size).toBe(1);
            expect(getEntity(newState, room.id)).toEqual(room);
        });

        it('should throw if entity already exists', () => {
            const state = createInitialState();
            const room = createRoom('room-1', 'Test Room', 'A test room');
            const stateWithRoom = addEntity(state, room);

            expect(() => addEntity(stateWithRoom, room)).toThrow('already exists');
        });
    });

    describe('removeEntity', () => {
        it('should remove entity from state', () => {
            const state = createInitialState();
            const room = createRoom('room-1', 'Test Room', 'A test room');
            const stateWithRoom = addEntity(state, room);
            const newState = removeEntity(stateWithRoom, room.id);

            expect(newState.entities.size).toBe(0);
            expect(getEntity(newState, room.id)).toBeUndefined();
        });
    });

    describe('updateEntity', () => {
        it('should update entity properties', () => {
            const state = createInitialState();
            const room = createRoom('room-1', 'Test Room', 'A test room');
            const stateWithRoom = addEntity(state, room);

            const newState = updateEntity(stateWithRoom, room.id, { name: 'Updated Room' });
            const updated = getEntity(newState, room.id);

            expect(updated?.name).toBe('Updated Room');
            expect(updated?.description).toBe('A test room');
        });

        it('should throw if entity not found', () => {
            const state = createInitialState();
            const id = createEntityId('non-existent');

            expect(() => updateEntity(state, id, { name: 'Test' })).toThrow('not found');
        });
    });

    describe('getEntitiesByType', () => {
        it('should return entities filtered by type', () => {
            const state = createInitialState();
            const room = createRoom('room-1', 'Room 1', 'A room');
            const item = createItem('item-1', 'Key', 'A key');
            const player = createPlayer('player-1', 'Player', 'A player', room.id);

            let s = addEntity(state, room);
            s = addEntity(s, item);
            s = addEntity(s, player);

            const rooms = getEntitiesByType(s, 'room');
            expect(rooms.length).toBe(1);
            expect(rooms[0].id).toBe(room.id);
        });
    });

    describe('Inventory', () => {
        it('should add item to inventory', () => {
            const state = createInitialState();
            const item = createItem('item-1', 'Key', 'A key');
            const stateWithItem = addEntity(state, item);

            const result = addToInventory(stateWithItem, item.id);
            expect(hasInInventory(result, item.id)).toBe(true);
            expect(result.inventory.size).toBe(1);
        });

        it('should remove item from inventory', () => {
            const state = createInitialState();
            const item = createItem('item-1', 'Key', 'A key');
            let s = addEntity(state, item);
            s = addToInventory(s, item.id);
            s = removeFromInventory(s, item.id);

            expect(hasInInventory(s, item.id)).toBe(false);
        });
    });

    describe('Flags', () => {
        it('should set and get flags', () => {
            const state = createInitialState();
            const s = setFlag(state, 'doorOpen', true);

            expect(hasFlag(s, 'doorOpen')).toBe(true);
            expect(getFlag<boolean>(s, 'doorOpen')).toBe(true);
        });

        it('should return undefined for non-existent flags', () => {
            const state = createInitialState();
            expect(getFlag(state, 'nonExistent')).toBeUndefined();
        });
    });
});
