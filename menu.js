const ask = require('@greggry/ask');

class Menu {
  options = [];
  activeScreen = this.options; // for submenus

  constructor(...optionsArgs) {
    optionsArgs.forEach(option => {
      this.options.push(option);
    });

    // ensure that only the last option in the array holds onEmpty=true
    this.onEmptyOptions = this.options.filter(opt => opt.onEmpty);
    if (this.onEmptyOptions.length > 1)
      throw new Error('The onEmpty property option has to be the last option');
    this.hasOnEmpty = this.onEmptyOptions.length === 1 ? true : false;

    this.askForOptions();
  }

  logOptions = (screen = this.activeScreen) => {
    screen.forEach((option, i) => {
      if (option.onEmpty) return;
      if (!option.onEmpty) console.log(`${i + 1}: ${option.text}`);
    });

    console.log('0: Exit');

    // print onEmpty
    if (this.hasOnEmpty) console.log(this.options[this.options.length - 1].onEmptyDescription);
  };

  askForOptions = async (depth = 0) => {
    if (depth >= 3) throw new Error('Max depth (3) exceeded in suboptions');

    const promptText = `Option${depth > 0 ? ' (leave empty to go back)' : ''}: `;

    this.logOptions();
    let chosen;

    while (!this.isInputValid(+chosen)) {
      chosen = (await ask.prompt(promptText)).trim();
      if (chosen === '0') return this.exit(); // stop asking for input

      if (chosen === '') {
        if (depth === 0 && this.hasOnEmpty)
          return this.runCallbackAndContinue(this.getLastOption());

        // going back
        if (depth > 0) {
          this.activeScreen = this.activeScreen.parent;
          return this.askForOptions(--depth);
        }

        console.log(`Invalid Option: "${chosen}"`);
      }
    }

    const optionObj = this.activeScreen[chosen - 1];

    if (!optionObj.callbackFn) {
      if (!optionObj.submenu) throw new Error(`No data for option "${chosen}" provided`);

      // make the parent in case the user goes back
      const parent = this.activeScreen;
      this.activeScreen = optionObj.submenu;
      this.activeScreen.parent = parent;

      return this.askForOptions(++depth);
    }

    this.runCallbackAndContinue(optionObj);
  };

  runCallbackAndContinue = optionObj => {
    optionObj.callbackFn();
    if (optionObj.doExitOnCallback) return this.exit();

    this.activeScreen = this.options; // start over
    this.askForOptions();
  };

  isInputValid = input => input > 0 && input <= this.activeScreen.length;
  getLastOption = () => this.options[this.options.length - 1];
  exit = () => ask.closePrompt();
}

module.exports = Menu;
