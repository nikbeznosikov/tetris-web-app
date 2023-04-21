import React from 'react';
import Tetriminos from './Tetriminos';

const TetrisBoard = ({ board, activeTetrimino }) => {
	const getMergedBoard = () => {
		const mergedBoard = JSON.parse(JSON.stringify(board));
		const shape = Tetriminos[activeTetrimino.shape][activeTetrimino.rotation];

		for (let row = 0; row < shape.length; row++) {
			for (let col = 0; col < shape[row].length; col++) {
				if (shape[row][col]) {
					const boardX = activeTetrimino.position.x + col;
					const boardY = activeTetrimino.position.y + row;
					if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
						mergedBoard[boardY][boardX] = 1;
					}
				}
			}
		}

		return mergedBoard;
	};

	return (
		<div className='board'>
			{getMergedBoard().map((row, rowIndex) => (
				<div key={rowIndex} className='board-row'>
					{row.map((cell, cellIndex) => (
						<div key={cellIndex} className={`cell ${cell ? 'filled' : 'empty'}`}></div>
					))}
				</div>
			))}
			<style jsx>{`
				.board {
					display: flex;
					flex-direction: column;
					border: 1px solid #ccc;
				}
				.board-row {
					display: flex;
					flex-direction: row;
				}
				.cell {
					width: 20px;
					height: 20px;
					border: 1px solid #ccc;
				}
				.filled {
					background-color: #333;
				}
			`}</style>
		</div>
	);
};

export default TetrisBoard;
