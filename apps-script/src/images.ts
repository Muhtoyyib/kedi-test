// Drive image reads for the build pipeline — thin, GAS-only.

import {docImageBlob} from "./docs.ts";

const MAX_BYTES = 8 * 1024 * 1024; // Drive image size guard

export interface ImageResult {
  mimeType: string;
  modifiedTime: string;
  base64: string;
}

export function driveImage(fileId: string): ImageResult | {error: string} {
  try {
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    if (blob.getBytes().length > MAX_BYTES) return {error: `image ${fileId} is over 8 MB`};
    return {
      mimeType: blob.getContentType() ?? "image/jpeg",
      modifiedTime: file.getLastUpdated().toISOString(),
      base64: Utilities.base64Encode(blob.getBytes()),
    };
  } catch {
    return {error: `image ${fileId} can't be opened — check the Drive file ID and sharing`};
  }
}

export function docImage(docId: string, n: number): ImageResult | {error: string} {
  try {
    const blob = docImageBlob(docId, n);
    if (!blob) return {error: `image ${n + 1} not found in that Doc`};
    if (blob.getBytes().length > MAX_BYTES) return {error: `image ${n + 1} is over 8 MB`};
    return {mimeType: blob.getContentType() ?? "image/jpeg", modifiedTime: "", base64: Utilities.base64Encode(blob.getBytes())};
  } catch {
    return {error: `Doc ${docId} can't be opened — share it with the website's Google account`};
  }
}
