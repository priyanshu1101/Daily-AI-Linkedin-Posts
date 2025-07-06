import axios from "axios";

const LINKEDIN_API_URL = "https://api.linkedin.com/v2/ugcPosts";

export async function createTextPost(text, accessToken) {
  try {
    const response = await axios.post(
      LINKEDIN_API_URL,
      {
        author: "urn:li:person:c_rm1hm3x-",
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: text,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating LinkedIn post:", error.response?.data || error.message);
    throw error;
  }
}
