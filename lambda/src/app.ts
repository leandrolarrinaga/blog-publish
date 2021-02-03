import { APIGatewayEvent, APIGatewayProxyEvent, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import ContentfulClient from "./ContentfulClient";
import Params from "./models/Params";
import LambdaClient from "./LambdaClient";
import S3Writer from "./S3Writer";
import MergerParams from "./models/MergerReqParams";
import ContentfulSite, { blogs } from "./models/ContentfulSite";
import Environment from "./Environment";

exports.lambdaHandler = async (event: APIGatewayEvent, context: APIGatewayProxyEvent): Promise<APIGatewayProxyStructuredResultV2> => {
    let response = {
        'statusCode': 500,
        'body': "Something has gone wrong"
    }

    try {
        if (!event.body)
            throw new Error("Invalid Request");

        const body: Params = JSON.parse(event.body);

        const contentfulSiteData = await ContentfulClient.getSite(body.siteId);

        for (const blog of contentfulSiteData.blogs) {
            await merge(blog, contentfulSiteData);
        }

        response.body = `Blogs for contentful site with id ${body.siteId} have been built`;
        response.statusCode = 200;

    } catch (err) {
        console.log(err);

        if (isDevEnvironment()) {
            response.body = err.message;
        }
    }

    return response
}

async function merge(blog: blogs, site: ContentfulSite) {
    const mergeParams = await buildMergerParams(blog, site);

    if (!mergeParams)
        return

    await LambdaClient.merge(mergeParams);
}

async function buildMergerParams(blog: blogs, site: ContentfulSite): Promise<MergerParams | null> {
    const blogPosts: any[] = (await LambdaClient.getBlogPosts({ query: { owner: site.name, categories: blog.name }, operation: "list" })).data;

    if (!blogPosts.length)
        return null;

    const jsonUrl = await S3Writer.saveBlogAsJson({ name: blog.name, data: blogPosts }, { bucket: site.bucket, prefix: `${site.name}/blogs` })
        .catch((error) => { throw new Error("Unable to save: " + error.message) });

    return mapMergerParams(jsonUrl, blog, { name: site.name, bucket: site.bucket })
}

function mapMergerParams(dataUrl: string, blog: { name: string, templateUrl: string }, site: { name: string, bucket: string }): MergerParams {
    return {
        dataSource: dataUrl,
        templateUrl: blog.templateUrl,
        folderNameField: "title",
        s3Options:
        {
            bucket: site.bucket,
            folder: `${site.name}/blogs/${blog.name}`
        }
    }
}

function isDevEnvironment() {
    return Environment.ENVIRONMENT === "DEV" ? true : false;
}