const { createPost } = require("../../models/linkedinPostModel.js");
const { callDeepSeek } = require("../utils/Deepseek");
const { default: generateGeminiImage } = require("../utils/geminiImageGeneration.js");
const { getNewTopic } = require("../utils/getNewTopic");
const { createTextPost, createImagePost } = require("../utils/LinkedinAPI");
const { callOpenAI } = require("../utils/OpenAI");
const dayjs = require("dayjs");

const getGeneratedPost = async () => {
  const START_DATE = process.env.START_DATE;
  const today = dayjs();
  const startDate = dayjs(START_DATE);
  const dayNumber = today.diff(startDate, "day") + 1;
  const prompt = process.env.PROMPT.trim();
  const newTopic = await getNewTopic();
  const fullPrompt = `Generate a LinkedIn post ABOUT ${newTopic} EXCLUSIVELY. Follow these rules: ${prompt}`;
  const response = await callDeepSeek(fullPrompt);
  const postImagePrompt = process.env.POST_IMAGE_PROMPT + response;
  const imagePrompt = await callDeepSeek(postImagePrompt);
  const image = await generateGeminiImage(imagePrompt);
  if (!response || response.length === 0) {
    throw new Error("Failed to generate post content");
  }

  const finalLinkedInPost = `👋 Daily Dose of AI #Day${dayNumber} \n✨ Topic : ${newTopic}\n\n${response}`;

  let post;

  if (image) {
    post = await createImagePost({
      text: finalLinkedInPost,
      base64Image: image,
      imageTitle: `Daily AI Post - ${newTopic}`,
      imageDescription: `Image for the LinkedIn post about ${newTopic}`,
    });
  }
  else{
    post = await createTextPost(
      finalLinkedInPost
    );
  }
  
  if (!post || !post.id) {
    throw new Error("Failed to create LinkedIn post");
  }

  const linkedinPostData = {
    topic: newTopic,
    content: finalLinkedInPost,
    postdate: new Date(),
    urn: post?.id,
  }
  await createPost(linkedinPostData);
  return post;
};

module.exports = {
  getGeneratedPost,
};
