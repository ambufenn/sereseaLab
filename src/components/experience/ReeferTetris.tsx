import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Award, Snowflake, Wind, Box, ArrowDown, ArrowLeft, ArrowRight, RotateCw, Pause } from 'lucide-react';

// Grid size
const ROWS = 16;
const COLS = 10;

// Seafood crate shapes (Tetrominoes with seafood themes)
const CRATES = [
  {
    name: 'Atlantic Salmon Crates',
    color: '#0d9488', // teal
    shape: [
      [1, 1],
      [1, 1],
    ],
    temp: '0°C to 1°C'
  },
  {
    name: 'Yellowfin Tuna Loins',
    color: '#0284c7', // sky
    shape: [
      [1, 1, 1, 1],
    ],
    temp: '-20°C Deep Freeze'
  },
  {
    name: 'King Crab Boxes',
    color: '#f97316', // orange/coral
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    temp: '-18°C Chilled'
  },
  {
    name: 'Tiger Prawn Cartons',
    color: '#10b981', // emerald
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    temp: '-22°C Frozen'
  },
  {
    name: 'Maine Lobster Totes',
    color: '#e11d48', // rose
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    temp: '4°C Aerated'
  }
];

export const ReeferTetris: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [currentPieceIndex, setCurrentPieceIndex] = useState(0);
  const [currentShape, setCurrentShape] = useState<number[][]>(CRATES[0].shape);
  const [position, setPosition] = useState({ r: 0, c: 3 });
  const [score, setScore] = useState(0);
  const [linesPacked, setLinesPacked] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(1280);
  const [airflowEfficiency, setAirflowEfficiency] = useState(98);

  const requestRef = useRef<number | null>(null);
  const lastDropTime = useRef<number>(0);

  // Check collision
  const checkCollision = useCallback((shape: number[][], pos: { r: number; c: number }, currentGrid: number[][]) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const newR = pos.r + r;
          const newC = pos.c + c;
          if (newR >= ROWS || newC < 0 || newC >= COLS) return true;
          if (newR >= 0 && currentGrid[newR][newC] !== 0) return true;
        }
      }
    }
    return false;
  }, []);

  const spawnNewPiece = useCallback((currentGrid: number[][]) => {
    const nextIdx = Math.floor(Math.random() * CRATES.length);
    const nextShape = CRATES[nextIdx].shape;
    const startPos = { r: 0, c: Math.floor((COLS - nextShape[0].length) / 2) };

    if (checkCollision(nextShape, startPos, currentGrid)) {
      setIsGameOver(true);
      setIsPlaying(false);
      return;
    }

    setCurrentPieceIndex(nextIdx);
    setCurrentShape(nextShape);
    setPosition(startPos);
  }, [checkCollision]);

  // Lock piece into grid & clear full rows
  const lockPiece = useCallback(() => {
    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      for (let r = 0; r < currentShape.length; r++) {
        for (let c = 0; c < currentShape[r].length; c++) {
          if (currentShape[r][c] !== 0) {
            const gr = position.r + r;
            const gc = position.c + c;
            if (gr >= 0 && gr < ROWS && gc >= 0 && gc < COLS) {
              newGrid[gr][gc] = currentPieceIndex + 1;
            }
          }
        }
      }

      // Check full rows (cargo layers securely packed)
      let clearedRows = 0;
      const filteredGrid = newGrid.filter(row => {
        const isFull = row.every(cell => cell !== 0);
        if (isFull) clearedRows++;
        return !isFull;
      });

      while (filteredGrid.length < ROWS) {
        filteredGrid.unshift(Array(COLS).fill(0));
      }

      if (clearedRows > 0) {
        setLinesPacked(l => l + clearedRows);
        setScore(s => s + clearedRows * 200 + 50);
        setAirflowEfficiency(a => Math.min(100, a + clearedRows * 2));
      } else {
        setScore(s => s + 25);
        setAirflowEfficiency(a => Math.max(70, a - 1));
      }

      spawnNewPiece(filteredGrid);
      return filteredGrid;
    });
  }, [currentPieceIndex, currentShape, position, spawnNewPiece]);

  // Drop piece 1 step down
  const moveDown = useCallback(() => {
    if (!isPlaying || isGameOver) return;
    const nextPos = { ...position, r: position.r + 1 };
    if (!checkCollision(currentShape, nextPos, grid)) {
      setPosition(nextPos);
    } else {
      lockPiece();
    }
  }, [checkCollision, currentShape, grid, isGameOver, isPlaying, lockPiece, position]);

  const moveLeft = () => {
    if (!isPlaying || isGameOver) return;
    const nextPos = { ...position, c: position.c - 1 };
    if (!checkCollision(currentShape, nextPos, grid)) {
      setPosition(nextPos);
    }
  };

  const moveRight = () => {
    if (!isPlaying || isGameOver) return;
    const nextPos = { ...position, c: position.c + 1 };
    if (!checkCollision(currentShape, nextPos, grid)) {
      setPosition(nextPos);
    }
  };

  const rotate = () => {
    if (!isPlaying || isGameOver) return;
    const rotated = currentShape[0].map((_, index) =>
      currentShape.map(row => row[index]).reverse()
    );
    if (!checkCollision(rotated, position, grid)) {
      setCurrentShape(rotated);
    }
  };

  const hardDrop = () => {
    if (!isPlaying || isGameOver) return;
    let currR = position.r;
    while (!checkCollision(currentShape, { r: currR + 1, c: position.c }, grid)) {
      currR++;
    }
    setPosition({ r: currR, c: position.c });
    setTimeout(lockPiece, 50);
  };

  // Game loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const interval = setInterval(() => {
      moveDown();
    }, 700);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, moveDown]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveRight();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveDown();
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        rotate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const startGame = () => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setScore(0);
    setLinesPacked(0);
    setAirflowEfficiency(98);
    setIsGameOver(false);
    setIsPlaying(true);
    spawnNewPiece(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Interactive Reefer Stacking Simulation
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Reefer Cargo Tetris: Cold-Chain Optimization
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Stack perishable seafood crates to maximize cargo density while maintaining critical cold airflow channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isPlaying && !isGameOver && (
            <button
              onClick={startGame}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Packing Reefer</span>
            </button>
          )}

          {isPlaying && (
            <button
              onClick={() => setIsPlaying(false)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={startGame}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
            title="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Canvas Game Grid */}
        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
          {/* Reefer Container Wall Frame */}
          <div className="w-full max-w-sm mb-3 flex items-center justify-between text-[11px] text-slate-400 font-mono px-2">
            <span className="flex items-center gap-1">
              <Snowflake className="w-3.5 h-3.5 text-sky-400" />
              <span>REEFER UNIT: -20°C COLD WALL</span>
            </span>
            <span className="text-emerald-400">AIRFLOW {airflowEfficiency}%</span>
          </div>

          <div className="relative border-4 border-slate-800 rounded-lg bg-slate-900 shadow-inner overflow-hidden">
            {/* Grid display */}
            <div
              className="grid gap-0.5 bg-slate-800/80 p-0.5"
              style={{
                gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                width: '280px',
                height: `${(280 / COLS) * ROWS}px`,
              }}
            >
              {Array.from({ length: ROWS }).map((_, r) =>
                Array.from({ length: COLS }).map((_, c) => {
                  let cellColor = '#0f172a'; // empty dark
                  let isCurrent = false;

                  // Existing placed crates
                  const val = grid[r][c];
                  if (val > 0) {
                    cellColor = CRATES[val - 1]?.color || '#0d9488';
                  }

                  // Currently falling piece
                  if (
                    isPlaying &&
                    r >= position.r &&
                    r < position.r + currentShape.length &&
                    c >= position.c &&
                    c < position.c + currentShape[0].length
                  ) {
                    const pr = r - position.r;
                    const pc = c - position.c;
                    if (currentShape[pr] && currentShape[pr][pc] !== 0) {
                      cellColor = CRATES[currentPieceIndex].color;
                      isCurrent = true;
                    }
                  }

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`rounded-xs transition-colors duration-75 relative ${
                        isCurrent ? 'ring-1 ring-white/60 brightness-110' : ''
                      }`}
                      style={{
                        backgroundColor: cellColor,
                        boxShadow: val > 0 || isCurrent ? 'inset 0 1px 1px rgba(255,255,255,0.2)' : 'none'
                      }}
                    />
                  );
                })
              )}
            </div>

            {/* Game Over Overlay */}
            {isGameOver && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
                <span className="text-rose-400 font-bold text-sm uppercase tracking-wider mb-1">
                  Reefer Airway Blocked
                </span>
                <h3 className="text-xl font-bold text-white mb-2">Simulation Ended</h3>
                <p className="text-xs text-slate-300 mb-4 max-w-xs">
                  Crates stacked to ceiling limit. Final Score: <strong className="text-teal-400 font-mono">{score}</strong>.
                </p>
                <button
                  onClick={startGame}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Pack Another Reefer
                </button>
              </div>
            )}
          </div>

          {/* On-Screen Mobile/Desktop Controls */}
          <div className="w-full max-w-sm mt-4 grid grid-cols-5 gap-2 text-white">
            <button
              onClick={moveLeft}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg flex items-center justify-center transition-colors"
              title="Move Left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={rotate}
              className="p-2.5 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 rounded-lg flex items-center justify-center transition-colors"
              title="Rotate Crate"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={moveDown}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg flex items-center justify-center transition-colors"
              title="Soft Drop"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={moveRight}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg flex items-center justify-center transition-colors"
              title="Move Right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={hardDrop}
              className="p-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
              title="Hard Drop (Lock)"
            >
              Drop
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            Arrow Keys: Left/Right to slide · Up/Space to rotate · Down to speed
          </p>
        </div>

        {/* Right: Metrics & Active Crate Specs */}
        <div className="lg:col-span-5 space-y-4">
          {/* Packing Scoreboard */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Reefer Telemetry Score
              </span>
              <span className="text-xs font-mono font-bold text-teal-700">
                High: {highScore}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[11px] block">Packing Points</span>
                <span className="font-mono text-2xl font-bold text-slate-900 block mt-0.5">
                  {score}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[11px] block">Crate Layers Completed</span>
                <span className="font-mono text-2xl font-bold text-teal-700 block mt-0.5">
                  {linesPacked}
                </span>
              </div>
            </div>

            {/* Current Crate In Grip */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Active Crane Cargo Crate
              </span>
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: CRATES[currentPieceIndex].color }}
                />
                <div>
                  <span className="font-bold text-slate-900 text-xs block">
                    {CRATES[currentPieceIndex].name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Target: {CRATES[currentPieceIndex].temp}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Insight Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Wind className="w-4 h-4 text-sky-600" />
              <span>Cold-Chain Air Circulation Principle</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              In standard 40ft High-Cube Reefer maritime containers, air circulates from the bottom T-bar floor upward through cargo pallets. Stacking with proper clearances ensures that even inner cartons receive -20°C chill, avoiding hot spots and spoilage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
