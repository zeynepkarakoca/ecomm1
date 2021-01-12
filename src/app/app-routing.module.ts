import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MainComponent } from './dashboard/main/main.component';
import { ColorComponent } from './dashboard/color/color.component';
import { CategoryComponent } from './dashboard/category/category.component';
import { SubCategoriesComponent } from './dashboard/sub-categories/sub-categories.component';
import { ProductsComponent } from './dashboard/products/products.component';
import { StocksComponent } from './dashboard/stocks/stocks.component';
import { HomeComponent } from './client/home/home.component';
import { FaqComponent } from './dashboard/faq/faq.component';
import { ShopsComponent } from './dashboard/shops/shops.component';
import { ProductViewComponent } from './client/product-view/product-view.component';
import { ProductGridComponent } from './client/product-grid/product-grid.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'product/:id', component: ProductViewComponent },
  { path: 'products', component: ProductGridComponent },
  {
    path: 'auth', children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ]
  },
  {
    path: 'dashboard', children: [
      {
        path: 'main', component: MainComponent, children: [
          { path: 'color', component: ColorComponent, data: { breadcrumb: 'Colors' } },
          { path: 'category', component: CategoryComponent, data: { breadcrumb: 'Categories' } },
          { path: 'subcategory', component: SubCategoriesComponent, data: { breadcrumb: 'Subcategories' } },
          { path: 'products', component: ProductsComponent, data: { breadcrumb: 'Products' } },
          { path: 'stocks', component: StocksComponent, data: { breadcrumb: 'Stocks' } },
          { path: 'faq', component: FaqComponent, data: { breadcrumb: 'Faq' } },
          { path: 'shops', component: ShopsComponent, data: { breadcrumb: 'Shops' } }
        ]
      },
    ]
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
