import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BuildpizzaComponent } from './buildpizza/buildpizza.component';
import { ShoppingcartComponent } from './shoppingcart/shoppingcart.component';
import { HomeComponent } from './home/home.component';
import { OrderpizzaComponent } from './orderpizza/orderpizza.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SumPipe } from './sum.pipe';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    BuildpizzaComponent,
    ShoppingcartComponent,
    HomeComponent,
    OrderpizzaComponent,
    NavbarComponent,
    SumPipe,
    OrderSuccessComponent,
    SignupComponent,
    LoginComponent,
    ProfileComponent,
    OrderHistoryComponent,
    AdminPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
