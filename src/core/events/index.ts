import type { EntityId } from '../types';

export type EventType = string & { readonly brand: unique symbol };

export function createEventType<T extends string>(value: T): EventType {
    if (value.length === 0) {
        throw new Error('EventType cannot be empty');
    }
    return value as unknown as EventType;
}

export interface BaseEvent {
    readonly type: EventType;
    readonly timestamp: number;
    readonly targetId?: EntityId;
    readonly sourceId?: EntityId;
}

export type EventHandler<T extends BaseEvent = BaseEvent> = (event: T) => void;

export interface Subscribable {
    subscribe<T extends BaseEvent>(eventType: EventType, handler: EventHandler<T>): void;
    unsubscribe<T extends BaseEvent>(eventType: EventType, handler: EventHandler<T>): void;
}

export class EventBus implements Subscribable {
    private handlers: Map<EventType, Set<EventHandler<BaseEvent>>> = new Map();
    private eventHistory: BaseEvent[] = [];
    private maxHistorySize: number;

    constructor(maxHistorySize: number = 100) {
        this.maxHistorySize = maxHistorySize;
    }

    emit<T extends BaseEvent>(event: T): void {
        const handlers = this.handlers.get(event.type);
        if (handlers) {
            for (const handler of handlers) {
                handler(event);
            }
        }
        this.addToHistory(event);
    }

    subscribe<T extends BaseEvent>(eventType: EventType, handler: EventHandler<T>): void {
        let handlers = this.handlers.get(eventType);
        if (!handlers) {
            handlers = new Set();
            this.handlers.set(eventType, handlers);
        }
        handlers.add(handler as EventHandler<BaseEvent>);
    }

    unsubscribe<T extends BaseEvent>(eventType: EventType, handler: EventHandler<T>): void {
        const handlers = this.handlers.get(eventType);
        if (handlers) {
            handlers.delete(handler as EventHandler<BaseEvent>);
            if (handlers.size === 0) {
                this.handlers.delete(eventType);
            }
        }
    }

    getHistory(): ReadonlyArray<BaseEvent> {
        return [...this.eventHistory];
    }

    clearHistory(): void {
        this.eventHistory = [];
    }

    private addToHistory(event: BaseEvent): void {
        this.eventHistory.push(event);
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }
    }
}

export function createEventBus(maxHistorySize?: number): EventBus {
    return new EventBus(maxHistorySize);
}
