import { GAME_MODE } from './GameModes.js';
import Question from './Question.js';

export default class {
	constructor() {
		this.countriesPack = null;
	}
	create(gameMode, countries) {
		// returns an Array of random countries with length of 'count'
		const getRandomCountries = (count) => {
			let randomCountries = new Set();
			do {
				const country = countries[Math.round(Math.random() * (countries.length - 1))];
				// Filtering countries without capital
				if (country.capital == '') continue;

				randomCountries.add(country);
			} while (randomCountries.size != count);

			return [...randomCountries];
		};

		// Some countries have '(Republic of)' or 'and ...' after their names. We can trim that to get shorter name
		function trimName(name) {
			return name
				.replace(/\(.*\)/, '')
				.replace(/and.*/, '')
				.trim();
		}

		// Getting 4 random countries
		// First of them will be the country which contains the right answer (e.g. country's capital or name)
		this.countriesPack = getRandomCountries(4);
		let questionText,
			rightAnswer,
			wrongAnswers = [];
		let rightAnswerCountry = this.getRightAnswerCountry();
		let wrongAnswersCountries = this.getWrongAswersCountries();

		switch (gameMode) {
			case GAME_MODE.GUESS_CAPITAL:
				questionText = questions[gameMode].replace('%1', trimName(rightAnswerCountry.name));
				rightAnswer = rightAnswerCountry.capital;

				wrongAnswersCountries.forEach((country) => {
					wrongAnswers.push(country.capital);
				});
				break;
			case GAME_MODE.GUESS_COUNTRY:
				questionText = questions[gameMode].replace('%1', trimName(rightAnswerCountry.capital));
				rightAnswer = rightAnswerCountry.name;

				wrongAnswersCountries.forEach((country) => {
					wrongAnswers.push(country.name);
				});
				break;
			case GAME_MODE.GUESS_COUNTRY_BY_FLAG:
				questionText = questions[gameMode];
				rightAnswer = rightAnswerCountry.name;

				wrongAnswersCountries.forEach((country) => {
					wrongAnswers.push(country.name);
				});
				break;
		}
		wrongAnswers.forEach((item, i) => {
			wrongAnswers[i] = trimName(wrongAnswers[i]);
		});
		let question = new Question(questionText, trimName(rightAnswer), wrongAnswers);
		console.log(question);
		return question;
	}

	getRightAnswerCountry() {
		if (this.countriesPack) return this.countriesPack[0];
		else throw new Error('Trying to access countriesPack before calling create()');
	}
	getWrongAswersCountries() {
		if (this.countriesPack) return this.countriesPack.slice(1);
		else throw new Error('Trying to access countriesPack before calling create()');
	}
}

const questions = [
	'What is the capital of %1?',
	"Which country's capital is %1?",
	"Whose country's flag is shown in the picture?",
];
