import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserGuard } from "./guards/user.guard";
import { LoginComponent } from "./pages/login/login.component";
import { OrderComponent } from "./pages/order/order.component";
import { OrdersComponent } from "./pages/orders/orders.component";
import { QueriesComponent } from "./pages/queries/queries.component";
import { ProductsComponent } from "./pages/products/products.component";

const routes: Routes = [
  { path: "", component: OrdersComponent, canActivate: [UserGuard] },
  { path: "order/:id", component: OrderComponent, canActivate: [UserGuard] },
  { path: "login", component: LoginComponent },
  { path: "queries", component: QueriesComponent, canActivate: [UserGuard] },
  { path: "products", component: ProductsComponent, canActivate: [UserGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
