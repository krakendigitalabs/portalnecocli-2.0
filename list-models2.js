const fs = require("fs");

async function run() {
  try {
    const envFile = fs.readFileSync(".env.local", "utf8");
    const match = envFile.match(/GEMINI_API_KEY="([^"]+)"/);
    if (!match) return console.log("Key not found");
    const apiKey = match[1];

    let url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const allModels = [];

    while (url) {
      const response = await fetch(url);
      const data = await response.json();
      if (data.models) {
        allModels.push(...data.models);
      }
      if (data.nextPageToken) {
        url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageToken=${data.nextPageToken}`;
      } else {
        url = null;
      }
    }

    console.log("All Models:");
    allModels.forEach((m) => {
      if (
        m.supportedGenerationMethods &&
        m.supportedGenerationMethods.includes("generateContent")
      ) {
        console.log("- " + m.name);
      }
    });
  } catch (e) {
    console.log("ERROR:", e);
  }
}
run();
