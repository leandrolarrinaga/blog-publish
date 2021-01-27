import axios from "axios";
import Environment from "./Environment";
import { site } from "./queries"

const fetch = async (query: string): Promise<string> => {
    return await axios.post(Environment.CONTENTFUL_GRAPHQL_ENDPOINT, query);
}

