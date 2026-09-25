# Image Compressor

A responsive, privacy-first static website that compresses JPG, PNG, and WebP images in the visitor's browser. No images are uploaded to a server.

## Run locally

From this folder, start any static file server pointed at `dist/`. For example, with Node.js installed:

```sh
npx serve dist
```

Then open the displayed local address in a browser.

## Notes

- Select multiple images, set a quality, and choose an output type before uploading.
- JPG and WebP use the chosen quality. PNG is re-rendered losslessly, so it may not become smaller.
- “Download all” creates a ZIP entirely in the browser; individual downloads are also available.
