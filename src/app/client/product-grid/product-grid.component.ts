import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})
export class ProductGridComponent implements OnInit {

  CartItems: any[];
  CartTotalPrice = 0;

  Categories = [];

  constructor(private api: ApiService, private message: NzMessageService) { }

  LastSelectedProduct: any;
  ModalProductOrderDetails: any;

  allStocks: any;

  TopStocks: any;

  selectedCategory = 0;

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

  getCategories = () => {
    this.api.GetCategories().then((res: any) => this.Categories = res.data);
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

  getAllStocks = (category?) => {
    this.allStocks = null;
    this.selectedCategory = category ? category : 0;
    this.api.GetStocks(category).then((res: any) => {
      this.allStocks = res.data;
    });
  }

  getTopStocks = () => {
    this.api.GetTopStocks().then((res: any) => this.TopStocks = res.data);
  }

  ngOnInit(): void {
    this.getAllStocks();
    this.getCategories();
    this.getCartItems();
    this.getTopStocks();
  }
}
