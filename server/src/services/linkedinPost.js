const { callDeepSeek } = require("../utils/Deepseek");
const { createTextPost } = require("../utils/LinkedinAPI");
const { callOpenAI } = require("../utils/OpenAI");


const getGeneratedPost = async () => {
  const prompt = process.env.PROMPT.trim();
  const response = await callOpenAI(prompt);
  if(!response || response.length === 0) {
    throw new Error("Failed to generate post content");
  }
  const post = await createTextPost(response, process.env.LINKEDIN_ACCESS_TOKEN);
  return post;
}; 

module.exports = {
  getGeneratedPost,
};
