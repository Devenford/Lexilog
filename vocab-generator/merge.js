import fs from "fs/promises";

async function main() {
  const vocabulary = JSON.parse(
    await fs.readFile(
      "vocabulary.json",
      "utf8"
    )
  );

  const generated = JSON.parse(
    await fs.readFile(
      "output2.json",
      "utf8"
    )
  );

  const generatedMap = new Map(
    generated.map(item => [item.word, item])
  );

  const merged = vocabulary.map(word => {
    const extra = generatedMap.get(word.word);

    if (!extra) {
      return word;
    }

    return {
      ...word,
      definitions: extra.definitions,
      synonyms: extra.synonyms
    };
  });

  const missing = merged.filter(
    word => !word.definitions || !word.synonyms
  );

  if (missing.length > 0) {
    console.log(`Missing metadata for ${missing.length} word(s):`);

    for (const word of missing) {
      console.log(`- ${word.word}`);
    }
  }

  await fs.writeFile(
    "vocabulary_final.json",
    JSON.stringify(merged, null, 2)
  );

  console.log(`Merged ${merged.length} words.`);
  console.log(`Metadata added for ${merged.length - missing.length} words.`);
  console.log(`Missing metadata: ${missing.length}.`);
}

main().catch(console.error);