const fs = require("fs");

async function run() {
  try {
    const envFile = fs.readFileSync(".env.local", "utf8");
    const match = envFile.match(/GEMINI_API_KEY="([^"]+)"/);
    if (!match) return console.log("Key not found");
    const apiKey = match[1];

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("ERROR:", e);
  }
}
run();
