export default interface ContentfulSite {
    name: string,
    bucket: string,
    blogs: blogs[]
}

export interface blogs {
    name: string,
    templateUrl: string
}