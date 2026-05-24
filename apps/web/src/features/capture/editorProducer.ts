import type { CreateEditorProducer, EditorProducerHandle } from "./types";

/**
 * EditorProducer — bridges Monaco editor events into the EventBus.
 *
 * STUB. Real implementation belongs to issue `[P0] editorProducer 实装`.
 *
 * 实装时需要：
 *   - 订阅 Monaco editor.onDidChangeModelContent（debounce 200ms → content-change，
 *     带 contentHash 用于去重；force flush on pause/stop/run/snapshot）
 *   - editor.onDidChangeCursorSelection → selection-change
 *   - editor.onDidScrollChange (throttle 100ms) → editor-scroll
 *   - setLanguage 调 monaco.editor.setModelLanguage + emit language-change
 *   - takeSnapshot 读出 model.getValue() + 当前 cursor/selection/scroll/fontSize/theme
 *   - pause() 时停止订阅；resume() 时 emit resume-baseline 与 stored snapshot 比对，
 *     若 diff 则强制 emit content-change 同步当前 buffer
 */
export const createEditorProducer: CreateEditorProducer = (_deps): EditorProducerHandle => {
  return {
    start() {},
    pause() {},
    resume() {},
    stop() {},
    dispose() {},
    flushPending() {},
    async takeSnapshot() {
      return null;
    },
    setLanguage(_next) {},
  };
};
