export default class {
	constructor(questionText, rightAnswer, wrongAnswers) {
		this.questionText = questionText;
		this.rightAnswer = rightAnswer;
		this.wrongAnswers = wrongAnswers;
	}

	isAnswerRight(answer) {
		if (answer === this.rightAnswer) return true;
		return false;
	}
}
