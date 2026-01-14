# vaulted Documentation

A runtime-agnostic escape game engine built with TypeScript.

## Overview

vaulted provides a complete set of tools for building escape room games without being tied to any specific rendering or I/O system. The engine is designed to be used with any frontend (CLI, Web, Desktop, etc.).

## Core Concepts

- **Entities** - Game objects like rooms, items, players, puzzles, and props
- **GameState** - Immutable state management for the entire game world
- **Systems** - Game logic modules (Inventory, Navigation, Puzzles)
- **EventBus** - Publish/subscribe system for game events

## Documentation Structure

- [Getting Started](getting-started/README.md) - Quick start guide
- [API Reference](api/README.md) - Complete API documentation
- [Guides](guides/README.md) - In-depth tutorials
- [Examples](examples/README.md) - Code examples

## Quick Example

```typescript
import { createRoom, createItem, createPlayer, createInitialState, addEntity } from 'vaulted';

// Create game entities
const room = createRoom('living-room', 'Living Room', 'A dusty living room');
const key = createItem('gold-key', 'Gold Key', 'A shiny gold key');
const player = createPlayer('hero', 'Hero', 'The protagonist', room.id);

// Initialize game state
let state = createInitialState({ currentRoomId: room.id });
state = addEntity(state, room);
state = addEntity(state, key);
state = addEntity(state, player);
```

## Installation

```bash
pnpm add @ilyeshdz/vaulted
```

## Next Steps

- [Read the Getting Started Guide](getting-started/README.md)
- [Explore the API](api/README.md)
- [Check out Examples](examples/README.md)
