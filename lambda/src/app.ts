import { APIGatewayEvent, APIGatewayProxyEvent, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import ContentfulClient from "./ContentfulClient";
import Params from "./models/Params";
import LambdaClient from "./LambdaClient";
import S3Writer from "./S3Writer";
import MergerParams from "./models/MergerReqParams";

exports.lambdaHandler = async (event: APIGatewayEvent, context: APIGatewayProxyEvent): Promise<APIGatewayProxyStructuredResultV2> => {
    let response = {
        'statusCode': 500,
        'body': "Something has gone wrong"
    }

    try {
        if (!event.body)
            throw new Error("Invalid Request");

        const body: Params = JSON.parse(event.body);

        let contentfulSiteData = await ContentfulClient.getSite(body.siteId);

        let mergerParams: MergerParams[] = [];

        for (const blog of contentfulSiteData.blogs) {
            const blogPosts = await LambdaClient.getBlogPosts({ query: { owner: contentfulSiteData.name, categories: blog.name }, operation: "list" });

            const jsonUrl = await S3Writer.saveBlogAsJson({ name: blog.name, data: blogPosts }, { bucket: contentfulSiteData.bucket, prefix: `${contentfulSiteData.name}/blogs` })
                .catch(() => { throw new Error("Unable to save") });

            mergerParams.push(
                {
                    dataSource: jsonUrl,
                    templateUrl: blog.templateUrl,
                    folderNameField: "title",
                    s3Options:
                    {
                        bucket: contentfulSiteData.bucket,
                        folder: `${contentfulSiteData.name}/blogs/${blog.name}`
                    }
                });
        }

    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
