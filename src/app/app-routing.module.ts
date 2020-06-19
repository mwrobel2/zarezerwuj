import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'wycieczki', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'wycieczki',
    loadChildren: () => import('./wycieczki/wycieczki.module').then( m => m.WycieczkiPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'rezerwacje',
    loadChildren: () => import('./rezerwacje/rezerwacje.module').then( m => m.RezerwacjePageModule),
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
