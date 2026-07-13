import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-flash-lite-latest";
const BATCH_SIZE = 10;
const MAX_RETRIES = 5;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateBatch(fullPrompt) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: fullPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      return JSON.parse(response.text);
    } catch (err) {
      const retryable =
        err.status === 503 ||
        err.status === 429 ||
        err.status === 500;

      if (!retryable || attempt === MAX_RETRIES) {
        throw err;
      }

      const wait = attempt * 5000;

      console.log(
        `Attempt ${attempt}/${MAX_RETRIES} failed (${err.status}). Retrying in ${wait / 1000}s...`
      );

      await sleep(wait);
    }
  }
}

async function main() {
  const prompt = await fs.readFile("prompt.txt", "utf8");

  const words = (await fs.readFile("words.txt", "utf8"))
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  let results = [];
  try {
    const existing = await fs.readFile("output.json", "utf8");
    results = JSON.parse(existing);
    console.log(`Loaded ${results.length} existing words.`);
  } catch {
    console.log("No existing output.json found. Starting fresh.");
  }
  const failed = [];

  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    const batch = words.slice(i, i + BATCH_SIZE);

    console.log(
      `Processing words ${i + 1}-${Math.min(
        i + BATCH_SIZE,
        words.length
      )}...`
    );

    const fullPrompt =
      prompt +
      "\n\nGenerate objects for these words:\n\n" +
      batch.join("\n");

    try {
      const batchResult = await generateBatch(fullPrompt);

      results.push(...batchResult);

      await fs.writeFile(
        "output.json",
        JSON.stringify(results, null, 2)
      );

      console.log(`✓ Saved ${results.length} words`);

      await sleep(2000);

    } catch (err) {
      console.error(`❌ Failed batch ${i + 1}-${i + batch.length}`);
      console.error(err.message);

      failed.push(...batch);

      await fs.writeFile(
        "failed_words.txt",
        failed.join("\n")
      );

      await fs.writeFile(
        "output_partial.json",
        JSON.stringify(results, null, 2)
      );

      console.log("Skipping batch...");
    }
  }

  console.log("\n=========================");
  console.log(`Finished!`);
  console.log(`Generated: ${results.length} words`);
  console.log(`Failed: ${failed.length} words`);

  if (failed.length) {
    console.log("Failed words saved to failed_words.txt");
  }
}

main();