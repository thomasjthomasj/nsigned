export const uploadFile = (
  file: File,
  url: string,
  onProgress: (percent: number) => void = () => {},
): Promise<void> =>
  new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();

    req.upload.addEventListener("progress", (e: ProgressEvent) => {
      if (e.lengthComputable)
        onProgress(Math.round((e.loaded / e.total) * 100));
    });

    req.addEventListener("load", () => {
      if (req.status === 200) {
        resolve();
      } else {
        reject(
          new Error(`Got status ${req.status} when attempting to upload file`),
        );
      }
    });

    req.addEventListener("error", () => {
      reject(new Error("Could not upload file"));
    });

    req.open("PUT", url);
    req.setRequestHeader("Content-Type", file.type);
    req.send(file);
  });
