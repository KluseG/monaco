import Monaco from '../index';
import { LogMachine } from '../log-machine';
import { ForegroundColors, BackgroundColors } from '../contracts/enums';

test('Returns correct LogMachine instance', () => {
  const logger = new Monaco();
  expect(logger.error('')).toStrictEqual(
    new LogMachine(
      0,
      null,
      { fg: ForegroundColors.error, bg: BackgroundColors.error },
      { fg: ForegroundColors.primary, bg: BackgroundColors.primary },
      'error',
      ['']
    )
  );

  expect(logger.info('')).toStrictEqual(
    new LogMachine(
      0,
      null,
      { fg: ForegroundColors.info, bg: BackgroundColors.info },
      { fg: ForegroundColors.primary, bg: BackgroundColors.primary },
      'info',
      ['']
    )
  );

  expect(logger.notice('')).toStrictEqual(
    new LogMachine(
      0,
      null,
      { fg: ForegroundColors.notice, bg: BackgroundColors.notice },
      { fg: ForegroundColors.primary, bg: BackgroundColors.primary },
      'notice',
      ['']
    )
  );

  expect(logger.success('')).toStrictEqual(
    new LogMachine(
      0,
      null,
      { fg: ForegroundColors.success, bg: BackgroundColors.success },
      { fg: ForegroundColors.primary, bg: BackgroundColors.primary },
      'success',
      ['']
    )
  );

  expect(logger.warn('')).toStrictEqual(
    new LogMachine(
      0,
      null,
      { fg: ForegroundColors.warn, bg: BackgroundColors.warn },
      { fg: ForegroundColors.primary, bg: BackgroundColors.primary },
      'warn',
      ['']
    )
  );
});
