import type {
  CreateRuntimeProducer,
  RuntimeProducerHandle,
} from "./types";
import type { IframeRunResult } from "@/shared/recording-schema";

/**
 * RuntimeProducer — emits run-start / run-output / run-error.
 *
 * STUB. Real implementation belongs to issue `[P0] runtimeProducer 实装`.
 *
 * 实装时需要：
 *   - trigger(input):
 *     1. 生成 runId（用 shared/util/ids.generateId("run")）
 *     2. emit run-start { language, runtime: "iframe", runId }
 *     3. await compiler.compile(source, language)
 *        - 失败：emit run-error { phase: "transpile", message, stack, previewHtml: null }
 *     4. 成功后 await runtime.run({ runId, compiledCode, timeoutMs: 5000 })
 *        - status === "complete"：emit run-output（stdout/stderr/previewHtml）
 *        - status === "error"  ：emit run-error { phase: "runtime", ... }
 *        - status === "timeout"：emit run-error { phase: "runtime", message: "timeout" }
 *   - pause() 期间禁用 trigger（按钮在 UI 层应禁用，producer 双重防御）
 */
export const createRuntimeProducer: CreateRuntimeProducer = (_deps): RuntimeProducerHandle => {
  return {
    start() {},
    pause() {},
    resume() {},
    stop() {},
    dispose() {},
    async trigger(): Promise<IframeRunResult> {
      return {
        runId: "stub",
        status: "complete",
        previewHtml: null,
        stdout: [],
        stderr: [],
      };
    },
  };
};
