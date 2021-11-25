const ask = require('@greggry/ask');

class Menu {
  options = [];
  activeScreen = this.options; // for submenus

  constructor(...optionsArgs) {
    optionsArgs.forEach(option => {
      this.options.push(option);
    });

    this.askForOptions();
  }

  logOptions = (screen = this.activeScreen) => {
    screen.forEach((option, i) => {
      console.log(`${i + 1}: ${option.text}`);
    });
  };

  askForOptions = async (depth = 0) => {
    if (depth >= 3) throw new Error('Max depth (3) exceeded in suboptions');

    const promptText = `Option ${depth > 0 ? '(leave empty to go back)' : ''}: `;

    this.logOptions();
    console.log('0: Exit');
    let chosen = await ask.prompt(promptText);

    if (+chosen === 0) return this.exit(); // stop asking for input

    while (!this.isInputValid(+chosen)) {
      if (`${chosen}`.trim() === '' && depth > 0) {
        // go back
        this.activeScreen = this.activeScreen.parent;
        return this.askForOptions(--depth);
      }

      console.log(`Invalid Option: "${chosen}"`);
      chosen = await ask.prompt(promptText);
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

    optionObj.callbackFn();
    if (optionObj.doExitOnCallback) return this.exit();

    this.activeScreen = this.options; // start over
    this.askForOptions();
  };

  isInputValid = input => input > 0 && input <= this.activeScreen.length;
  exit = () => ask.closePrompt();
}

module.exports = Menu;
