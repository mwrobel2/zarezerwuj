import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
// import { OpisWycieczkiPageRoutingModule } from './opis-wycieczki-routing.module';

import { OpisWycieczkiPage } from './opis-wycieczki.page';
import { RezerwujComponent } from '../../../rezerwacje/rezerwuj/rezerwuj.component';

const routes: Routes = [
  {
    path: '',
    component: OpisWycieczkiPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OpisWycieczkiPage, RezerwujComponent],
  entryComponents: [RezerwujComponent]
})
export class OpisWycieczkiPageModule {}
