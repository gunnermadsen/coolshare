import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HttpRepoService {
    constructor(private http: HttpClient) {}

    public getFolderContents(directory: { id: string, path: string}): Observable<any> {
        // const params = new HttpParams().set('id', account.id).set('path', account.path);
        
        return this.http.post<any>('/api/repo', directory)
    }

    public uploadFile(payload: any): Observable<HttpEvent<{}>> { //file: File, index: number, path: string, id: string
        const formData = new FormData();
        //formData.append(index.toString(), file)
        Object.values(payload.files).forEach((file: File, index: number) => formData.append(index.toString(), file));

        formData.append('id', payload.id);
        formData.append('path', payload.path);

        return this.http.post<any>('/api/repo/upload', formData, { reportProgress: true, observe: 'events' })
    }

    public createFolder(payload: any): Observable<any> {
        return this.http.post<any>('/api/repo/create', payload);
    }
}
