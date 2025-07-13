import axios from "axios";

const LINKEDIN_API_URL = "https://api.linkedin.com/v2/ugcPosts";

export async function createTextPost(text) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  try {
    const response = await axios.post(
      LINKEDIN_API_URL,
      {
        author: `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
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

export async function createImagePost({ text, base64Image, imageTitle, imageDescription }) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personId = process.env.LINKEDIN_PERSON_ID;
  const LINKEDIN_API_URL = "https://api.linkedin.com/v2/ugcPosts";
  const ASSETS_URL = "https://api.linkedin.com/v2/assets?action=registerUpload";

  if (!accessToken || !personId) {
    throw new Error("Missing ACCESS_TOKEN or LINKEDIN_PERSON_ID in env");
  }

  const registerResp = await axios.post(
    ASSETS_URL,
    {
      registerUploadRequest: {
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        owner: `urn:li:person:${personId}`,
        serviceRelationships: [
          { relationshipType: "OWNER", identifier: "urn:li:userGeneratedContent" }
        ]
      }
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
      }
    }
  );

  const uploadUrl = registerResp.data.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
  const asset = registerResp.data.value.asset;

  const imageBuffer = Buffer.from(base64Image, 'base64');
  await axios.put(uploadUrl, imageBuffer, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/octet-stream"
    }
  });

  const postResp = await axios.post(
    LINKEDIN_API_URL,
    {
      author: `urn:li:person:${personId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
          shareMediaCategory: "IMAGE",
          media: [
            {
              status: "READY",
              description: imageDescription ? { text: imageDescription } : undefined,
              title: imageTitle ? { text: imageTitle } : undefined,
              media: asset
            }
          ]
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
      }
    }
  );

  return postResp.data;
}