export default class {
	constructor(gameModesSelector) {
		const gameModesContainer = document.querySelector(gameModesSelector);
		const gameModeBtns = gameModesContainer.querySelectorAll('.game-modes__btn-mode');
		this.selectedGameModes = new Set();

		gameModeBtns.forEach((btn) => {
			btn.addEventListener('click', () => {
				this.onGameModeBtnClicked(btn);
			});
			if (btn.classList.contains('game-modes__btn-mode--active')) {
				let gameMode = this.parseGameMode(btn.dataset.mode);
				this.selectedGameModes.add(gameMode);
			}
		});
	}

	onGameModeBtnClicked(btn) {
		let gameMode = this.parseGameMode(btn.dataset.mode);

		if (btn.classList.contains('game-modes__btn-mode--active')) {
			if (this.selectedGameModes.size > 1) {
				this.selectedGameModes.delete(gameMode);
				btn.classList.remove('game-modes__btn-mode--active');
			}
		} else {
			btn.classList.add('game-modes__btn-mode--active');
			this.selectedGameModes.add(gameMode);
		}
	}

	parseGameMode(gameModeStr) {
		switch (gameModeStr) {
			case 'capital':
				return GAME_MODE.GUESS_CAPITAL;
			case 'country':
				return GAME_MODE.GUESS_COUNTRY;
			case 'country-by-flag':
				return GAME_MODE.GUESS_COUNTRY_BY_FLAG;
		}
	}
}

export const GAME_MODE = {
	GUESS_CAPITAL: 0,
	GUESS_COUNTRY: 1,
	GUESS_COUNTRY_BY_FLAG: 2,
};
