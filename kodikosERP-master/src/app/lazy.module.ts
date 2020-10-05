import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './components/administration/administration.component';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OfferComponent } from './components/offer/offer.component';
import { OfferAddComponent } from './components/offer-add/offer-add.component';
import { OrderComponent } from './components/order/order.component';
import { OrderAddComponent } from './components/order-add/order-add.component';
import { InvoiceAddComponent } from './components/invoice-add/invoice-add.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { FormsadminComponent } from './components/formsadmin/formsadmin.component';
import { KontrahenciComponent } from './components/formsfields/kontrahenci/kontrahenci.component';
import { LogsListComponent } from './components/logs-list/logs-list.component';
import { CurrencyComponent } from './components/currency/currency.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectAddComponent } from './components/project-add/project-add.component';
import { SzkodliweComponent } from './components/szkodliwe/szkodliwe.component';
import { SzkodliweAddComponent } from './components/szkodliwe-add/szkodliwe-add.component';
import { SekretariatComponent } from './components/sekretariat/sekretariat.component';
import { SekretariatAddComponent } from './components/sekretariat-add/sekretariat-add.component';
import { PracownicyComponent } from './components/pracownicy/pracownicy.component';
import { PracownicyAddComponent } from './components/pracownicy-add/pracownicy-add.component';
import { ContractListComponent } from './components/contract-list/contract-list.component';
import { ContractCreateComponent } from './components/contract-create/contract-create.component';

const routes: Routes = [
  { path: 'admin', component: AdministrationComponent },

  { path: 'offer', component: OfferComponent },
  { path: 'offercreate', component: OfferAddComponent },
  { path: 'offercreatecontr/:contractorId', component: OfferAddComponent },
  {
    path: 'offeredit/:offerId',
    component: OfferAddComponent
  },
  { path: 'order', component: OrderComponent },
  { path: 'ordercreate', component: OrderAddComponent },
  { path: 'orderedit/:orderId', component: OrderAddComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'invoicecreate', component: InvoiceAddComponent },
  {
    path: 'invoiceedit/:invoiceId',
    component: InvoiceAddComponent
  },
  {
    path: 'formsadmin',
    component: FormsadminComponent
  },
  {
    path: 'kontrahenciform',
    component: KontrahenciComponent
  },
  {
    path: 'logsadmin',
    component: LogsListComponent
  },
  {
    path: 'currency',
    component: CurrencyComponent
  },
  { path: 'project', component: ProjectsComponent },
  { path: 'projectcreate', component: ProjectAddComponent },
  { path: 'szkodliwe', component: SzkodliweComponent },
  { path: 'szkodliwacreate', component: SzkodliweAddComponent },
  {
    path: 'szkodliwaedit/:szkodliwaId',
    component: SzkodliweAddComponent
  },
  { path: 'sekretariat', component: SekretariatComponent },
  { path: 'sekretariatcreate', component: SekretariatAddComponent },
  {
    path: 'sekretariatedit/:sekretariatId',
    component: SekretariatAddComponent
  },
  { path: 'pracownicy', component: PracownicyComponent },
  { path: 'pracownikadd', component: PracownicyAddComponent },
  {
    path: 'pracownikedit/:pracownikId',
    component: PracownicyAddComponent
  },
  { path: 'contracts', component: ContractListComponent },
  { path: 'contractcreate', component: ContractCreateComponent },
  {
    path: 'contractedit/:contractId',
    component: ContractCreateComponent
  }
];

@NgModule({
  declarations: [
    AdministrationComponent,
    OfferComponent,
    OfferAddComponent,
    OrderComponent,
    OrderAddComponent,
    InvoiceAddComponent,
    InvoiceComponent,
    FormsadminComponent,
    KontrahenciComponent,
    LogsListComponent,
    CurrencyComponent,
    ProjectsComponent,
    ProjectAddComponent,
    SzkodliweComponent,
    SzkodliweAddComponent,
    SekretariatComponent,
    SekretariatAddComponent,
    PracownicyComponent,
    PracownicyAddComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LazyModule { }
