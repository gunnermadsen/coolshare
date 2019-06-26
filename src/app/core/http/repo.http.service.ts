import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpRepoService {
    constructor(private http: HttpClient) {}

    public getFolderContents(): Observable<any> {
        return this.http.get<any>('/api/repo')
    }
}