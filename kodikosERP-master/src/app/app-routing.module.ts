import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StrstartowaComponent } from './components/strstartowa/strstartowa.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { KontrahentCreateComponent } from './components/kontrahent-create/kontrahent-create.component';
import { KontrahentListComponent } from './components/kontrahent-list/kontrahent-list.component';
import { AssortmentAddComponent } from './components/assortment-add/assortment-add.component';
import { AssortmentComponent } from './components/assortment/assortment.component';
import { GlowneMenuComponent } from './components/glowne-menu/glowne-menu.component';
import { MagazynListComponent } from './components/magazyn-list/magazyn-list.component';
import { MagazynCreateComponent } from './components/magazyn-create/magazyn-create.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { DictionaryListComponent } from './components/dictionary-list/dictionary-list.component';
import { DictionaryCreateComponent } from './components/dictionary-create/dictionary-create.component';
import { ExportComponent } from './components/export/export.component';

const routes: Routes = [
  { path: '', component: StrstartowaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'contractorcreate', component: KontrahentCreateComponent },
  { path: 'contractorslist', component: KontrahentListComponent },
  {
    path: 'contractoredit/:contractorId',
    component: KontrahentCreateComponent
  },
  { path: 'assortmentslist', component: AssortmentComponent },
  { path: 'assortmentcreate', component: AssortmentAddComponent },
  {
    path: 'assortmentedit/:assortmentId',
    component: AssortmentAddComponent
  },
  {
    path: 'assortmentcreate/:assortmentId/:nowy',
    component: AssortmentAddComponent
  },
  { path: 'warehouselist', component: MagazynListComponent },
  { path: 'warehousecreate', component: MagazynCreateComponent },
  { path: 'warehouseedit/:warehouseId', component: MagazynCreateComponent },
  { path: 'userlist', component: UserListComponent },
  { path: 'usercreate', component: UserCreateComponent },
  { path: 'useredit/:userId', component: UserCreateComponent },
  { path: 'dictlist', component: DictionaryListComponent },
  { path: 'dictcreate', component: DictionaryCreateComponent },
  { path: 'dictedit/:dictId', component: DictionaryCreateComponent },
  { path: 'export', component: ExportComponent },
  { path: 'export/:id', component: ExportComponent },
  { path: 'glownemenu', component: GlowneMenuComponent },
  {
    path: 'lazy',
    loadChildren: () => import('./lazy.module').then(m => m.LazyModule)
  },
  {
    path: 'rrwmodule',
    loadChildren: () => import('./rrwmodule.module').then(m => m.RrwModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
