import { Routes } from '@angular/router';

export const routes: Routes = [{ path: 'clients', loadComponent: () => import('./client/client-list/client-list.page').then(m => m.ClientListComponent)}];
