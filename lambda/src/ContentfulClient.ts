import axios from "axios";
import Environment from "./Environment";
import ContentfulSite from "./models/ContentfulSite";
import * as queries from "./queries"

const fetch = async (query: string): Promise<string> => {
    return await axios.post(Environment.CONTENTFUL_GRAPHQL_ENDPOINT, query);
}

const getSite = async (id: string): Promise<ContentfulSite> => {
    let siteResp = fetch(queries.site(id));
    let blogsResp = fetch(queries.postContainers(id));

    await Promise.all([siteResp, blogsResp]);

    let siteJson = JSON.parse(await siteResp);
    let blogsJson = JSON.parse(await blogsResp);

    try {
        return {
            name: siteJson.data.site.siteName,
            bucket: siteJson.data.site.s3BucketName,
            blogs: (blogsJson.data.postContainerCollection.items as Array<any>).map(x => {
                return {
                    name: x.blogName as string,
                    templateUrl: x.templateUrl as string
                }
            })
        }

    } catch (error) {
        throw new Error("Unable to parse requested data");
    }
}

export default getSite;