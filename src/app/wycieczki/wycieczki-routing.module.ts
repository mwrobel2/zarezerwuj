import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WycieczkiPage } from './wycieczki.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: WycieczkiPage,
    children: [
    { path: 'szukaj', children: [
    {
      path: '',
      loadChildren: () => import('./szukaj/szukaj.module').then( m => m.SzukajPageModule)
    },
    {
      path: ':miejsceId',
      loadChildren: () => import('./szukaj/opis-wycieczki/opis-wycieczki.module').then( m => m.OpisWycieczkiPageModule)
    }
  ]
    },
    {
      path: 'oferty', children: [
    {
      path: '',
      loadChildren: () => import('./oferty/oferty.module').then( m => m.OfertyPageModule)
    },
    {
      path: 'nowa',
      loadChildren: () => import('./oferty/nowa-oferta/nowa-oferta.module').then( m => m.NowaOfertaPageModule)
    },
    {
      path: 'edytuj/:miejsceId',
      loadChildren: () => import('./oferty/edytuj-oferty/edytuj-oferty.module').then( m => m.EdytujOfertyPageModule)
    },
    {
      path: ':miejsceId',
      loadChildren: () => import('./oferty/oferty-rezerwacji/oferty-rezerwacji.module').then( m => m.OfertyRezerwacjiPageModule)
    }
  ]
  },
    {
      path: '',
      redirectTo: '/wycieczki/tabs/szukaj',
      pathMatch: 'full'
    }
    ]
  },
  {
    path: '',
    redirectTo: '/wycieczki/tabs/szukaj',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WycieczkiRoutingModule {}
