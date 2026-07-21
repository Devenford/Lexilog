import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-flash-lite-latest";
const BATCH_SIZE = 20;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function generateBatch(prompt) {
  let attempt = 1;

  while (true) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
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

      if (!retryable) {
        throw err;
      }

      const wait = Math.min(
        attempt * 5000,
        60000
      );

      console.log(
        `Attempt ${attempt} failed (${err.status}). Retrying in ${wait / 1000}s...`
      );

      attempt++;

      await sleep(wait);
    }
  }
}


async function main() {

  const prompt = await fs.readFile(
    "prompt2.txt",
    "utf8"
  );


  const words = JSON.parse(
    await fs.readFile(
      "vocabulary.json",
      "utf8"
    )
  );


  let results = [];

  try {

    results = JSON.parse(
      await fs.readFile(
        "output2.json",
        "utf8"
      )
    );

    console.log(
      `Loaded ${results.length} existing results`
    );

  } catch {

    console.log(
      "No output2.json found. Starting fresh."
    );

  }


  // Only count fully generated words as completed
  const processedWords = new Set(
    results
      .filter(
        word => word.definitions && word.synonyms
      )
      .map(
        word => word.word
      )
  );


  const remaining = words.filter(
    word => !processedWords.has(word.word)
  );


  console.log(
    `Already completed: ${processedWords.size}`
  );

  console.log(
    `Remaining words: ${remaining.length}`
  );


  for (
    let i = 0;
    i < remaining.length;
    i += BATCH_SIZE
  ) {

    const batch = remaining.slice(
      i,
      i + BATCH_SIZE
    );


    console.log(
      `Processing ${i + 1}-${i + batch.length}`
    );


    const input = batch.map(word => ({
      word: word.word,
      paragraphs: word.paragraphs
    }));


    const fullPrompt =
      prompt +
      "\n\nINPUT:\n" +
      JSON.stringify(input, null, 2);


    try {

      const generated =
        await generateBatch(fullPrompt);


      const existingWords = new Set(
        results.map(word => word.word)
      );


      const newResults = generated.filter(
        word => !existingWords.has(word.word)
      );


      results.push(...newResults);


      await fs.writeFile(
        "output2.json",
        JSON.stringify(results, null, 2)
      );


      console.log(
        `Saved ${results.length} words`
      );


      await sleep(2000);


    } catch (err) {

      console.error(
        `❌ Failed batch ${i + 1}-${i + batch.length}`
      );

      console.error(
        err.message
      );

    }
  }


  console.log("\n====================");
  console.log("Finished!");
  console.log(
    `Generated: ${results.length} words`
  );
}


main();