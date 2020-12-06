export default class {
	constructor(gameModesSelector) {
		const gameModesContainer = document.querySelector(gameModesSelector);
		const gameModeBtns = gameModesContainer.querySelectorAll('.game-modes__btn-mode');
		this.selectedGameModes = this.loadGameModes();
		gameModeBtns.forEach((btn) => {
			btn.addEventListener('click', () => {
				this.onGameModeBtnClicked(btn);
			});
			const btnGameMode = btn.dataset['mode'];
			if (this.selectedGameModes.has(this.parseGameMode(btnGameMode)))
				btn.classList.add('game-modes__btn-mode--active');
			else btn.classList.remove('game-modes__btn-mode--active');
			// if (btn.classList.contains('game-modes__btn-mode--active')) {
			// 	let gameMode = this.parseGameMode(btn.dataset.mode);
			// 	this.selectedGameModes.add(gameMode);
			// }
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
		this.saveGameModes();
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

	gameModeToString(gameMode) {
		switch (gameMode) {
			case GAME_MODE.GUESS_CAPITAL:
				return 'capital';
			case GAME_MODE.GUESS_COUNTRY:
				return 'country';
			case GAME_MODE.GUESS_COUNTRY_BY_FLAG:
				return 'country-by-flag';
		}
	}

	saveGameModes() {
		localStorage.setItem('game-modes', JSON.stringify([...this.selectedGameModes]));
	}

	loadGameModes() {
		let gameModes = new Set(JSON.parse(localStorage.getItem('game-modes')));
		if (gameModes.size == 0) {
			for (let modeName in GAME_MODE) gameModes.add(GAME_MODE[modeName]);
		}
		return gameModes;
	}
}

export const GAME_MODE = {
	GUESS_CAPITAL: 0,
	GUESS_COUNTRY: 1,
	GUESS_COUNTRY_BY_FLAG: 2,
};
