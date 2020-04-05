import Monaco from '../index';
import { LogMachine } from '../log-machine';
import { ForegroundColors, BackgroundColors } from '../contracts/enums';

/**
 * error
 * info
 * notice
 * success
 * warn
 */

test('Returns correct LogMachine instance', () => {
  const logger = new Monaco();
  expect(logger.error('')).toStrictEqual(
    new LogMachine(0, null, { fg: ForegroundColors.error, bg: BackgroundColors.error }, 'error', [''])
  );

  expect(logger.info('')).toStrictEqual(
    new LogMachine(0, null, { fg: ForegroundColors.info, bg: BackgroundColors.info }, 'info', [''])
  );

  expect(logger.notice('')).toStrictEqual(
    new LogMachine(0, null, { fg: ForegroundColors.notice, bg: BackgroundColors.notice }, 'notice', [''])
  );

  expect(logger.success('')).toStrictEqual(
    new LogMachine(0, null, { fg: ForegroundColors.success, bg: BackgroundColors.success }, 'success', [''])
  );

  expect(logger.warn('')).toStrictEqual(
    new LogMachine(0, null, { fg: ForegroundColors.warn, bg: BackgroundColors.warn }, 'warn', [''])
  );
});
