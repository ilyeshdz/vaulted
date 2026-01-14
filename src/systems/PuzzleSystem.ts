import type { EntityId } from '../core/types';
import type { GameState } from '../core/state';
import { isPuzzle } from '../entities';
import { markPuzzleCompleted, updateEntity, logEvent } from '../core/state';
import { createEventType, type BaseEvent } from '../core/events';

export const PUZZLE_SOLVED_EVENT = 'puzzle:solved';
export type PuzzleSolvedEvent = typeof PUZZLE_SOLVED_EVENT;

export interface PuzzleResult {
    readonly success: boolean;
    readonly message: string;
    readonly isSolved: boolean;
    readonly newState: GameState;
}

export function attemptPuzzleSolution(
    state: GameState,
    puzzleId: EntityId,
    solution: string,
    playerId: EntityId
): PuzzleResult {
    const puzzle = state.entities.get(puzzleId);
    if (!puzzle || !isPuzzle(puzzle)) {
        return {
            success: false,
            message: `Puzzle ${String(puzzleId)} not found`,
            isSolved: false,
            newState: state,
        };
    }

    if (puzzle.isSolved) {
        return {
            success: true,
            message: `${puzzle.name} is already solved`,
            isSolved: true,
            newState: state,
        };
    }

    if (puzzle.requiredItemId && !state.inventory.has(puzzle.requiredItemId)) {
        return {
            success: false,
            message: `You need a specific item to solve this puzzle`,
            isSolved: false,
            newState: state,
        };
    }

    const solutionNormalized = solution.toLowerCase().trim();
    const isCorrect = puzzle.solution.some((s) => s.toLowerCase().trim() === solutionNormalized);

    if (!isCorrect) {
        const attemptEvent: BaseEvent = {
            type: createEventType('puzzle:attempt'),
            timestamp: Date.now(),
            targetId: puzzleId,
            sourceId: playerId,
        };
        const newState = logEvent(state, attemptEvent);

        return {
            success: false,
            message: `Incorrect solution for ${puzzle.name}`,
            isSolved: false,
            newState,
        };
    }

    let newState = markPuzzleCompleted(state, puzzleId);
    newState = updateEntity(newState, puzzleId, { isSolved: true });

    const solvedEvent: BaseEvent = {
        type: createEventType(PUZZLE_SOLVED_EVENT),
        timestamp: Date.now(),
        targetId: puzzleId,
        sourceId: playerId,
    };
    newState = logEvent(newState, solvedEvent);

    let message = `Solved ${puzzle.name}!`;
    if (puzzle.rewardItemId) {
        const rewardItem = state.entities.get(puzzle.rewardItemId);
        if (rewardItem) {
            const newInventory = new Set(newState.inventory);
            newInventory.add(puzzle.rewardItemId);
            newState = {
                ...newState,
                inventory: newInventory,
            };
            message += ` Received ${rewardItem.name}!`;
        }
    }

    return {
        success: true,
        message,
        isSolved: true,
        newState,
    };
}

export function getPuzzleHint(state: GameState, puzzleId: EntityId): string | null {
    const puzzle = state.entities.get(puzzleId);
    if (!puzzle || !isPuzzle(puzzle)) {
        return null;
    }
    return puzzle.hint;
}

export function isPuzzleSolved(state: GameState, puzzleId: EntityId): boolean {
    return state.completedPuzzles.has(puzzleId);
}

export function getUnsolvedPuzzles(state: GameState): ReadonlyArray<EntityId> {
    const puzzles: EntityId[] = [];
    for (const entity of state.entities.values()) {
        if (isPuzzle(entity) && !state.completedPuzzles.has(entity.id)) {
            puzzles.push(entity.id);
        }
    }
    return puzzles;
}
