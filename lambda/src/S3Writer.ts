import AWS from "aws-sdk";

async function S3Save(putObjectReq: AWS.S3.PutObjectRequest): Promise<string> {
    return new Promise((resolve, reject) => {
        const s3: AWS.S3 = new AWS.S3();

        s3.putObject(putObjectReq, (err: Error, data: AWS.S3.PutObjectOutput) => {
            if (err)
                reject(err);
            else
                resolve(`Successfully saved object to ${putObjectReq.Bucket}/${putObjectReq.Key}`);
        });
    });
}

async function saveBlogAsJson(blog: { name: string, data: object }, S3Opts: { bucket: string, prefix: string }): Promise<string> {
    const putObjReq: AWS.S3.PutObjectRequest = {
        Bucket: S3Opts.bucket,
        Key: `${S3Opts.prefix}/${blog.name}.json`,
        Body: JSON.stringify(blog.data)
    }

    return S3Save(putObjReq);
}

export default { saveBlogAsJson }