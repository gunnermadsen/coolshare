import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import * as mime from 'mime';
import { saveAs } from 'file-saver'
import { map, catchError } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class HttpRepoService {
    constructor(private http: HttpClient) {}

    public getFolderContents(directory: { path: string }): Observable<any> {
        
        return this.http.post<any>('/api/repo', directory)
    }

    public uploadFile(file: File, path: string, index: number, userId: string): Observable<HttpEvent<{}> | any> {

        const formData = new FormData()

        formData.append(index.toString(), file)
        formData.append('userId', userId)
        formData.append('path', path)

        // const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data').set('Accept', '*/*')

        return this.http.post<any>('/api/repo/upload', formData, { reportProgress: true, observe: 'events' })
    }

    public createFolder(payload: any): Observable<any> {
        return this.http.post<any>('/api/repo/create', payload);
    }

    public delete(payload: any): Observable<any> {
        return this.http.post<any>('/api/repo/delete', payload)
    }

    public download(payload: any): Observable<any> {

        let query = this.generateQueryUri(payload);

        const headers = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Accept'       : '*/*'
        });

        const mimeType = mime.getType(payload.name);

        return this.http.get(`/api/repo/download?${query}`, { headers: headers, responseType: 'blob' as 'json' })
    }

    public verifyLink(linkDetails: any): Observable<any> {
        return this.http.post<any>('/api/repo/verify', linkDetails);
    }

    private generateQueryUri(payload: { id: string, path: string, name: string }): string {

        let uri = `resource=${payload.name}&path=${payload.path}&id=${payload.id}`;
        uri = uri.replace(/ /g, '%20').replace(/\//g, '%2F');

        return uri;

    }
}
