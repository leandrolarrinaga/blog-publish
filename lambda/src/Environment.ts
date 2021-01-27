class Environment {
    readonly CONTENTFUL_GRAPHQL_ENDPOINT: String;

    private constructor() {
        if (!process.env.CONTENTFUL_GRAPHQL_ENDPOINT) {
            throw new Error("Lambda Environment is not configured");
        }

        this.CONTENTFUL_GRAPHQL_ENDPOINT = process.env.CONTENTFUL_GRAPHQL_ENDPOINT;
    }

    private static _instance: Environment;

    public static get instance(): Environment {
        if (!Environment._instance)
            Environment._instance = new Environment();

        return Environment._instance;
    }
}

export default Environment.instance;