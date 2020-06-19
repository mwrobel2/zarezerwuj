import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

import { NowaOfertaPage } from './nowa-oferta.page';
import { MapModule } from '../../../map/map.module';

const routes: Routes = [
  {
    path: '',
    component: NowaOfertaPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MapModule
     ],
  declarations: [NowaOfertaPage]
})
export class NowaOfertaPageModule {}
