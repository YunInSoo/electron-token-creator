require("dotenv").config();

const { ipcMain, app, BrowserWindow } = require("electron");
const path = require("path");
const crypto = require("crypto");

console.log(
  process.env.ENCRYPTION_KEY,
  process.env.ENV_ALGORITHM,
  process.env.IV_LENGTH
);

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const algorithm = process.env.ENV_ALGORITHM;
const IV_LENGTH = Number(process.env.IV_LENGTH);

// Initialize Vector (IV) 초기화 벡터이다
let iv = crypto.randomBytes(IV_LENGTH);

ipcMain.handle("getHash", async (event, arg) => {
  const info = arg;
  let result;

  const encrypted = encrypteFunction({
    textParts: info,
    algorithm,
    encryptionKey: ENCRYPTION_KEY,
    iv,
  });
  result = { token: encrypted, iv: iv };

  return result;
});

const encrypteFunction = ({ textParts, encryptionKey, algorithm, iv }) => {
  let cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(encryptionKey, "utf-8"),
    iv
  );

  let encrypted = cipher.update(textParts, "utf8", "base64");

  encrypted += cipher.final("base64");

  return encrypted;
};

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "src/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);
