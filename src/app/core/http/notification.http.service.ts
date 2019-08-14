import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpNotificationService {
    constructor(private http: HttpClient) {}

    public getNotifications(id: string): Observable<any> {
        return this.http.get<any>(`/api/notifications?id=${id}`)
    }
    public createNotification(payload: any): Observable<any> {
        return this.http.post<any>(`/api/notifications/create`, payload)
    }

    public deleteAllNotifications(id: string): Observable<any> {
        return this.http.delete<any>(`/api/notifications/deleteall/${id}`);
    }

    public setNotificationViewState(id: string, state: boolean): Observable<any> {
        return this.http.put<any>(`/api/notifications/${id}`, { state: state }) ;
    }
}