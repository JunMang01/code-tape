import JSZip from "jszip";
import {
  validateRecordingPackageV1,
  migrateRecordingPackage,
} from "@/shared/recording-schema";
import type {
  PackageLoader,
  PackageLoaderInput,
  PackageLoadResult,
  RecordingPackageV1,
  RecordingRepository,
} from "@/shared/recording-schema";

export type PackageLoaderOptions = {
  repository: RecordingRepository;
};

/**
 * PackageLoader — uniform read path used by ReplayPage and RecordingLibraryPage.
 *
 * Two entry points:
 *  - kind="indexeddb"  → delegate to repository.load (which already validates).
 *  - kind="file"       → unzip the supplied Blob, parse manifest+events+snapshots,
 *                         run schema validation & migrations, attach media blob.
 */
export function createPackageLoader(options: PackageLoaderOptions): PackageLoader {
  return {
    async load(input: PackageLoaderInput): Promise<PackageLoadResult> {
      if (input.kind === "indexeddb") {
        return options.repository.load(input.recordingId);
      }
      return loadFromZip(input.zip);
    },
  };
}

async function loadFromZip(zip: Blob): Promise<PackageLoadResult> {
  let archive: JSZip;
  try {
    archive = await JSZip.loadAsync(zip);
  } catch (err) {
    return {
      ok: false,
      error: { code: "invalid-manifest", message: `zip load failed: ${(err as Error).message}` },
    };
  }
  const manifestFile = archive.file("manifest.json");
  const eventsFile = archive.file("events.json");
  const snapshotsFile = archive.file("snapshots.json");
  const metaFile = archive.file("meta.json");
  if (!manifestFile || !eventsFile || !snapshotsFile || !metaFile) {
    return {
      ok: false,
      error: { code: "incomplete-package", packageId: "(unknown)" },
    };
  }

  const [manifestRaw, eventsRaw, snapshotsRaw, metaRaw] = await Promise.all([
    manifestFile.async("string"),
    eventsFile.async("string"),
    snapshotsFile.async("string"),
    metaFile.async("string"),
  ]);

  let parsed: RecordingPackageV1;
  try {
    parsed = {
      manifest: JSON.parse(manifestRaw),
      meta: JSON.parse(metaRaw),
      events: JSON.parse(eventsRaw),
      snapshots: JSON.parse(snapshotsRaw),
      media: null,
      schemaVersion: JSON.parse(manifestRaw).schemaVersion,
    } as RecordingPackageV1;
  } catch (err) {
    return {
      ok: false,
      error: { code: "invalid-manifest", message: `json parse failed: ${(err as Error).message}` },
    };
  }

  const migrated = migrateRecordingPackage(parsed);
  if (!migrated.ok) return { ok: false, error: migrated.error };

  const valid = validateRecordingPackageV1(migrated.package);
  if (!valid.ok) {
    return {
      ok: false,
      error: {
        code: "invalid-manifest",
        message: valid.errors.map((e) => `${e.path}: ${e.message}`).join("; "),
      },
    };
  }

  return { ok: true, package: migrated.package, warnings: [] };
}
