import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { EdytujOfertyPage } from './edytuj-oferty.page';

const routes: Routes = [
  {
    path: '',
    component: EdytujOfertyPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EdytujOfertyPage]
})
export class EdytujOfertyPageModule {}
