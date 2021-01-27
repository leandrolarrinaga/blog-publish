export const site = (id: string): string => `
    {
    site(id: "${id}") {
      siteName,
      s3BucketName
    }
  }`
    ;
export const postContainers = (siteId: string) => `
{
  postContainerCollection(where:{siteId:{sys:{id:"${siteId}"}}}){
    items{
      blogName
    }
  }
}
`;
