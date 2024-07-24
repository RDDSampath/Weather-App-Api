let OpenAI = require("openai");

let openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

async function generateWeatherText(weatherData) {
  const response = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: `Generate a weather report for the following data: ${JSON.stringify(weatherData)}`,
    max_tokens: 150,
    temperature: 1,
  });
  return response; 
}
module.exports = generateWeatherText;
