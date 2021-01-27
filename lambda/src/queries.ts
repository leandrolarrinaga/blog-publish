export const site = (id: string) => `
    {
    site(id: "${id}") {
      siteName,
      s3BucketName
    }
  }`
;