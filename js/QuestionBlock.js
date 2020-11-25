import Question from './Question.js';
import QuestionsCreator from './QuestionsCreator.js';

export default class {
	// callbacks:
	// onQuestionAnswered(isRightAnswer, attempts) - called when the user clicked any answer button
	// onShown - called when question block becomes fully shown
	// onHidden - called when question block becomes fully hidden
	constructor(questionBlockSelector, callbacks) {
		this.callbacks = callbacks || {};

		this.questionBlock = document.querySelector(questionBlockSelector);
		this.questionNumber = document.querySelector('.question-block__question-number');
		this.flag = document.querySelector('.question-block__country-flag');
		this.questionText = document.querySelector('.question-block__question');
		this.answerBtns = document.querySelectorAll('.question-block__btn-answer');

		this.answerBtns.forEach((btn, index) => {
			btn.addEventListener('click', () => {
				this.onAnswerButtonClicked(btn, index);
			});
		});

		this.rightBtnIndex = 0;
		this.hoverableBtnsCount = this.answerBtns.length;
		this.isRightAnswerFound = false;
		this.clickedBtns = new Set();
		this.attemptNumber = 1;

		this.reset();
	}

	onAnswerButtonClicked(btn, index) {
		if (this.isRightAnswerFound) return;

		if (this.rightBtnIndex == index) {
			console.log("That's right answer!");
			this.handleRightAnswerBtnClick(btn);
		} else {
			console.log("That's wrong!");
			this.handleWrongAnswerBtnClick(btn);
		}
		this.clickedBtns.add(btn);
		// let hoverableBtnsCount = 0;
		// this.answerBtns.forEach((btn) => {
		// 	if (btn.classList.contains('question-block__btn-answer--hoverable')) hoverableBtnsCount++;
		// });
		// this.hoverableBtnsCount = hoverableBtnsCount;
		// console.log(hoverableBtnsCount);
		// if (this.hoverableBtnsCount == 1) this.showRightAnswer();

		if (this.clickedBtns.size == this.answerBtns.length - 1) {
			this.showRightAnswer();
		}

		if (this.callbacks.onQuestionAnswered)
			this.callbacks.onQuestionAnswered(this.rightBtnIndex == index, this.attemptNumber);
		this.attemptNumber++;
	}

	handleRightAnswerBtnClick(btn) {
		this.isRightAnswerFound = true;
		this.playBtnRightAnswerAnimation(btn);
		setTimeout(() => {
			this.hide(() => {
				this.reset();
			});
		}, 800);
		this.setBtnHoverable(btn, false);
	}

	handleWrongAnswerBtnClick(btn) {
		this.playBtnWrongAnswerAnimation(btn);
		this.setBtnHoverable(btn, false);
	}

	showRightAnswer() {
		this.answerBtns.forEach((btn, index) => {
			if (this.rightBtnIndex == index) {
				this.handleRightAnswerBtnClick(btn);
				setTimeout(() => {
					if (this.callbacks.onQuestionAnswered) this.callbacks.onQuestionAnswered(true);
				}, 300);
			}
		});
	}

	reset() {
		this.answerBtns.forEach((btn) => {
			this.setBtnHoverable(btn, true);
			btn.classList.remove('animation-right-answer');
			btn.classList.remove('animation-wrong-answer');
		});
		this.hoverableBtnsCount = this.answerBtns.length;
		this.isRightAnswerFound = false;
		this.clickedBtns.clear();
		this.attemptNumber = 1;
	}

	bindQuestion(question, questionNumber = 1) {
		this.questionText.textContent = question.questionText;

		this.rightBtnIndex = Math.round(Math.random() * (this.answerBtns.length - 1));
		let wrongAnswerIndex = 0;

		let maxBtnHeight = 0;

		this.answerBtns.forEach((btn, index) => {
			if (this.rightBtnIndex == index) {
				btn.textContent = question.rightAnswer;
			} else {
				btn.textContent = question.wrongAnswers[wrongAnswerIndex];
				wrongAnswerIndex++;
			}
			btn.style.height = '';
		});
		this.answerBtns.forEach((btn) => {
			let h = btn.clientHeight;
			if (h > maxBtnHeight) maxBtnHeight = h;
		});
		this.answerBtns.forEach((btn) => {
			btn.style.height = maxBtnHeight + 'px';
		});
		this.questionNumber.textContent = '#' + questionNumber;
	}

	playBtnRightAnswerAnimation(btn) {
		requestAnimationFrame(() => {
			btn.classList.add('animation-right-answer');
		});
	}

	playBtnWrongAnswerAnimation(btn) {
		requestAnimationFrame(() => {
			btn.classList.add('animation-wrong-answer');
		});
	}

	show(onShown) {
		console.log('show');
		this.questionBlock.classList.remove('animation-hide');
		requestAnimationFrame(() => {
			this.questionBlock.classList.add('animation-show');
		});
		this.questionBlock.addEventListener(
			'animationend',
			() => {
				if (this.callbacks.onShown) this.callbacks.onShown();
				if (onShown) onShown();
			},
			{
				once: true,
			}
		);
	}

	hide(onHidden) {
		this.questionBlock.classList.remove('animation-show');
		requestAnimationFrame(() => {
			this.questionBlock.classList.add('animation-hide');
		});
		this.questionBlock.addEventListener(
			'animationend',
			() => {
				if (this.callbacks.onHidden) this.callbacks.onHidden();
				if (onHidden) onHidden();
			},
			{
				once: true,
			}
		);
	}

	setFlag(src, onLoadCallback, onErrorCallback) {
		if (onLoadCallback) this.flag.addEventListener('load', onLoadCallback, { once: true });
		if (onErrorCallback) this.flag.addEventListener('error', onErrorCallback, { once: true });
		this.flag.src = src;
	}

	setFlagVisibility(visible) {
		if (visible) this.flag.classList.remove('invisible');
		else this.flag.classList.add('invisible');
	}

	setBtnHoverable(btn, hoverable) {
		if (hoverable) {
			btn.classList.add('question-block__btn-answer--hoverable');
		} else {
			btn.classList.remove('question-block__btn-answer--hoverable');
		}
	}
}
