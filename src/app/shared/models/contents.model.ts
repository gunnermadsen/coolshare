export interface IContents {
    id: string;
    name: string;
    type: string;
    size: string;
    creationDate: string;
    cwd: string;
    absPath: string;
    path: string;
    branch: string[];
    parent: string;
    index?: string;
}