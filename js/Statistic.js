export default class {
	constructor(statisticSelector) {
		this.statisticElement = document.querySelector(statisticSelector);
		this.correctAnswersElement = this.statisticElement.querySelector('.statistic__correct');
		this.wrongAnswersElement = this.statisticElement.querySelector('.statistic__wrong');
		this.accuracyElement = this.statisticElement.querySelector('.statistic__accuracy');

		this.statisticData = JSON.parse(localStorage.getItem('statisticData')) || {
			accuracy: 0,
			correctAnswers: 0,
			wrongAnswers: 0,
		};

		this.updateAll();
	}

	updateAll() {
		this.updateAccuracy();
		this.updateStatisticUI();
	}

	updateStatisticUI() {
		this.correctAnswersElement.textContent = this.statisticData.correctAnswers;
		this.wrongAnswersElement.textContent = this.statisticData.wrongAnswers;
		this.accuracyElement.textContent = this.statisticData.accuracy + '%';
	}

	addCorrectAnswer() {
		this.statisticData.correctAnswers += 1;
		this.updateElementText(this.correctAnswersElement, this.statisticData.correctAnswers);
		this.updateAccuracy();
		console.log('correct');
	}

	addWrongAnswer() {
		this.statisticData.wrongAnswers += 1;
		this.updateElementText(this.wrongAnswersElement, this.statisticData.wrongAnswers);
		this.updateAccuracy();
		console.log('wrong');
		//this.updateAllAndSave();
	}

	updateElementText(element, value, animate = true) {
		if (animate) this.animateText(element);
		element.textContent = value;
	}

	animateText(element) {
		element.classList.remove('animation-text-update');
		// triggering reflow for animaition
		element.offsetHeight;
		element.classList.add('animation-text-update');
	}

	updateAccuracy() {
		const answersCount = this.statisticData.correctAnswers + this.statisticData.wrongAnswers;
		this.statisticData.accuracy = Math.round(
			(this.statisticData.correctAnswers / answersCount || 0) * 100
		);
		this.updateElementText(this.accuracyElement, this.statisticData.accuracy + '%', false);
		this.saveStatistic();
	}

	saveStatistic() {
		localStorage.setItem('statisticData', JSON.stringify(this.statisticData));
	}
}
