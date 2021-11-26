# menu-js

menu-js is a simple menu tool for use it for CLI interfaces.

# How it works

The Menu class takes in an array of object. Each object represents an option.
The class executes the callbackFn argument, which should be attached to options. Only the callbacks that have no sub menus are executed.
The onEmpty property has to be added as the last item in the options array.

# Example

```js
const options = [
  {
    text: 'option 1',
    submenu: [
      {
        text: 'option 1a',
        callbackFn: () => console.log('ran option 1a')
      },
      {
        text: 'option 1b',
        callbackFn: () => console.log('ran option 1b')
        doExitOnCallback: true;
      },
    ],
  },
  {
    text: 'option 2',
    callbackFn: () => console.log('ran option 2')
  },
  {
    text: 'option 3',
    callbackFn: () => console.log('ran option 3')
    onEmpty: true, // run when '' passed
    onEmptyDescription: 'Leave empty to quit'
    doExitOnCallback: true;
  }

];

const menu = new Menu(...options);
```
