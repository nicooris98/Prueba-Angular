import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "products", loadComponent:
      () => import("./modules/product-list/product-list.component")
        .then(c => c.ProductListComponent)
  },
  {
    path: "products/create", loadComponent:
      () => import("./modules/product-edit/product-edit.component")
        .then(c => c.ProductEditComponent)
  },
  {
    path: "products/edit", loadComponent:
      () => import("./modules/product-edit/product-edit.component")
        .then(c => c.ProductEditComponent)
  },
  { path: "", pathMatch: "full", redirectTo: "products" },
  { path: "**", pathMatch: "full", redirectTo: "products" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
