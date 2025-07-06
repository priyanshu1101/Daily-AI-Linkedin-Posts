const { getGeneratedPost } = require("../services/linkedinPost");

const generateLinkedInPost = async (req, res) => {
  try {
    const result = await getGeneratedPost();

    res.status(200).json({
      message: "LinkedIn post generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      error:
        "An error occurred while generating the LinkedIn post. Please try again later.",
    });
  }
};

module.exports = {
  generateLinkedInPost,
};
