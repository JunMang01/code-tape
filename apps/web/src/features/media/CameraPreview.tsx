import type { CameraPositionPayload } from "@/shared/recording-schema";

export type CameraPreviewProps = {
  stream: MediaStream | null;
  enabled: boolean;
  position: CameraPositionPayload;
  draggable?: boolean;
  onPositionChange?(position: CameraPositionPayload): void;
  size?: "sm" | "md" | "lg";
};

/**
 * CameraPreview — round picture-in-picture of the camera track.
 *
 * STUB. Real implementation belongs to issue
 * `[P0] mediaProducer 实装 + CameraPreview 拖拽`.
 *
 * 实装要点：
 *   - <video autoPlay muted playsInline ref={...} /> 绑定 stream（注意 srcObject）
 *   - position 单位是百分比 [0,1]（相对录制区域），呈现时换算 px
 *   - 拖拽：pointerdown→pointermove→pointerup，throttle onPositionChange 50ms
 *   - enabled=false 时 fade-out 但保留拖拽位置
 *   - size 三档对应 96/128/176 px
 *   - 始终带 1px border + shadow-elevation-2，避免与编辑器内容混淆
 */
export function CameraPreview(_props: CameraPreviewProps) {
  return (
    <div
      role="img"
      aria-label="Camera preview placeholder"
      className="pointer-events-none absolute right-6 bottom-6 h-32 w-32 overflow-hidden rounded-full border border-border bg-surface-raised shadow-elevation-2"
    >
      <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">
        camera stub
      </div>
    </div>
  );
}
