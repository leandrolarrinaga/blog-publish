export default interface MergerParams {
    dataSource: string,
    templateUrl: string,
    s3Options: {
        bucket: string,
        folder: string
    },
    folderNameField: string
}