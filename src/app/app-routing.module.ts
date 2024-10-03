import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiodataFormComponent } from './components/biodata-form/biodata-form.component'; 
import { BiodataListComponent } from './components/biodata-list/biodata-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/biodata-form', pathMatch: 'full' },
  { path: 'biodata-form', component: BiodataFormComponent },
  { path: 'biodata-list', component: BiodataListComponent },
  { path: '**', redirectTo: '/biodata-form' } // Wildcard route for a 404 page or fallback
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
