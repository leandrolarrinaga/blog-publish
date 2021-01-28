class Environment {
    readonly CONTENTFUL_GRAPHQL_ENDPOINT: string;
    readonly MERGER_LAMBDA_ENDPOINT: string;
    readonly BLOG_LAMBDA_ENDPOINT: string;
    readonly REGION: string;

    private constructor() {
        if (!process.env.CONTENTFUL_GRAPHQL_ENDPOINT ||
            !process.env.BLOGS_LAMBDA ||
            !process.env.MERGER_LAMBDA ||
            !process.env.REGION
        ) {
            throw new Error("Lambda Environment is not configured");
        }

        this.CONTENTFUL_GRAPHQL_ENDPOINT = process.env.CONTENTFUL_GRAPHQL_ENDPOINT;
        this.MERGER_LAMBDA_ENDPOINT = process.env.MERGER_LAMBDA;
        this.BLOG_LAMBDA_ENDPOINT = process.env.BLOGS_LAMBDA;
        this.REGION = process.env.REGION;
    }

    private static _instance: Environment;

    public static get instance(): Environment {
        if (!Environment._instance)
            Environment._instance = new Environment();

        return Environment._instance;
    }
}

export default Environment.instance;