import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

// import { OfertyPageRoutingModule } from './oferty-routing.module';

import { OfertyPage } from './oferty.page';
import { PozycjaOfertyComponent } from './pozycja-oferty/pozycja-oferty.component';

const routes: Routes = [
  {
    path: '',
    component: OfertyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OfertyPage, PozycjaOfertyComponent]
})
export class OfertyPageModule {}
