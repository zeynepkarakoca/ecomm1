import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private message: NzMessageService) { }


  addToCart = (stock) => {
    return new Promise(() => {
      let cart: any[] = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

      if (cart.length <= 0) {
        cart.push({ amount: 1, stock: stock });
      } else {
        if (cart.find(x => x.stock.id == stock.id)) {
          cart[cart.indexOf(cart.find(x => x.stock.id == stock.id))].amount++;
        } else {
          cart.push({ amount: 1, stock: stock });
        }
      }
      this.message.success("Product added to cart");
      localStorage.setItem('cart', JSON.stringify(cart));
    })
  };

  removeFromCart = (stock) => {
    return new Promise(() => {
      let cart: any[] = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
      localStorage.setItem('cart', JSON.stringify(cart.filter(x => x.stock.id != stock.stock.id)));
    })
  };

  getCartItems = () => {
    let CartTotalPrice = 0;
    let cart: any[] = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    cart.forEach(item => CartTotalPrice += (parseInt(item.stock.product_id.price) * item.amount))
    return new Promise(() => {
      return { cart: cart, totalPrice: CartTotalPrice };
    });
  }

}
