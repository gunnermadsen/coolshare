import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpRepoService {
    constructor(private http: HttpClient) {}

    public getFolderContents(directory: { id: string, path: string}): Observable<any> {
        // const params = new HttpParams().set('id', account.id).set('path', account.path);
        
        return this.http.post<any>('/api/repo', { directory })
    }
}