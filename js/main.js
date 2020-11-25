import Question from './Question.js';
import QuestionBlock from './QuestionBlock.js';
import QuestionsCreator from './QuestionsCreator.js';
import { GAME_MODE } from './GameModes.js';
import GameModes from './GameModes.js';
import Statistic from './Statistic.js';

window.onload = () => {
	const questionsCreator = new QuestionsCreator();

	const gameModes = new GameModes('.game-modes');
	let gameMode = null;

	const statistic = new Statistic('.statistic');

	let questionNumber = 1;

	// Setting up question block
	let questionBlock = new QuestionBlock('.question-block', {
		onQuestionAnswered,
		onShown: onQuestionBlockShown,
		onHidden: onQuestionBlockHidden,
	});

	function onQuestionAnswered(isRightAnswer, attemptNumber) {
		if (attemptNumber == 1)
			if (isRightAnswer) statistic.addCorrectAnswer();
			else statistic.addWrongAnswer();
	}

	function onQuestionBlockShown() {}

	function onQuestionBlockHidden() {
		console.log('hidden');
		setTimeout(nextQuestion, 300);
	}

	// loading countries from restcountries.eu, creating and binding new question
	let countries;
	loadCountries((loadedCountries) => {
		countries = loadedCountries;
		console.log(countries);

		nextQuestion();
	});

	let question = new Question();

	function getNewQuestion() {
		return questionsCreator.create(gameMode, countries);
	}

	function nextQuestion() {
		setRandomGameMode();
		questionBlock.bindQuestion(getNewQuestion(), questionNumber);

		// We don't want to show flag when game mode is "GUESS COUNTRY"
		if (gameMode != GAME_MODE.GUESS_COUNTRY) {
			const flagSrc = getCountryFlagSrc(questionsCreator.getRightAnswerCountry().alpha2Code);
			questionBlock.setFlag(flagSrc, onFlagLoaded, onFlagNotLoaded);
			questionBlock.setFlagVisibility(true);

			function onFlagLoaded() {
				questionBlock.show();
				questionNumber++;
			}
			// We can't play game if game mode is "GUESS COUNTRY BY FLAG" without flat
			// So we trying to load new question
			// In other game modes we can play without flag
			function onFlagNotLoaded() {
				if (gameMode == GAME_MODE.GUESS_COUNTRY_BY_FLAG) {
					nextQuestion();
				} else {
					questionBlock.show();
					questionNumber++;
				}
			}
		} else {
			setTimeout(() => {
				questionBlock.setFlagVisibility(false);
				questionBlock.show();
				questionNumber++;
			}, 200);
		}
	}

	function setRandomGameMode() {
		let gameModeIndex = Math.round(Math.random() * (gameModes.selectedGameModes.size - 1));
		console.log(...gameModes.selectedGameModes);
		gameMode = [...gameModes.selectedGameModes][gameModeIndex];
	}

	function getCountryFlagSrc(countryCode) {
		return `https://www.countryflags.io/${countryCode}/flat/64.png`;
	}

	function loadCountries(onCountriesLoaded = (countries) => {}) {
		let countries = localStorage.getItem('countries');
		if (countries) {
			onCountriesLoaded(JSON.parse(countries));
		} else {
			console.log('fetching');
			fetch('https://restcountries.eu/rest/v2/all')
				.then((data) => data.json())
				.then((data) => {
					localStorage.setItem('countries', JSON.stringify(data));
					onCountriesLoaded(data);
				});
		}
	}
};
