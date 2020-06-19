import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OfertyRezerwacjiPage } from './oferty-rezerwacji.page';

const routes: Routes = [
  {
    path: '',
    component: OfertyRezerwacjiPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OfertyRezerwacjiPage]
})
export class OfertyRezerwacjiPageModule {}
