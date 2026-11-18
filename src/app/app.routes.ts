import { Routes } from '@angular/router';

<<<<<<< HEAD
export const routes: Routes = [{ path: 'clients', loadComponent: () => import('./client/client-list/client-list.page').then(m => m.ClientListComponent)}];
=======
export const routes: Routes = [
    { path: '', redirectTo: '/games', pathMatch: 'full'},
    { path: 'categories', loadComponent: () => import('./category/category-list/category-list.page').then(m => m.CategoryListPage)},
    { path: 'authors', loadComponent: () => import('./author/author-list/author-list.page').then(m => m.AuthorListPage)},
    { path: 'games', loadComponent: () => import('./game/game-list/game-list.page').then(m => m.GameListPage)},
    //{ path: 'clients', loadComponent: () => import('./client/client-list/client-list').then(m => m.ClientListPage)},
    //{ path: 'loans', loadComponent: () => import('./loan/loan-list/loan-list').then(m => m.LoanListPage)}
];
>>>>>>> b5b98d0074cb30678cbbdd425fc6fe6ed4afd6ef
