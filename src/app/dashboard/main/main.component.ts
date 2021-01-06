import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    constructor(private router: Router) {
        router.events.subscribe((val) => {
            history.pushState(null, window.location.toString());
        });
    }

    handleLogout = () => {
      localStorage.clear();
      this.router.navigateByUrl('/auth/login');
    };

    ngOnInit(): void {
        if (!localStorage.getItem('access_token')) {
            this.router.navigateByUrl('/auth/login');
        }
    }

}
