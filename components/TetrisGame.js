import React, { useState, useEffect, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import TetrisBoard from './TetrisBoard';
import Tetriminos from './Tetriminos';

const createEmptyBoard = () => {
	const rows = 20;
	const cols = 10;
	return Array.from({ length: rows }, () => Array(cols).fill(0));
};

const TetrisGame = () => {
	const [board, setBoard] = useState(createEmptyBoard());
	const [gameOver, setGameOver] = useState(false);
	const [score, setScore] = useState(0);

	const hasCollision = (newPosition) => {
		const shape = Tetriminos[activeTetrimino.shape][activeTetrimino.rotation];

		for (let row = 0; row < shape.length; row++) {
			for (let col = 0; col < shape[row].length; col++) {
				if (shape[row][col]) {
					const boardX = newPosition.x + col;
					const boardY = newPosition.y + row;

					if (
						boardY < 0 ||
						boardY >= board.length ||
						boardX < 0 ||
						boardX >= board[0].length ||
						board[boardY][boardX]
					) {
						return true;
					}
				}
			}
		}

		return false;
	};

	const clearLines = () => {
		let linesCleared = 0;

		for (let row = 0; row < board.length; row++) {
			if (board[row].every((cell) => cell === 1)) {
				linesCleared++;

				// Remove the line
				board.splice(row, 1);

				// Add an empty line at the top
				board.unshift(new Array(board[0].length).fill(0));
			}
		}

		return linesCleared;
	};

	const moveLeft = () => {
		const newPosition = {
			x: activeTetrimino.position.x - 1,
			y: activeTetrimino.position.y,
		};

		if (!hasCollision(newPosition)) {
			setActiveTetrimino((prev) => ({
				...prev,
				position: newPosition,
			}));
		}
	};

	const moveRight = () => {
		const newPosition = {
			x: activeTetrimino.position.x + 1,
			y: activeTetrimino.position.y,
		};

		if (!hasCollision(newPosition)) {
			setActiveTetrimino((prev) => ({
				...prev,
				position: newPosition,
			}));
		}
	};

	const moveDown = () => {
		const newPosition = {
			x: activeTetrimino.position.x,
			y: activeTetrimino.position.y + 1,
		};

		if (!hasCollision(newPosition)) {
			setActiveTetrimino((prev) => ({
				...prev,
				position: newPosition,
			}));
		} else {
			lockTetrimino();
		}
	};

	const gameLoopRef = useRef();
	gameLoopRef.current = moveDown;

	useEffect(() => {
		const gameLoop = () => {
			if (!gameOver) {
				gameLoopRef.current();
			}
		};

		const intervalId = setInterval(gameLoop, 500);

		return () => {
			clearInterval(intervalId);
		};
	}, [gameOver]);

	const getRandomTetrimino = () => {
		const shapes = 'IOTSZJL';
		const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
		return {
			shape: randomShape,
			rotation: 0,

			position: { x: Math.floor(board[0].length / 2) - 1, y: 0 },
		};
	};

	const [activeTetrimino, setActiveTetrimino] = useState(getRandomTetrimino());
	const [nextTetrimino, setNextTetrimino] = useState(getRandomTetrimino());

	const lockTetrimino = () => {
		const shape = Tetriminos[activeTetrimino.shape][activeTetrimino.rotation];

		for (let row = 0; row < shape.length; row++) {
			for (let col = 0; col < shape[row].length; col++) {
				if (shape[row][col]) {
					const boardX = activeTetrimino.position.x + col;
					const boardY = activeTetrimino.position.y + row;

					if (boardY < 0) {
						setGameOver(true);
						return;
					}

					board[boardY][boardX] = 1;
				}
			}
		}

		const linesCleared = clearLines();
		setScore((prevScore) => prevScore + linesCleared * 10);

		setActiveTetrimino(nextTetrimino);
		setNextTetrimino(getRandomTetrimino());
	};

	const renderNextTetrimino = (tetrimino) => {
		const rows = 4;
		const cols = 4;
		const shape = Tetriminos[tetrimino.shape][tetrimino.rotation];

		// Create an empty matrix with 4 rows and 4 columns
		const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

		// Add the shape to the matrix
		for (let row = 0; row < shape.length; row++) {
			for (let col = 0; col < shape[row].length; col++) {
				if (shape[row][col]) {
					matrix[row][col] = 1;
				}
			}
		}

		// Use a dummy activeTetrimino prop
		const dummyActiveTetrimino = {
			shape: tetrimino.shape,
			rotation: tetrimino.rotation,
			position: { x: 0, y: 0 },
		};

		return <TetrisBoard board={matrix} activeTetrimino={dummyActiveTetrimino} />;
	};

	const rotateTetrimino = () => {
		const nextRotation = (activeTetrimino.rotation + 1) % Tetriminos[activeTetrimino.shape].length;
		const newTetrimino = { ...activeTetrimino, rotation: nextRotation };

		let newPosition = { ...activeTetrimino.position };

		// Check for collision after rotation
		const shape = Tetriminos[newTetrimino.shape][newTetrimino.rotation];
		for (let row = 0; row < shape.length; row++) {
			for (let col = 0; col < shape[row].length; col++) {
				if (shape[row][col]) {
					const boardX = newPosition.x + col;
					const boardY = newPosition.y + row;

					if (boardX < 0) {
						newPosition.x += 1;
					} else if (boardX >= board[0].length) {
						newPosition.x -= 1;
					} else if (boardY >= board.length) {
						newPosition.y -= 1;
					}
				}
			}
		}

		if (!hasCollision(newPosition)) {
			setActiveTetrimino({ ...newTetrimino, position: newPosition });
		}
	};

	const handleKeyEvent = (key, e) => {
		if (key === 'left') {
			moveLeft();
		} else if (key === 'right') {
			moveRight();
		} else if (key === 'down') {
			moveDown();
		} else if (key === 'up') {
			rotateTetrimino();
		}
	};

	return (
		<div>
			{gameOver ? (
				<div className='game-over'>Game Over</div>
			) : (
				<TetrisBoard board={board} activeTetrimino={activeTetrimino} />
			)}
			<div className='score'>Score: {score}</div>
			<KeyboardEventHandler
				handleKeys={['left', 'right', 'down', 'up']}
				onKeyEvent={(key, e) => handleKeyEvent(key, e)}
			/>
			<div className='next-tetrimino'>
				<h3>Next Tetrimino:</h3>
				{renderNextTetrimino(nextTetrimino)}
			</div>
		</div>
	);
};

export { TetrisGame };
