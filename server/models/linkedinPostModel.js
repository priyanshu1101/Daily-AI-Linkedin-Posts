import mongoose from "mongoose";
import _ from "lodash";
const linkedinPostSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    postdate: {
        type: Date,
        default: Date.now,
    },
    urn: {
        type: String,
        required: true,
        unique: true,
    },
},
{
    timestamps: true,
});

linkedinPostSchema.pre("save", function (next) {
    if (this.isModified("content")) {
        this.content = _.unescape(this.content);
    }
    next();
})

const LinkedinPost = mongoose.model("LinkedinPost", linkedinPostSchema);

const getTopicsUsed = async () => {
    const posts = await LinkedinPost.find({}, "topic").lean();
    return posts.map(post => post.topic);
}

const createPost = async (postData) => {
    const post = new LinkedinPost(postData);
    await post.save();
    return post;
}

export {
    getTopicsUsed,
    createPost,
};