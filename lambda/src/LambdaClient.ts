import axios from "axios";
import Environment from "./Environment";
import BlogListReqParams from "./models/BlogListReqParams";
import MergerReqParams from "./models/MergerReqParams"

async function getBlogPosts(BlogListReqParams: BlogListReqParams) {
    return await axios.post(Environment.BLOG_LAMBDA_ENDPOINT, BlogListReqParams);
}

async function merge(MergerParams: MergerReqParams) {
    return await (await axios.post(Environment.MERGER_LAMBDA_ENDPOINT, MergerParams)).data;
}

export default {
    getBlogPosts,
    merge
}