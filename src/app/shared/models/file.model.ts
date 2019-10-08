export interface IFile {

    Id: string
    Name: string
    Type: string
    Size: number
    Cwd: string
    Path: string
    ThumbnailPath: string
    IsFavorite: boolean
    IsShared: boolean
    ShareData: any
    MetaData: any
    CreatedOn: Date
    EditedOn: Date

}