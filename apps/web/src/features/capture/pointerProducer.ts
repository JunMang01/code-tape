import type { CreatePointerProducer } from "./types";

/**
 * PointerProducer — captures pointer position over the editor surface.
 *
 * STUB. Real implementation belongs to issue `[P0] pointerProducer 实装`.
 *
 * 实装时需要：
 *   - 监听 deps.getHost() 上的 pointermove (throttle 30ms) → mouse-move
 *   - pointerdown → mouse-click（带 button 字段：0=left, 1=middle, 2=right）
 *   - 坐标必须归一化为相对宿主左上的像素 + 携带 containerWidth/Height（用于回放
 *     在不同尺寸窗口下还原相对位置）
 *   - pause 期间停止订阅（pointer 是 UI 层 transient 事件，不影响 stable state）
 *   - host 变化时重新订阅
 */
export const createPointerProducer: CreatePointerProducer = (_deps) => {
  return {
    start() {},
    pause() {},
    resume() {},
    stop() {},
    dispose() {},
  };
};
