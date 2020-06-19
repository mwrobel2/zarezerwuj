import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { WycieczkiRoutingModule } from './wycieczki-routing.module';

import { WycieczkiPage } from './wycieczki.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    WycieczkiRoutingModule
  ],
  declarations: [WycieczkiPage]
})
export class WycieczkiPageModule {}
