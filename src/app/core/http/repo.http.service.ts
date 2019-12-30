import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import * as mime from 'mime';
import { saveAs } from 'file-saver'
import { map, catchError } from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';


@Injectable({ providedIn: 'root' })
export class HttpRepoService {
    constructor(private http: HttpClient) {}

    public getFolderContents(path: string, id: string): Observable<any> {

        let query = `id=${id}&path=${path}`.replace(/ /g, '%20').replace(/\//g, '%2F')
        
        return this.http.get<any>(`/api/repo?${query}`)
    }

    public uploadFile(file: File, path: string, index: number, userId: string): Observable<HttpEvent<{}> | any> {

        const formData = new FormData()

        formData.append(index.toString(), file)
        formData.append('userId', userId)
        formData.append('path', path)

        // const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data').set('Accept', '*/*')
        // const request = new Request('/api/repo/upload', { body: formData, method: 'POST', reportProgress: true, observe: 'events' })

        return this.http.post<any>('/api/repo/upload', formData, { reportProgress: true, observe: 'events' })
        // return fromFetch(request)
    }

    public createFolder(payload: any): Observable<any> {
        return this.http.post<any>('/api/repo/create', payload)
    }

    public delete(payload: { id: string, path: string, entities: { name: string, path: string, type: string}[]}): Observable<any> {
        return this.http.post<any>('/api/repo/delete', payload)
    }

    public download(payload: { userId: string, path: string, name: string, entityType: string }): Observable<any> {

        // let query = this.generateQueryUri(payload);
        const headers = new HttpHeaders({ 'Content-Type' : 'application/json', 'Accept' : '*/*'});
        const params = new HttpParams()
            .set('resource', payload.name)
            .set('path', payload.path)
            .set('id', payload.userId)
            .set('type', payload.entityType)

        const options = { 
            headers: headers, 
            params: params, 
            responseType: 'blob' as 'json'
        }

        return this.http.get(`/api/repo/download`, options)
    }

    public verifyLink(linkDetails: any): Observable<any> {
        return this.http.post<any>('/api/repo/verify', linkDetails)
    }
    
    public updateFavoriteState(payload: any): Observable<any> {
        
        const entity = { 
            fileId: payload.entity.id, 
            state: payload.entity.changes.IsFavorite, 
            userId: payload.userId 
        }

        return this.http.post<any>('/api/repo/favorite', entity)
    }

    public renameEntity(payload: any): Observable<any> {
        return this.http.post<any>('/api/repo/rename', payload)
    }
    
    private generateQueryUri(payload: { userId: string, path: string, name: string }): string {

        let uri = `resource=${payload.name}&path=${payload.path}&id=${payload.userId}`
        uri = uri.replace(/ /g, '%20').replace(/\//g, '%2F')

        return uri

    }
}
