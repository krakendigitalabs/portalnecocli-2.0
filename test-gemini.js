const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const apiKey = "AQ.Ab8RN6I9swlX8Xybi8FrLFOG52p3T5DeliNDCUryQufZhAFWcg";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Di hola mundo");
    console.log("SUCCESS:", result.response.text());
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

test();
