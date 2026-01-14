import { describe, it, expect } from 'vitest';
import { createEntityId } from '../../src/core/types';

describe('EntityId', () => {
    describe('createEntityId', () => {
        it('should create a valid EntityId', () => {
            const id = createEntityId('room-1');
            expect(id).toBe('room-1');
        });

        it('should throw for empty string', () => {
            expect(() => createEntityId('')).toThrow('EntityId cannot be empty');
        });

        it('should create unique EntityIds', () => {
            const id1 = createEntityId('item-1');
            const id2 = createEntityId('item-2');
            expect(id1).not.toBe(id2);
        });
    });
});
