import AWS from "aws-sdk";
import Environment from "./Environment";

async function S3Save(putObjectReq: AWS.S3.PutObjectRequest): Promise<string> {
    return new Promise((resolve, reject) => {
        const s3: AWS.S3 = new AWS.S3();

        s3.putObject(putObjectReq, (err: Error, data: AWS.S3.PutObjectOutput) => {
            if (err)
                reject(err);
            else
                resolve(buildUrl(putObjectReq.Bucket, putObjectReq.Key));
        });
    });
}

async function saveBlogAsJson(blog: { name: string, data: object }, S3Opts: { bucket: string, prefix: string }): Promise<string> {
    const putObjReq: AWS.S3.PutObjectRequest = {
        Bucket: S3Opts.bucket,
        Key: `${S3Opts.prefix}/${slugify(blog.name)}.json`,
        Body: JSON.stringify(blog.data)
    }

    return S3Save(putObjReq);
}

function buildUrl(bucket: string, key: string) {
    return `https://${bucket}.s3.${Environment.REGION}.amazonaws.com/${key}`;
}

function slugify(string: string): string {
    if (typeof string != "string")
        throw new Error("Unable to slugify. Not a string")

    const a: string = 'àáäâãåăæąçćčđďèéěėëêęǵḧìíïîįłḿǹńňñòóöôœøṕŕřßśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;';
    const b: string = 'aaaaaaaaacccddeeeeeeeghiiiiilmnnnnooooooprrssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');

    return string.toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

export default { saveBlogAsJson }