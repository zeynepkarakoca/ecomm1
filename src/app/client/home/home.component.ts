import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    DisplayProducts: any[];

    constructor(private api: ApiService) {
    }

    getProducts = () => {
        this.api.GetStocks()
            .then((res: any) => this.DisplayProducts = res.data);
    };

    ngOnInit(): void {
        this.getProducts();
        history.pushState(null, 'Home', window.location.toString());
    }

}
