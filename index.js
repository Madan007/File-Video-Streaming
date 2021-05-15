// Blog Link    : https://dev.to/abdisalan_js/how-to-code-a-video-streaming-server-using-nodejs-2o0
// Youtube Link : https://www.youtube.com/watch?v=ZjBLbXUuyWg
// Github Link  : https://github.com/Abdisalan/blog-code-examples/tree/master/http-video-stream

const express = require("express");
const fs = require("fs");

const app = express();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const videoPath = "./bigbuck.mp4";
  const videoParams = fs.statSync("./bigbuck.mp4");
  const videoSize = videoParams.size;

  //Parse Range
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Range": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

app.listen(8000, () => {
  console.log("Listening on port 8000...");
});
