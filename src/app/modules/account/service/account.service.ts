import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
    constructor(private http: HttpClient) {}

    public updateProfile(profile: any, id: string): Observable<any> {
        return this.http.put<any>(`/api/account/${id}`, profile);
    }

    public fetchAccountInfo(): Observable<any> {
        return this.http.get<any>(`/api/account`);
    }

    public updatePicture(picture: string): Observable<any> {
        return this.http.post<any>('/api/account/picture', { picture: picture });
    }
}