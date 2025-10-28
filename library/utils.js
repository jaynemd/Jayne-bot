/*
> Recode script give credits to›
Giddy Tennor(Trashcore)

📝 | Created By Trashcore
🖥️ | Base Ori By Trashcore 
📌 |Credits Putrazy Xd
📱 |Chat wa:254104245659
👑 |Github: Tennor-modz 
✉️ |Email: giddytennor@gmail.com
*/

const fs = require('fs');
const { exec } = require('child_process');

// write buffer to file
async function writeFile(filePath, buffer) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, buffer, (err) => (err ? reject(err) : resolve()));
  });
}

// convert buffer/file to WebP using ffmpeg
async function bufferToWebp(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -i "${inputPath}" -vcodec libwebp -filter:v "fps=15,scale=512:512:force_original_aspect_ratio=decrease" -lossless 0 -compression_level 6 -qscale 60 -preset default -an -vsync 0 -s 512:512 "${outputPath}" -y`;
    exec(cmd, { maxBuffer: 1024 * 500 }, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = { writeFile, bufferToWebp };