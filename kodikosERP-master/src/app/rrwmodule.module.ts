import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RrwlistComponent } from './components/rrwlist/rrwlist.component';
import { RrweditComponent } from './components/rrwedit/rrwedit.component';
import { KluczeComponent } from './components/klucze/klucze.component';
import { KluczeAddComponent } from './components/klucze-add/klucze-add.component';
import { PrzesylkiComponent } from './components/przesylki/przesylki.component';
import { PrzesylkiAddComponent } from './components/przesylki-add/przesylki-add.component';
import { KluczeRejestrComponent } from './components/klucze-rejestr/klucze-rejestr.component';
import { KluczeRejestrAddComponent } from './components/klucze-rejestr-add/klucze-rejestr-add.component';
import { KluczeWydaniaComponent } from './components/klucze-wydania/klucze-wydania.component';
import { KluczeWydaniaAddComponent } from './components/klucze-wydania-add/klucze-wydania-add.component';
import { KluczeRejestratorComponent } from './components/klucze-rejestrator/klucze-rejestrator.component';
import { KluczeMojaHistoriaComponent } from './components/klucze-moja-historia/klucze-moja-historia.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PracownikNazwiskoPipe } from './pipes/pracownik-nazwisko.pipe';


const routes: Routes = [
  { path: 'rcp', component: RrwlistComponent },
  { path: 'rcpadd', component: RrweditComponent },
  { path: 'rcpedit/:rrwId', component: RrweditComponent },
  { path: 'klucze', component: KluczeComponent },
  { path: 'kluczeadd', component: KluczeAddComponent },
  { path: 'kluczeedit/:kluczId', component: KluczeAddComponent },
  { path: 'przesylki', component: PrzesylkiComponent },
  { path: 'przesylkiadd', component: PrzesylkiAddComponent },
  { path: 'przesylkiedit/:przesylkaId', component: PrzesylkiAddComponent },
  { path: 'kluczerejestr', component: KluczeRejestrComponent },
  { path: 'kluczerejestradd', component: KluczeRejestrAddComponent },
  { path: 'kluczerejestredit/:kluczId', component: KluczeRejestrAddComponent },
  { path: 'kluczewydania', component: KluczeWydaniaComponent },
  { path: 'kluczewydaniaadd', component: KluczeWydaniaAddComponent },
  { path: 'kluczewydaniaedit/:Id', component: KluczeWydaniaAddComponent },
  { path: 'kluczerejestracja', component: KluczeRejestratorComponent },
  { path: 'kluczemojahistoria', component: KluczeMojaHistoriaComponent },
];

@NgModule({
  declarations: [
    RrwlistComponent,
    RrweditComponent,
    KluczeComponent,
    KluczeAddComponent,
    PrzesylkiComponent,
    PrzesylkiAddComponent,
    KluczeRejestrComponent,
    KluczeRejestrAddComponent,
    KluczeWydaniaComponent,
    KluczeWydaniaAddComponent,
    KluczeRejestratorComponent,
    KluczeMojaHistoriaComponent,
    PracownikNazwiskoPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class RrwModule { }
