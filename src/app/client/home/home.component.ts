import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  DisplayProducts: any[];
  Products: any[];
  Categories: any[];

  TopStocks: any[];

  CartItems: any[];
  CartTotalPrice = 0;

  SingleProductLoading: boolean = false;

  LastSelectedProduct: any;
  ModalProductOrderDetails: any;


  constructor(private api: ApiService, private message: NzMessageService) {
  }

  getCategories = () => {
    this.api.GetCategories().then((res: any) => this.Categories = res.data)
  }

  getProducts = () => {
    this.api.GetTrendingStocks()
      .then((res: any) => {
        this.DisplayProducts = res.data;
        this.Products = res.data;
      });
  };

  getProductsByGender = (gender = 1) => {
    this.DisplayProducts = this.Products;
    if (gender == -1) return;
    this.DisplayProducts = this.DisplayProducts.filter(x => x.product_id.gender == gender);
  }

  getTopStocks = () => {
    this.api.GetTopStocks().then((res: any) => this.TopStocks = res.data);
  }

  addToCart = (stock, amount = 1) => {
    let cart: any[] = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

    if (cart.length <= 0) {
      cart.push({ amount: amount, stock: stock });
    } else {
      if (cart.find(x => x.stock.id == stock.id)) {
        amount
          ? cart[cart.indexOf(cart.find(x => x.stock.id == stock.id))].amount += amount
          : cart[cart.indexOf(cart.find(x => x.stock.id == stock.id))].amount++;
      } else {
        cart.push({ amount: amount, stock: stock });
      }
    }
    this.message.success("Product added to cart");
    localStorage.setItem('cart', JSON.stringify(cart));
    this.getCartItems();
  };

  removeFromCart = (stock) => {
    let cart: any[] = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    localStorage.setItem('cart', JSON.stringify(cart.filter(x => x.stock.id != stock.stock.id)));
    this.getCartItems();
  };

  getCartItems = () => {
    this.CartTotalPrice = 0;
    let cart: any[] = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    cart.forEach(item => this.CartTotalPrice += (parseInt(item.stock.product_id.price) * item.amount))
    this.CartItems = cart;
  }

  setModalProduct = (id) => {
    this.api.GetStockById(id)
      .then((res: any) => {
        this.LastSelectedProduct = res.data;
        this.ModalProductOrderDetails = { amount: 1, stock: res.data };
      })
      .catch(error => console.error(error && error.error.message));
  }

  setModalOrderDetails = (isNext) => {
    isNext
      ? this.ModalProductOrderDetails.amount++
      : ((this.ModalProductOrderDetails.amount - 1) >= 1) ? this.ModalProductOrderDetails.amount-- : this.ModalProductOrderDetails = 1;
  };

  onOrder = () => {
    this.LastSelectedProduct = null;
    this.ModalProductOrderDetails = null;
  }

  onModalClose = () => {
    this.LastSelectedProduct = null;
    this.ModalProductOrderDetails = null;
  };

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
    this.getTopStocks();
    this.getCartItems();
    history.pushState(null, 'Home', window.location.toString());
  }

}
