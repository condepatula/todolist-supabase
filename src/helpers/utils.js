import Resizer from "react-image-file-resizer";

export const resizeFile = (file, os) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      500,
      500,
      file.type.split("/")[1],
      100,
      os === "ios" ? 90 : 0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });
