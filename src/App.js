import './App.css';
import SingleCard from './components/SingleCard';
import { useState, useEffect } from 'react';

const cardImages = [
	{ src: '/img/helmet-1.png', matched: false },
	{ src: '/img/potion-1.png', matched: false },
	{ src: '/img/ring-1.png', matched: false },
	{ src: '/img/scroll-1.png', matched: false },
	{ src: '/img/shield-1.png', matched: false },
	{ src: '/img/sword-1.png', matched: false }
];

export default function App() {
	const [ cards, setCards ] = useState([]);
	const [ turns, setTurns ] = useState(0);
	const [ choiceOne, setChoiceOne ] = useState(null);
	const [ choiceTwo, setChoiceTwo ] = useState(null);
	const [ disabled, setDisabled ] = useState(false);

	// mix the cards
	const mixCards = () => {
		const mixedCards = [ ...cardImages, ...cardImages ]
			.sort(() => Math.random() - 0.5)
			.map((card) => ({ ...card, id: Math.random() }));
		setTurns(0);
		setChoiceOne(null);
		setChoiceTwo(null);
		setCards(mixedCards);
	};

	// handle a choice
	const handleChoice = (card) => {
		choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
	};

	// compoare the two selected cards
	useEffect(
		() => {
			if (choiceOne && choiceTwo) {
				setDisabled(true);
				if (choiceOne.src === choiceTwo.src) {
					setCards((prevCards) => {
						return prevCards.map((card) => {
							if (card.src === choiceOne.src) {
								return { ...card, matched: true };
							} else {
								return card;
							}
						});
					});
					resetTurn();
				} else {
					setTimeout(() => {
						resetTurn();
					}, 1000);
				}
			}
		},
		[ choiceOne, choiceTwo ]
	);

	// reset choice & increse turn
	const resetTurn = () => {
		setChoiceOne(null);
		setChoiceTwo(null);
		setTurns((prevTurns) => prevTurns + 1);
		setDisabled(false);
	};

	// start a new game automatically
	useEffect(() => {
		mixCards();
	}, []);
	return (
		<div className="App">
			<h1>Magic Match</h1>
			<button onClick={mixCards}>New Game</button>

			<div className="card-grid">
				{cards.map((card) => (
					<SingleCard
						card={card}
						key={card.id}
						handleChoice={handleChoice}
						flipped={card === choiceOne || card === choiceTwo || card.matched}
						disabled={disabled}
					/>
				))}
			</div>
			<p>Turns: {turns} </p>
		</div>
	);
}
