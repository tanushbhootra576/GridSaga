## GridSaga 
# 3D Rubik's Cube 2048

A modern, interactive 3D Rubik's Cube twist on the classic 2048 puzzle game, built with Next.js, React, and TypeScript.

## Features

- **3D Rubik's Cube Board:** Play 2048 on all 6 faces of a 3D cube. Rotate the cube and play on any face!
- **Multiple Grid Sizes:** Choose between 4x4, 5x5, or 6x6 grids for each face.
- **Independent Faces:** Each face is its own 2048 game. Your score and progress are tracked per face.
- **Modern UI:** Responsive, touch-friendly, and beautiful interface with smooth 3D animations.
- **AI Hint:** Get AI-powered hints to help you make your next move.
- **Persistent High Score:** Your best score is saved in your browser.

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm or yarn

### Installation
```bash
npm install
# or
yarn install
```

### Development
```bash
npm run dev
# or
yarn dev
```
Visit local host in your browser.

### Production Build
```bash
npm run build
npm start
```

## Project Structure

- `src/app/` — Main Next.js app entry and page components
- `src/components/game/` — Game UI components (board, tile, overlays)
- `src/hooks/` — Custom React hooks (game state, etc.)
- `src/lib/` — Game logic and utilities
- `public/` — Static assets (icons, manifest, etc.)

## How to Play
- Use arrow keys or swipe to move tiles on the active face.
- Click face buttons or drag to rotate the cube and play on any face.
- Merge tiles of the same number to reach 2048 on any face!

## Credits
- Inspired by [2048] and the Rubik's Cube.
- Built with [Next.js], [React], and [TypeScript].

## Contributing
Feel free to fork this project, make enhancements, and open pull requests!


### ✨ Developed by Tanush Bhootra