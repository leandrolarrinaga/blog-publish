export default interface BlogListReqParams {
    query: {
        owner: string,
        categories: string
    },
    operation: string
}