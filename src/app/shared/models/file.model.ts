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
    IsEmpty?: boolean
    ShareData: any
    Meta: any
    CreatedOn: Date
    EditedOn: Date

}