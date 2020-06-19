import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

// import { RezerwacjePageRoutingModule } from './rezerwacje-routing.module';

import { RezerwacjePage } from './rezerwacje.page';


const routes: Routes = [
  {
    path: '',
    component: RezerwacjePage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RezerwacjePage]
})
export class RezerwacjePageModule {}
