# menu-js

menu-js is a simple menu tool for use it for CLI interfaces.

# How it works

The Menu class takes in an array of object. Each object represents an option.
The class executes the callbackFn argument, which should be attached to options. Only the callbacks that have no sub menus are executed.

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
      },
    ],
  },
  {
    text: 'option 2',
    callbackFn: () => console.log('ran option 2')
  }
  option3,
];

const menu = new Menu(...options);
```
