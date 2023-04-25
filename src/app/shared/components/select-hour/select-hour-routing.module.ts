import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SelectHourPage } from "./select-hour.page";

const routes: Routes = [
  {
    path: '',
    component: SelectHourPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectHourPageRoutingModule {}
