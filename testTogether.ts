import Together from "together-ai";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

async function test() {
  try {
    const res = await together.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: [
        { role: "user", content: "Tell me something about Lewis Hamilton" }
      ],
    });

    console.log("👉 Model Response:");
    console.log(res.choices?.[0]?.message?.content ?? "No content returned");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

test();

