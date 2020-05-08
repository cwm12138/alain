import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitorIndexComponent } from './index/index.component';

const routes: Routes = [

  { path: '', component: MonitorIndexComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitorRoutingModule { }
