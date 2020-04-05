import { Verbosity, BackgroundColors, ForegroundColors } from './contracts/enums';
import { ColorConfig } from './contracts/config';
import { LogMachine } from './log-machine';

/**
 * Cache for single Monaco instance.
 *
 * @var {(Monaco | null)} _instance
 */
let _instance: Monaco | null = null;

/**
 * Class containing main logging methods.
 *
 * @export
 * @class Monaco
 */
export default class Monaco {
  /**
   * Creates an instance of Monaco.
   *
   * @param {Verbosity} [verbosity=0]
   * @param {(string | null)} [groupName=null]
   * @param {ColorConfig} [colors]
   * @memberof Monaco
   */
  constructor(
    protected verbosity: Verbosity = 0,
    protected groupName: string | null = null,
    protected colors?: ColorConfig
  ) {}

  /**
   * Creates fresh instance of Monaco.
   *
   * @param {Verbosity} [verbosity=0]
   * @param {(string | null)} [groupName=null]
   * @param {ColorConfig} [colors]
   * @returns {Monaco}
   * @memberof Monaco
   */
  $create(verbosity: Verbosity = 0, groupName: string | null = null, colors?: ColorConfig): Monaco {
    return new Monaco(verbosity, groupName, colors);
  }

  /**
   * Changes methods of console object to those from Monaco.
   *
   * @static
   * @param {(string | null)} [groupName=null]
   * @param {ColorConfig} [colors]
   * @returns {Monaco}
   * @memberof Monaco
   */
  static $patchConsole(groupName: string | null = null, colors?: ColorConfig): Monaco {
    // Single patch protection
    if (_instance) {
      return _instance;
    }
    _instance = new Monaco(0, groupName, colors);

    const $c = console;
    Object.keys($c).forEach((key: keyof Console) => {
      // For every console method check if Monaco has one
      if (typeof (_instance as any)[key] === 'undefined') {
        return;
      }

      // Backup original method
      $c[`_${key}`] = $c[key];

      // Overwrite method
      $c[key] = function (...msg: any[]) {
        return (_instance as any)[key](...msg).send();
      }.bind(_instance);
    });

    return _instance;
  }

  /**
   * Cleans console window.
   *
   * @returns {LogMachine}
   * @memberof Monaco
   */
  clear(): LogMachine {
    return this.makeMachine('clear', []);
  }

  /**
   * Debug color.
   *
   * @param {...any[]} msg
   * @returns {LogMachine}
   * @memberof Monaco
   */
  debug(...msg: any[]): LogMachine {
    return this.makeMachine('debug', msg);
  }

  /**
   * Error color.
   *
   * @param {...any[]} msg
   * @returns {LogMachine}
   * @memberof Monaco
   */
  error(...msg: any[]): LogMachine {
    return this.makeMachine('error', msg);
  }

  /**
   * Creates and opens console group.
   *
   * @param {string} [msg='Group']
   * @returns {LogMachine}
   * @memberof Monaco
   */
  group(msg: string = 'Group'): LogMachine {
    return this.makeMachine('group', [msg], 'info');
  }

  /**
   * Only creates console group.
   *
   * @param {string} [msg='Group']
   * @returns {LogMachine}
   * @memberof Monaco
   */
  groupCollapsed(msg: string = 'Group'): LogMachine {
    return this.makeMachine('groupCollapsed', [msg], 'info');
  }

  /**
   * Ends console groupping.
   *
   * @returns {LogMachine}
   * @memberof Monaco
   */
  groupEnd(): LogMachine {
    return this.makeMachine('groupEnd', []);
  }

  /**
   * Info color.
   *
   * @param {...any[]} msg
   * @returns {LogMachine}
   * @memberof Monaco
   */
  info(...msg: any[]): LogMachine {
    return this.makeMachine('info', msg);
  }

  /**
   * Alias for notice.
   *
   * @param {...any[]} msg
   * @returns {LogMachine}
   * @memberof Monaco
   */
  log(...msg: any[]): LogMachine {
    return this.notice(...msg);
  }

  /**
   * Notice color.
   *
   * @param {...any[]} msg
   * @returns {LogMachine}
   * @memberof Monaco
   */
  notice(...msg: any[]): LogMachine {
    return this.makeMachine('notice', msg);
  }

  /**
   * Success color.
   *
   * @param {...any[]} msg
   * @returns {LogMachine}
   * @memberof Monaco
   */
  success(...msg: any[]): LogMachine {
    return this.makeMachine('success', msg);
  }

  /**
   * Displays stack trace.
   *
   * @param {...any[]} msg
   * @returns {LogMachine}
   * @memberof Monaco
   */
  trace(...msg: any[]): LogMachine {
    return this.makeMachine('trace', msg, 'info');
  }

  /**
   * Warning color.
   *
   * @param {...any[]} msg
   * @returns {LogMachine}
   * @memberof Monaco
   */
  warn(...msg: any[]): LogMachine {
    return this.makeMachine('warn', msg);
  }

  /**
   * Sends logs only if every log in provided array can be displayed.
   *
   * @param {LogMachine[]} logs
   * @memberof Monaco
   */
  whenAll(logs: LogMachine[]): void {
    if (logs.every((machine: LogMachine) => machine.shouldBeDisplayed)) {
      logs.forEach((machine: LogMachine) => machine.send);
    }
  }

  /**
   * Allows displaying groups of logs when verbosity level or condition is satisfied.
   *
   * @param {(Verbosity | ((verbosity: Verbosity) => boolean))} verbosity
   * @param {() => void} callback
   * @memberof Monaco
   */
  when(verbosity: Verbosity | ((verbosity: Verbosity) => boolean), callback: () => void): void {
    if (typeof verbosity === 'function' ? verbosity(this.verbosity) : this.verbosity >= verbosity) {
      callback();
    }
  }

  /**
   * Locates color definition location. Color configuration is possible thanks to this method.
   *
   * @protected
   * @param {keyof ColorConfig} colorName
   * @returns {{ bg: string; fg: string }}
   * @memberof Monaco
   */
  protected getColor(colorName: keyof ColorConfig): { bg: string; fg: string } {
    let bg = '';
    let fg = '';

    if (this.colors && this.colors[colorName]) {
      // Color came from config
      bg = this.colors[colorName]!.background;
      fg = this.colors[colorName]!.foreground;
    } else {
      // Use default color
      bg = BackgroundColors[colorName];
      fg = ForegroundColors[colorName];
    }

    return {
      bg,
      fg,
    };
  }

  /**
   * Creates LogMachine based on input.
   *
   * @protected
   * @param {string} type
   * @param {any[]} message
   * @param {keyof ColorConfig} [color]
   * @returns {LogMachine}
   * @memberof Monaco
   */
  protected makeMachine(type: string, message: any[], color?: keyof ColorConfig): LogMachine {
    return new LogMachine(
      this.verbosity,
      this.groupName,
      this.getColor(color || (type as keyof ColorConfig)),
      this.getColor('primary'),
      type,
      message
    );
  }
}
