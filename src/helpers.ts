export function blobToArrayBuffer(
  blob: Blob
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      resolve(reader.result);
    });
    reader.addEventListener("error", reject);
    reader.readAsArrayBuffer(blob);
  });
}

export function arrayBufferToBlob(buffer: ArrayBuffer, type: string): Blob {
  return new Blob([buffer], { type: type });
}

export function arrayBufferToAudioBuffer(
  buffer: ArrayBuffer
): Promise<AudioBuffer> {
  const audioContext = new AudioContext();
  return audioContext.decodeAudioData(buffer);
}
