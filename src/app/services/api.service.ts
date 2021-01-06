import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {UserRegistration} from '../models/user-registration.model';


@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) {
    }

    /* Auth */
    Register = (registrationData: UserRegistration) => {
        return this.http.post(`${environment.baseUrl}/auth/register`, registrationData).toPromise();
    };
    Login = (Credentials) => {
        return this.http.post(`${environment.baseUrl}/auth/login`, Credentials).toPromise();
    };
    Logout = () => {
        return this.http.post(`${environment.baseUrl}/auth/logout`, null).toPromise();
    };
    GetSessionUser = () => {
        return this.http.get(`${environment.baseUrl}/auth/user`).toPromise();
    };

    /* Color */
    GetColors = (page = null) => {
        let queryString = '';
        if( page ){
            queryString = `?page=${page}`;
        }
        return this.http.get(`${environment.baseUrl}/color`).toPromise();
    };
    GetColorById = (id) => {
        return this.http.get(`${environment.baseUrl}/color/${id}`).toPromise();
    };
    DeleteColor = (id) => {
        return this.http.delete(`${environment.baseUrl}/color/${id}`).toPromise();
    };
    StoreColor = (ColorData) => {
        return this.http.post(`${environment.baseUrl}/color`, ColorData).toPromise();
    };
    UpdateColor = (id, ColorData) => {
        return this.http.post(`${environment.baseUrl}/color/${id}`, ColorData).toPromise();
    };

    /* Categories */
    GetCategories = () => {
        return this.http.get(`${environment.baseUrl}/category`).toPromise();
    };
    GetCategoryById = (id) => {
        return this.http.get(`${environment.baseUrl}/category/${id}`).toPromise();
    };
    StoreCategory = (CategoryData) => {
        return this.http.post(`${environment.baseUrl}/category`, CategoryData, {
            headers: {'enctype': 'multipart/form-data'}
        }).toPromise();
    };
    UpdateCategory = (id, CategoryData) => {
        return this.http.post(`${environment.baseUrl}/category/${id}`, CategoryData).toPromise();
    };
    DeleteCategory = (id) => {
        return this.http.delete(`${environment.baseUrl}/category/${id}`).toPromise();
    };

    /* Sub-Categories */
    GetSubCategories = (filters = null) => {
        return this.http.get(`${environment.baseUrl}/sub-category/${filters != null ? `?filter[category_id]=${filters}` : ''}`).toPromise();
    };
    GetSubCategoryById = (id) => {
        return this.http.get(`${environment.baseUrl}/sub-category/${id}`).toPromise();
    };
    StoreSubCategory = (SubCategoryData) => {
        return this.http.post(`${environment.baseUrl}/sub-category`, SubCategoryData, {
            headers: {'enctype': 'multipart/form-data'}
        }).toPromise();
    };
    UpdateSubCategory = (id, SubCategoryData) => {
        return this.http.post(`${environment.baseUrl}/sub-category/${id}`, SubCategoryData).toPromise();
    };
    DeleteSubCategory = (id) => {
        return this.http.delete(`${environment.baseUrl}/sub-category/${id}`).toPromise();
    };

    /* Products */
    GetProducts = () => {
        return this.http.get(`${environment.baseUrl}/product`).toPromise();
    };
    GetProductById = (id) => {
        return this.http.get(`${environment.baseUrl}/product/${id}`).toPromise();
    };
    StoreProduct = (ProductData) => {
        return this.http.post(`${environment.baseUrl}/product`, ProductData).toPromise();
    };
    UpdateProduct = (id, ProductData) => {
        return this.http.post(`${environment.baseUrl}/product/${id}`, ProductData).toPromise();
    };
    DeleteProduct = (id) => {
        return this.http.delete(`${environment.baseUrl}/product/${id}`).toPromise();
    };
    /* Stocks */
    GetStocks = () => {
        return this.http.get(`${environment.baseUrl}/stock`).toPromise();
    };
    GetStockById = (id) => {
        return this.http.get(`${environment.baseUrl}/stock/${id}`).toPromise();
    };
    StoreStock = (StockData) => {
        return this.http.post(`${environment.baseUrl}/stock`, StockData).toPromise();
    };
    UpdateStock = (id, StockData) => {
        return this.http.post(`${environment.baseUrl}/stock/${id}`, StockData).toPromise();
    };
    DeleteStock = (id) => {
        return this.http.delete(`${environment.baseUrl}/stock/${id}`).toPromise();
    };
}
