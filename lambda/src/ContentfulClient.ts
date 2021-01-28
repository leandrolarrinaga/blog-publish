import axios from "axios";
import Environment from "./Environment";
import ContentfulSite from "./models/ContentfulSite";
import queries from "./queries"

async function fetch(query: string): Promise<string> {
    return await (await axios.post(Environment.CONTENTFUL_GRAPHQL_ENDPOINT, query)).data;
}

async function getSite(id: string): Promise<ContentfulSite> {
    let siteResp = fetch(queries.site(id));
    let blogsResp = fetch(queries.postContainers(id));

    await Promise.all([siteResp, blogsResp]);

    let siteJson = JSON.parse(await siteResp);
    let blogsJson = JSON.parse(await blogsResp);

    return mapSite(siteJson, blogsJson);
}

function mapSite(siteObj: any, blogObj: any): ContentfulSite {
    try {
        return {
            name: siteObj.data.site.siteName,
            bucket: siteObj.data.site.s3BucketName,
            blogs: (blogObj.data.postContainerCollection.items as Array<any>).map(x => {
                return {
                    name: x.blogName as string,
                    templateUrl: x.templateUrl as string
                }
            })
        };

    } catch (error) {
        throw new Error("Unable to parse requested data");
    }
}

export default {
    getSite
}