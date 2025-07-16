// index.js (or your main Node.js file)

import OpenAI from 'openai'; // Use "import OpenAI from 'openai';" if using ES modules or "const OpenAI = require('openai');" if using CommonJS modules.
// import dotenv from 'dotenv'; // Import dotenv to load environment variables.

// dotenv.config(); // Load environment variables from .env file.

const openrouter_api_key = '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'; // Replace with your actual OpenRouter API key or use environment variables.

if (!openrouter_api_key) {
  console.error("OpenRouter API key not found. Please set OPENROUTER_API_KEY in your .env file or directly in the code."); //
  process.exit(1); // Exit if API key is missing.
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1", // OpenRouter API endpoint.
  apiKey: openrouter_api_key, // Your OpenRouter API key.
});

async function main() {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free", // Specify the DeepSeek model on OpenRouter.
      messages: [{ role: "user", content: "Tell me a story about a dragon." }], // Example message.
    });

    console.log(chatCompletion.choices[0].message.content); // Access the generated text.
  } catch (error) {
    console.error("Error communicating with OpenRouter:", error); // Log any errors that occur during the API call.
  }
}

main();
