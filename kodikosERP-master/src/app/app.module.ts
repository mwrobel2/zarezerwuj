import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MaterialModule } from './material.module';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

// template driven approach - angular takes care of everything
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { StrstartowaComponent } from './components/strstartowa/strstartowa.component';
import { KontrahentCreateComponent } from './components/kontrahent-create/kontrahent-create.component';
import { GlowneMenuComponent } from './components/glowne-menu/glowne-menu.component';
import { KontrahentListComponent } from './components/kontrahent-list/kontrahent-list.component';
import { AuthInterceptor } from './services/auth-interceptor';
import { MenuComponent } from './components/menu/menu.component';
import { MagazynListComponent } from './components/magazyn-list/magazyn-list.component';
import { MagazynCreateComponent } from './components/magazyn-create/magazyn-create.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { DictionaryListComponent } from './components/dictionary-list/dictionary-list.component';
import { DictionaryCreateComponent } from './components/dictionary-create/dictionary-create.component';
import { AssortmentComponent } from './components/assortment/assortment.component';
import { AssortmentAddComponent } from './components/assortment-add/assortment-add.component';
import { ExportComponent } from './components/export/export.component';
import { ContractorsPipe } from './pipes/contractors.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { TowarFullNamePipe } from './pipes/towar-full-name.pipe';
import { ContractListComponent } from './components/contract-list/contract-list.component';
import { ContractCreateComponent } from './components/contract-create/contract-create.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    StrstartowaComponent,
    KontrahentCreateComponent,
    GlowneMenuComponent,
    KontrahentListComponent,
    MenuComponent,
    MagazynListComponent,
    MagazynCreateComponent,
    UserCreateComponent,
    UserListComponent,
    DictionaryListComponent,
    DictionaryCreateComponent,
    AssortmentComponent,
    AssortmentAddComponent,
    ExportComponent,
    ContractorsPipe,
    TowarFullNamePipe,
    ContractListComponent,
    ContractCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatPaginatorModule,
    NgxPaginationModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'lt-LT' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
