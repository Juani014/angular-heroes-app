import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { HeroPageComponent } from './pages/hero-page/hero-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';

// localhost:4200/heroes
const routes: Routes = [
    {
      path: '',
      component: LayoutPageComponent,
      children: [
        { path: 'list', component: ListPageComponent },
        { path: 'edit/:id', component: NewPageComponent },
        { path: 'new-hero', component: NewPageComponent },
        { path: 'search', component: SearchPageComponent },
        { path: ':id', component: HeroPageComponent },
        { path: '**', redirectTo: 'list' },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeroesRoutingModule { }
