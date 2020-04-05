# Monaco - Console logging redefined

Let's just face it. You're glued to the monitor for at least 8 hours a day of which 4 is for staring at the developer console. And yeah, you have to comment out console method calls you don't need at the moment in order to somehow navigate through this chaos. Oh, you also forgot to remove this temporary `console.debug('HERE')`, which floods user's console in production environment. Have you ever wondered if there is something that could release you from this pain? The answer is "Monaco".

`npm install --save @kluseg/monaco`

## What does it actually doing?

Monaco can be imported with ease!

```javascript
import Monaco from '@kluseg/monaco';
```

Monaco can make your logs look great again!

```javascript
const logger = new Monaco();
logger.success('Looking gooood!').send();
```

Monaco can take care of conditional logging!

###### Just switch Monaco's verbosity level and appropriate logs would be displayed.

```javascript
enum LogLevel {
  errorsOnly = 0,
  QAtests = 1,
  full = 2,
}

const logger = new Monaco(LogLevel.errorsOnly);
// This won't be shown because Monaco's verbosity is set to "errorsOnly" or simply 0
logger
  .success("Looking good!")
  .when(LogLevel.full)
  .send();

// This is displayed no matter what
logger
  .error("Fatal!")
  .send();

// Callback will be executed when provided function returns "true"
logger.when((verbosity: number) => {
  return verbosity >= LogLevel.QAtests && userDidSomething();
}, () => {
  logger
    .warn("User did something")
    .send();

  logger
    .notice("Notice me senpai!")
    // Show additional console.trace!
    .withTrace()
    .send();
})
```

Monaco can display additional group badge for added readability!

```javascript
const cartLogger = new Monaco(2, 'Cart');

// Displays badge [Cart | Info]
cartLogger.info('Cart module initialized').send();

// Displays badge [Cart @ src/modules/cart.ts | Warn]
cartLogger.warn('User cart is empty!').locatedAt('src/modules/cart.ts').send();

cartLogger
  // Creates new Monaco instance with given parameters
  .$create(3, 'Cart supervisor')
  // Displays badge [Cart @ src/modules/cart.ts | Error]
  .error('Unable to locate user cart!')
  .send();

// And again, and again...
const catalogLogger = new Monaco(1, 'Catalog');
```

Monaco is customizable.

```javascript
const cartLogger = new Monaco(2, 'Cart', {
  error: {
    background: 'red',
    foreground: 'rgb(0,0,33)',
  },
  success: {
    background: 'black',
    foreground: '#fff',
  },
});
```

And if you are lazy or integrating Monaco into existing project you can use it as a drop-in replacement for console (you get only colours though).

```javascript
Monaco.$patchConsole();
```

## Future plans

#### v1.0

1. Complete documentation.
2. Demo page.
3. Proper tests.
4. Node.js support.

#### v1.x

1. Multi-channel support (ability to save logs to file, send to slack channel, etc.).

## Thanks for checking it out!

Feel free to request new features! :)
