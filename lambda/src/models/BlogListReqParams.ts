export default interface BlogListReqParams {
    query: {
        owner: string,
        categories: string
    },
    readonly operation: "list"
}