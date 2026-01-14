import { describe, it, expect } from 'vitest';
import { sayHello } from '../src/index';

describe('sayHello', () => {
    it('should return a greeting with the provided name', () => {
        expect(sayHello('World')).toBe('Hello World');
    });

    it('should handle different names', () => {
        expect(sayHello('TypeScript')).toBe('Hello TypeScript');
        expect(sayHello('Vitest')).toBe('Hello Vitest');
    });
});
