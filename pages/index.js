import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';

import dynamic from 'next/dynamic';
const TetrisGame = dynamic(() => import('../components/TetrisGame').then((mod) => mod.TetrisGame), {
	ssr: false,
});

export default function Home() {
	return (
		<div>
			<Head>
				<title>Tetris Web App</title>
				<meta name='description' content='Tetris game built with Next.js' />
				<link rel='icon' href='/favicon.ico' />
			</Head>{' '}
			<main>
				<h1>Tetris Web App</h1>
				<TetrisGame />
			</main>
			<style jsx>{`
				main {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					height: 100vh;
					font-family: Arial, sans-serif;
				}
			`}</style>
		</div>
	);
}
