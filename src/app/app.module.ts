import { CommonModule, DatePipe } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { JwtInterceptor, JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpErrorInterceptor } from 'src/error-interceptor';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AdminMenuComponent } from './menu/admin-menu/admin-menu.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { RoleManagerComponent } from './user/role-manager/role-manager.component';
import { RouterModule } from '@angular/router';
import { AccessContolComponent } from './user/access-contol/access-contol.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    DashboardComponent,
    LoginComponent,
    AdminMenuComponent,
    SideBarComponent,
    UserProfileComponent,
    RoleManagerComponent,
    AccessContolComponent,
  ],
  exports: [ UserProfileComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    StoreModule.forRoot({}, {}),
    RouterModule.forRoot([
      {path : 'home', component : DashboardComponent},
      {path : 'user-profile', component :UserProfileComponent},
      {path : 'role-manager', component :RoleManagerComponent},
      {path : 'access-control', component :AccessContolComponent}
    ]),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    DatePipe,
    JwtHelperService,
   // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
   // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
