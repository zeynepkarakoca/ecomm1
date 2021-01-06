import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzMessageService} from 'ng-zorro-antd/message';
import { MainComponent } from './dashboard/main/main.component';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import { ColorComponent } from './dashboard/color/color.component';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzModalModule, NzModalService} from 'ng-zorro-antd/modal';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import { CategoryComponent } from './dashboard/category/category.component';
import { SubCategoriesComponent } from './dashboard/sub-categories/sub-categories.component';
import {NzSelectModule} from 'ng-zorro-antd/select';
import { ProductsComponent } from './dashboard/products/products.component';
import { StocksComponent } from './dashboard/stocks/stocks.component';
import {AuthInterceptorService} from './services/auth-interceptor.service';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {BgColorsOutline} from '@ant-design/icons-angular/icons';
import { HomeComponent } from './client/home/home.component';
import { ProductViewComponent } from './client/product-view/product-view.component';
import { FaqComponent } from './dashboard/faq/faq.component';
import { ShopsComponent } from './dashboard/shops/shops.component';


registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    MainComponent,
    ColorComponent,
    CategoryComponent,
    SubCategoriesComponent,
    ProductsComponent,
    StocksComponent,
    HomeComponent,
    ProductViewComponent,
    FaqComponent,
    ShopsComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        NzGridModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzLayoutModule,
        NzMenuModule,
        NzBreadCrumbModule,
        NzTableModule,
        NzTagModule,
        NzModalModule,
        NzCheckboxModule,
        NzSelectModule,
        NzIconModule.forRoot([
            BgColorsOutline
        ])
    ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, NzMessageService, NzModalService, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
