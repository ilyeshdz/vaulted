import { describe, it, expect } from 'vitest';
import {
    createRoom,
    createItem,
    createPlayer,
    createPuzzle,
    createProp,
    isRoom,
    isItem,
    isPlayer,
    isPuzzle,
    isProp,
} from '../../src/entities';
import { createEntityId } from '../../src/core/types';
import type { EntityId } from '../../src/core/types';

describe('Entities', () => {
    describe('Room', () => {
        it('should create a room with defaults', () => {
            const room = createRoom('room-1', 'Test Room', 'A test room');

            expect(room.id).toBe('room-1');
            expect(room.type).toBe('room');
            expect(room.name).toBe('Test Room');
            expect(room.description).toBe('A test room');
            expect(room.position).toBeNull();
            expect(room.dimensions).toBeNull();
            expect(room.exits.size).toBe(0);
            expect(room.objects.size).toBe(0);
            expect(room.isLocked).toBe(false);
            expect(room.requiredKeyId).toBeNull();
            expect(room.tags.size).toBe(0);
        });

        it('should create a room with exits', () => {
            const exitRoom = createEntityId('room-2');
            const room = createRoom('room-1', 'Room 1', 'Room 1', {
                exits: new Map([['north', exitRoom]]),
            });

            expect(room.exits.get('north')).toBe(exitRoom);
        });

        it('should create a locked room', () => {
            const keyId = createEntityId('key-1');
            const room = createRoom('room-1', 'Locked Room', 'A locked room', {
                isLocked: true,
                requiredKeyId: keyId,
            });

            expect(room.isLocked).toBe(true);
            expect(room.requiredKeyId).toBe(keyId);
        });

        it('isRoom should return true for rooms', () => {
            const room = createRoom('room-1', 'Test', 'Test');
            expect(isRoom(room)).toBe(true);
            expect(isRoom({ type: 'item', id: 'test', name: 'Test', description: '' })).toBe(false);
        });
    });

    describe('Item', () => {
        it('should create an item with defaults', () => {
            const item = createItem('item-1', 'Key', 'A brass key');

            expect(item.id).toBe('item-1');
            expect(item.type).toBe('item');
            expect(item.name).toBe('Key');
            expect(item.description).toBe('A brass key');
            expect(item.isCollectable).toBe(true);
            expect(item.isUsable).toBe(false);
            expect(item.isKey).toBe(false);
            expect(item.canBeCombined).toBe(false);
        });

        it('should create a key item', () => {
            const item = createItem('key-1', 'Silver Key', 'A silver key', {
                isKey: true,
                isUsable: true,
            });

            expect(item.isKey).toBe(true);
            expect(item.isUsable).toBe(true);
        });

        it('should create a combinable item', () => {
            const resultId = createEntityId('combined-item');
            const item = createItem('part-1', 'Part 1', 'Part of an item', {
                canBeCombined: true,
                combinationResultId: resultId,
            });

            expect(item.canBeCombined).toBe(true);
            expect(item.combinationResultId).toBe(resultId);
        });

        it('isItem should return true for items', () => {
            const item = createItem('item-1', 'Key', 'Key');
            expect(isItem(item)).toBe(true);
        });
    });

    describe('Player', () => {
        it('should create a player with defaults', () => {
            const roomId = createEntityId('room-1');
            const player = createPlayer('player-1', 'Player 1', 'A player', roomId);

            expect(player.id).toBe('player-1');
            expect(player.type).toBe('player');
            expect(player.name).toBe('Player 1');
            expect(player.currentRoomId).toBe(roomId);
            expect(player.health).toBe(100);
            expect(player.maxHealth).toBe(100);
        });

        it('should cap health at maxHealth', () => {
            const roomId = createEntityId('room-1');
            const player = createPlayer('player-1', 'Player', 'A player', roomId, {
                health: 150,
                maxHealth: 100,
            });

            expect(player.health).toBe(100);
        });

        it('isPlayer should return true for players', () => {
            const roomId = createEntityId('room-1');
            const player = createPlayer('player-1', 'Player', 'Player', roomId);
            expect(isPlayer(player)).toBe(true);
        });
    });

    describe('Puzzle', () => {
        it('should create a puzzle', () => {
            const puzzle = createPuzzle('puzzle-1', 'Code Puzzle', 'Enter the code', ['1234']);

            expect(puzzle.id).toBe('puzzle-1');
            expect(puzzle.type).toBe('puzzle');
            expect(puzzle.solution).toEqual(['1234']);
            expect(puzzle.isSolved).toBe(false);
            expect(puzzle.hint).toBeNull();
        });

        it('should create a puzzle with reward', () => {
            const rewardId = createEntityId('reward-item');
            const puzzle = createPuzzle('puzzle-1', 'Puzzle', 'Solve it', ['answer'], {
                hint: 'Think about it',
                rewardItemId: rewardId,
            });

            expect(puzzle.hint).toBe('Think about it');
            expect(puzzle.rewardItemId).toBe(rewardId);
        });

        it('isPuzzle should return true for puzzles', () => {
            const puzzle = createPuzzle('puzzle-1', 'Puzzle', 'Puzzle', ['answer']);
            expect(isPuzzle(puzzle)).toBe(true);
        });
    });

    describe('Prop', () => {
        it('should create a prop', () => {
            const prop = createProp('prop-1', 'Table', 'A wooden table');

            expect(prop.id).toBe('prop-1');
            expect(prop.type).toBe('prop');
            expect(prop.isInteractive).toBe(false);
            expect(prop.onInteract).toBeNull();
        });

        it('should create an interactive prop', () => {
            const prop = createProp('prop-1', 'Lever', 'A rusty lever', {
                isInteractive: true,
                onInteract: 'pull_lever',
            });

            expect(prop.isInteractive).toBe(true);
            expect(prop.onInteract).toBe('pull_lever');
        });

        it('isProp should return true for props', () => {
            const prop = createProp('prop-1', 'Table', 'Table');
            expect(isProp(prop)).toBe(true);
        });
    });
});
