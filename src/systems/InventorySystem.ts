import type { EntityId } from '../core/types';
import type { GameState } from '../core/state';

export interface InventoryActionResult {
    readonly success: boolean;
    readonly message: string;
    readonly newState: GameState;
}

export function addItemToInventory(state: GameState, itemId: EntityId): InventoryActionResult {
    const item = state.entities.get(itemId);
    if (!item) {
        return {
            success: false,
            message: `Item ${itemId} not found`,
            newState: state,
        };
    }

    if (item.type !== 'item') {
        return {
            success: false,
            message: `${itemId} is not an item`,
            newState: state,
        };
    }

    if (state.inventory.has(itemId)) {
        return {
            success: false,
            message: `${item.name} is already in inventory`,
            newState: state,
        };
    }

    const newState = {
        ...state,
        inventory: new Set(state.inventory).add(itemId),
    };

    return {
        success: true,
        message: `Picked up ${item.name}`,
        newState,
    };
}

export function removeItemFromInventory(state: GameState, itemId: EntityId): InventoryActionResult {
    if (!state.inventory.has(itemId)) {
        return {
            success: false,
            message: `Item ${itemId} not in inventory`,
            newState: state,
        };
    }

    const newState = {
        ...state,
        inventory: new Set(state.inventory).delete(itemId)
            ? state.inventory
            : new Set(state.inventory),
    };
    newState.inventory.delete(itemId);

    const newInventory = new Set(state.inventory);
    newInventory.delete(itemId);

    return {
        success: true,
        message: `Removed item`,
        newState: {
            ...state,
            inventory: newInventory,
        },
    };
}

export function hasItem(state: GameState, itemId: EntityId): boolean {
    return state.inventory.has(itemId);
}

export function getInventoryItems(state: GameState): ReadonlyArray<EntityId> {
    return Array.from(state.inventory);
}

export function combineItems(
    state: GameState,
    itemId1: EntityId,
    itemId2: EntityId
): InventoryActionResult {
    if (!hasItem(state, itemId1) || !hasItem(state, itemId2)) {
        return {
            success: false,
            message: 'Both items must be in inventory to combine them',
            newState: state,
        };
    }

    const item1 = state.entities.get(itemId1);
    const item2 = state.entities.get(itemId2);

    if (!item1 || !item2 || item1.type !== 'item' || item2.type !== 'item') {
        return {
            success: false,
            message: 'Invalid items',
            newState: state,
        };
    }

    if (!item1.canBeCombined && !item2.canBeCombined) {
        return {
            success: false,
            message: 'These items cannot be combined',
            newState: state,
        };
    }

    if (item1.combinationResultId) {
        const newInventory = new Set(state.inventory);
        newInventory.delete(itemId1);
        newInventory.delete(itemId2);
        newInventory.add(item1.combinationResultId);

        return {
            success: true,
            message: `Combined ${item1.name} and ${item2.name} into a new item`,
            newState: {
                ...state,
                inventory: newInventory,
            },
        };
    }

    return {
        success: false,
        message: 'These items cannot be combined',
        newState: state,
    };
}
