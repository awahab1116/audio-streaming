const fs = require("fs");
const express = require("express");

const app = express();

app.get("/audio", (req, res) => {
  res.writeHead(200, { "Content-Type": "audio/mp3" });

  function startStreaming() {
    const readStream = fs.createReadStream("audio.mp3");

    readStream.on("data", (chunk) => {
      // Check if the last chunk indicates the end of the file
      if (chunk.length < readStream.readableHighWaterMark) {
        // Close the current stream
        readStream.close();
        // Give the server some time to handle other requests
        setTimeout(startStreaming, 0);
      }
    });

    readStream.pipe(res);
  }

  if (fs.existsSync("audio.mp3")) {
    console.log("HERE");

    // Start the streaming
    startStreaming();
  } else {
    console.log("HERE1");
    res.end("end of stream");
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
