#!/usr/bin/env node

const { spawn } = require('child_process');
const { readdirSync } = require('fs');

const supportedFileExtensions = ['.mp4', '.mkv'];

const regexps = supportedFileExtensions.map(ext => new RegExp(`${ext}$`));

const filesToPlay = readdirSync(process.cwd())
  .filter(file => regexps.some(regexp => file.match(regexp)));

if (filesToPlay.length === 0) {
  process.exit();
}

let currentIndex;

if (process.argv[2]) {
  currentIndex = filesToPlay.indexOf(process.argv[2]);
  if (currentIndex === -1) {
    process.exit();
  }
} else {
  currentIndex = 0;
}


function playFile(file) {
  console.log(`Playing ${file}`);
  const player = spawn('omxplayer', ['-b', file], {
    stdio: 'inherit'
  });
  return player;
}

function onClose() {
  if (currentIndex + 1 < filesToPlay.length) {
    currentIndex++;
    console.log(`Playing next file: ${filesToPlay[currentIndex]}`);
    const player = playFile(filesToPlay[currentIndex]);
    player.on('close', onClose);
  } else {
    console.log('Done');
    process.exit();
  }
}

const player = playFile(filesToPlay[currentIndex]);
player.on('close', onClose);
