export default interface ContentfulSite {
    name: string,
    bucket: string,
    blogs: {
        name: string,
        templateUrl: string
    }[]
}