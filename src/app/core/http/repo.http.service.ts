import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class HttpRepoService {
    constructor(private http: HttpClient) {}

    public getFolderContents(directory: { path: string }): Observable<any> {
        
        return this.http.post<any>('/api/repo', directory)
    }

    public uploadFile(file: File, path: string, index: number): Observable<HttpEvent<{}> | any> {
        const formData = new FormData()

        formData.append(index.toString(), file)
        formData.append('path', path)

        return this.http.post<any>('/api/repo/upload', formData, { reportProgress: true, observe: 'events' })
    }

    public createFolder(payload: any): Observable<any> {
        return this.http.post<any>('/api/repo/create', payload);
    }

    public delete(payload: any): Observable<any> {
        return this.http.post<any>('/api/repo/delete', payload)
    }

    public download(payload: any): Observable<HttpResponse<Blob>> {

        // const type = mime.contentType(payload.name);
        // const headers = new HttpHeaders().set('Content-Type', 'application/octet-stream');

        return this.http.post<HttpResponse<Blob>>('/api/repo/download', payload, {
            headers: new HttpHeaders({
                'Content-Type': 'application/octet-stream',
            }), responseType: 'blob' as 'json'
        })
    }

    public verifyLink(linkDetails: any): Observable<any> {
        return this.http.post<any>('/api/repo/verify', linkDetails);
    }
}
