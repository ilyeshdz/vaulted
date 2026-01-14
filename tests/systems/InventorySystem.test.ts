import { describe, it, expect } from 'vitest';
import { createInitialState, addEntity } from '../../src/core/state';
import { createRoom, createItem, createPlayer } from '../../src/entities';
import { createEntityId } from '../../src/core/types';
import {
    addItemToInventory,
    removeItemFromInventory,
    hasItem,
    getInventoryItems,
    combineItems,
} from '../../src/systems/InventorySystem';

describe('InventorySystem', () => {
    describe('addItemToInventory', () => {
        it('should add item to inventory', () => {
            const state = createInitialState();
            const item = createItem('item-1', 'Key', 'A key');
            let s = addEntity(state, item);

            const result = addItemToInventory(s, item.id);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Picked up Key');
            expect(hasItem(result.newState, item.id)).toBe(true);
        });

        it('should fail for non-existent item', () => {
            const state = createInitialState();
            const fakeId = createEntityId('non-existent');

            const result = addItemToInventory(state, fakeId);

            expect(result.success).toBe(false);
            expect(result.message).toContain('not found');
        });

        it('should fail if item already in inventory', () => {
            const state = createInitialState();
            const item = createItem('item-1', 'Key', 'A key');
            let s = addEntity(state, item);
            s = addItemToInventory(s, item.id).newState;

            const result = addItemToInventory(s, item.id);

            expect(result.success).toBe(false);
            expect(result.message).toContain('already in inventory');
        });

        it('should fail for non-item entities', () => {
            const state = createInitialState();
            const room = createRoom('room-1', 'Room', 'A room');
            let s = addEntity(state, room);

            const result = addItemToInventory(s, room.id);

            expect(result.success).toBe(false);
            expect(result.message).toContain('not an item');
        });
    });

    describe('removeItemFromInventory', () => {
        it('should remove item from inventory', () => {
            const state = createInitialState();
            const item = createItem('item-1', 'Key', 'A key');
            let s = addEntity(state, item);
            s = addItemToInventory(s, item.id).newState;

            const result = removeItemFromInventory(s, item.id);

            expect(result.success).toBe(true);
            expect(hasItem(result.newState, item.id)).toBe(false);
        });

        it('should fail if item not in inventory', () => {
            const state = createInitialState();
            const item = createItem('item-1', 'Key', 'A key');
            let s = addEntity(state, item);

            const result = removeItemFromInventory(s, item.id);

            expect(result.success).toBe(false);
            expect(result.message).toContain('not in inventory');
        });
    });

    describe('getInventoryItems', () => {
        it('should return all inventory items', () => {
            const state = createInitialState();
            const item1 = createItem('item-1', 'Key 1', 'Key 1');
            const item2 = createItem('item-2', 'Key 2', 'Key 2');
            let s = addEntity(state, item1);
            s = addEntity(s, item2);
            s = addItemToInventory(s, item1.id).newState;
            s = addItemToInventory(s, item2.id).newState;

            const items = getInventoryItems(s);

            expect(items.length).toBe(2);
            expect(items).toContain(item1.id);
            expect(items).toContain(item2.id);
        });

        it('should return empty array for empty inventory', () => {
            const state = createInitialState();
            const items = getInventoryItems(state);
            expect(items.length).toBe(0);
        });
    });

    describe('combineItems', () => {
        it('should combine items with valid combination', () => {
            const state = createInitialState();
            const item1 = createItem('item-1', 'Part A', 'Part A', {
                canBeCombined: true,
                combinationResultId: createEntityId('combined'),
            });
            const item2 = createItem('item-2', 'Part B', 'Part B');
            let s = addEntity(state, item1);
            s = addEntity(s, item2);
            s = addItemToInventory(s, item1.id).newState;
            s = addItemToInventory(s, item2.id).newState;

            const result = combineItems(s, item1.id, item2.id);

            expect(result.success).toBe(true);
            expect(hasItem(result.newState, item1.id)).toBe(false);
            expect(hasItem(result.newState, item2.id)).toBe(false);
            expect(hasItem(result.newState, item1.combinationResultId!)).toBe(true);
        });

        it('should fail if items not in inventory', () => {
            const state = createInitialState();
            const item1 = createItem('item-1', 'Part A', 'Part A', { canBeCombined: true });
            const item2 = createItem('item-2', 'Part B', 'Part B');
            let s = addEntity(state, item1);
            s = addEntity(s, item2);

            const result = combineItems(s, item1.id, item2.id);

            expect(result.success).toBe(false);
            expect(result.message).toContain('must be in inventory');
        });

        it('should fail if items cannot be combined', () => {
            const state = createInitialState();
            const item1 = createItem('item-1', 'Item A', 'Item A');
            const item2 = createItem('item-2', 'Item B', 'Item B');
            let s = addEntity(state, item1);
            s = addEntity(s, item2);
            s = addItemToInventory(s, item1.id).newState;
            s = addItemToInventory(s, item2.id).newState;

            const result = combineItems(s, item1.id, item2.id);

            expect(result.success).toBe(false);
            expect(result.message).toContain('cannot be combined');
        });
    });
});
