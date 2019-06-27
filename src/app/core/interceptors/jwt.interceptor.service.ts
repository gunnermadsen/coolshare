import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { environment } from '@/../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class URLInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {

        const account = JSON.parse(localStorage.getItem('Account'));

        req = req.clone({ 
            url: `${environment.repo}${req.url}`,
            withCredentials: true // (account && account.Token) ? true : false
        });
        
        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => event)
        );
    }
}