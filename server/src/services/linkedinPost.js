const { callDeepSeek } = require("../utils/Deepseek");
const { getNewTopic } = require("../utils/getNewTopic");
const { createTextPost } = require("../utils/LinkedinAPI");
const { callOpenAI } = require("../utils/OpenAI");


const getGeneratedPost = async () => {
  const prompt = process.env.PROMPT.trim();
  const newTopic = getNewTopic();
  const fullPrompt = `Generate a LinkedIn post ABOUT ${newTopic} EXCLUSIVELY. Follow these rules: ${prompt}`;
  const response = await callDeepSeek(fullPrompt);
  if(!response || response.length === 0) {
    throw new Error("Failed to generate post content");
  }
  const post = await createTextPost(response, process.env.LINKEDIN_ACCESS_TOKEN);
  return post;
}; 

module.exports = {
  getGeneratedPost,
};
