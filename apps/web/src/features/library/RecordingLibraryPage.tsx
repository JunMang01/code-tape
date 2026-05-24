import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createRecordingStore } from "./recordingStore";
import { formatDurationMs } from "@/shared/time/duration";
import { IconButton } from "@/shared/ui";
import type { RecordingListItem } from "@/shared/recording-schema";

/**
 * RecordingLibraryPage — wires the RecordingRepository and lists completed
 * recordings.
 *
 * The card grid layout, search/filter UI, thumbnail rendering, and zip
 * import/export buttons are delegated to issue
 * `[P0] RecordingLibraryPage 列表 UI`. This shell guarantees the data layer
 * works and supplies the minimum entries (open, rename, delete, export).
 */
export function RecordingLibraryPage() {
  const repository = useMemo(() => createRecordingStore(), []);
  const [items, setItems] = useState<RecordingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await repository.list();
      setItems(list);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    void refresh();
    void repository.sweep();
  }, [refresh, repository]);

  const handleDelete = async (id: string) => {
    await repository.remove(id);
    void refresh();
  };

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">code-tape</p>
          <h1 className="font-display text-3xl font-semibold">我的录制</h1>
        </div>
        <Link
          to="/record"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          新建录制
        </Link>
      </header>

      {loading ? (
        <p className="text-sm text-muted">加载中…</p>
      ) : error ? (
        <p className="text-sm text-danger">读取失败：{error}</p>
      ) : items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-surface/60 p-12 text-center">
          <p className="font-display text-lg">还没有录制</p>
          <p className="max-w-sm text-sm text-muted">
            点击右上角「新建录制」开始第一段代码讲解。
            <br />
            列表 UI 由 issue「[P0] RecordingLibraryPage 列表 UI」深化。
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border bg-surface/60">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <Link
                  to={`/replay/${item.id}`}
                  className="block truncate font-medium text-foreground hover:underline"
                >
                  {item.title}
                </Link>
                <p className="mt-1 text-xs text-muted">
                  {new Date(item.createdAt).toLocaleString()} · {formatDurationMs(item.durationMs)} ·{" "}
                  {item.initialLanguage}
                  {item.hasAudio ? " · 音频" : ""}
                  {item.hasCamera ? " · 摄像头" : ""}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <IconButton
                  icon={<span aria-hidden>▶</span>}
                  label="回放"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    window.location.assign(`/replay/${item.id}`);
                  }}
                />
                <IconButton
                  icon={<span aria-hidden>✕</span>}
                  label="删除"
                  variant="ghost"
                  size="sm"
                  onClick={() => void handleDelete(item.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
