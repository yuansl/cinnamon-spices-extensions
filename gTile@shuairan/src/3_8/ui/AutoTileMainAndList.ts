import { App } from "../extension";
import { addSignals, getUsableScreenArea, move_resize_window, reset_window, SignalOverload } from "../utils";
import { ActionButton } from "./ActionButton";

@addSignals
export class AutoTileMainAndList extends ActionButton<"resize-done"> {
  classname: string;
  private app: App;

  constructor(app: App) {
    super('action-main-list', "auto_tile_0-symbolic");
    this.app = app;
    this.classname = 'action-main-list';
    this.connect(
      'button-press-event',
      this._onButtonPress
    );
  }

  protected override _onButtonPress = () => {
    if (!this.app.FocusMetaWindow) return false;

    reset_window(this.app.FocusMetaWindow);

    let monitor = this.app.Grid.monitor;
    let [screenX, screenY, screenWidth, screenHeight] = getUsableScreenArea(monitor);
    let windows = this.app.GetNotFocusedWindowsOfMonitor(monitor);

    move_resize_window(this.app.FocusMetaWindow, screenX, screenY, screenWidth / 2, screenHeight);

    let winHeight = screenHeight / windows.length;
    let countWin = 0;

    for (let windowIdx in windows) {
      let metaWindow = windows[windowIdx];

      let newOffset = countWin * winHeight;

      reset_window(metaWindow);

      move_resize_window(metaWindow, screenX + screenWidth / 2, screenY + newOffset, screenWidth / 2, winHeight);
      countWin++;
    }

    this.emit('resize-done');
    return false;
  }
};