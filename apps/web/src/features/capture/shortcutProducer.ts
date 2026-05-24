import type { CreateShortcutProducer } from "./types";

/**
 * ShortcutProducer — emits shortcut events for the badge overlay.
 *
 * STUB. Real implementation belongs to issue `[P0] shortcutProducer 实装 + Badge label 映射`.
 *
 * 实装时需要：
 *   - 监听 deps.getRoot() 上的 keydown，过滤含 modifier (Cmd/Ctrl/Alt/Shift) 的组合键
 *   - 已知 Monaco command 映射到友好 label（Save, Format, Comment, Undo, Redo, Run）；
 *     resolveLabel hook 允许业务层覆盖映射
 *   - 未知组合键使用 keys 数组本身作 label（不带 command 字段）
 *   - 触发频率限制：同一组合键 500ms 内重复按下只 emit 一次
 *   - pause 期间停止订阅（避免回放层错认快捷键）
 */
export const createShortcutProducer: CreateShortcutProducer = (_deps) => {
  return {
    start() {},
    pause() {},
    resume() {},
    stop() {},
    dispose() {},
  };
};
