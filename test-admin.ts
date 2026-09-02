import { cert } from "firebase-admin/app";
import * as fs from "fs";

const envStr = fs.readFileSync(".env.local", "utf8");
const envLines = envStr.split("\n");
const envConfig: Record<string, string> = {};
envLines.forEach(line => {
    if (line.includes("=")) {
        const idx = line.indexOf("=");
        envConfig[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
    }
});

const projectId = envConfig["FIREBASE_ADMIN_PROJECT_ID"];
const clientEmail = envConfig["FIREBASE_ADMIN_CLIENT_EMAIL"];
const rawPrivateKey = envConfig["FIREBASE_ADMIN_PRIVATE_KEY"];

console.log("Project ID:", projectId);
console.log("Client Email:", clientEmail);
console.log("Raw Private Key length:", rawPrivateKey?.length);
console.log("Raw Private Key starts with:", rawPrivateKey?.substring(0, 30));
console.log("Raw Private Key ends with:", rawPrivateKey?.substring(rawPrivateKey.length - 30));
console.log("Includes literal \\n?", rawPrivateKey?.includes("\\n"));
console.log("Includes real newlines?", rawPrivateKey?.includes("\n"));

let privateKey = rawPrivateKey;
if (privateKey) {
    // Reemplazar explícitamente literales \n por saltos reales
    privateKey = privateKey.replace(/\\n/g, "\n");
    // Quitar comillas si dotenv no las quitó (dotenv parse() sí suele quitarlas)
    privateKey = privateKey.replace(/^"|"$/g, "");
    privateKey = privateKey.trim();
}

console.log("Normalized Key starts with:", privateKey?.substring(0, 30));
console.log("Normalized Key includes real newlines?", privateKey?.includes("\n"));

try {
    const credential = cert({
        projectId,
        clientEmail,
        privateKey
    });
    console.log("✅ CERT CREATION SUCCESS!");
    
    // Y probemos obtener un token para ver si la firma es válida
    credential.getAccessToken().then(token => {
        console.log("✅ ACCESS TOKEN FETCH SUCCESS!", token.access_token.substring(0, 10) + "...");
    }).catch(err => {
        console.error("❌ ACCESS TOKEN FETCH FAILED:", err.message);
    });

} catch (err) {
    console.error("❌ CERT CREATION FAILED:", err);
}
