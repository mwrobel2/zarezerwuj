import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

import { SzukajPage } from './szukaj.page';

const routes: Routes = [
  {
    path: '',
    component: SzukajPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
    // SzukajPageRoutingModule
  ],
  declarations: [SzukajPage]
})
export class SzukajPageModule {}
