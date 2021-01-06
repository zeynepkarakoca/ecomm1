import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null;

        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next.handle(clonedRequest).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
            }
        }, err => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    localStorage.clear();
                    this.router.navigateByUrl('/auth/login');
                }
            }
        }));
    }
}
