import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { RoleService } from "../../services/role.service";
import { Router } from "@angular/router";
import { UxService } from "../../services/ux.service";
import { Product } from "src/app/services/models";
import { IPager, Page } from "src/app/models";
import { MatDialog, MatSlideToggleChange } from "@angular/material";
import { ProductService } from "src/app/services/product.service";
import { PaginatorComponent } from "src/app/components/paginator/paginator.component";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit, OnDestroy, IPager<Product> {
  page: Page<Product>;
  isMobile: boolean = false;
  isLoading = false;
  query = {
    limit: 10,
    sort: "name",
  };
  filters: {
    isSelected: boolean;
    label: String;
  }[];
  sort = "name";

  @ViewChild("paginator", null)
  paginatorComponent: PaginatorComponent;

  constructor(
    private api: ProductService,
    private auth: RoleService,
    private router: Router,
    private uxService: UxService,
    public dialog: MatDialog
  ) {
    if (window.screen.width < 781) {
      this.isMobile = true;
    }
    this.get();
  }

  ngOnInit() {}

  ngOnDestroy(): void {}

  get(queryOptions?) {
    this.isLoading = true;
    if (this.filters && this.filters.length) {
      let options = [];
      for (const filter of this.filters) {
        if (filter.isSelected) {
          options.push(filter.label.toLowerCase());
        }
      }
      if (options.length) {
        this.query["options"] = options;
      } else {
        delete this.query["options"];
      }
    } else {
      delete this.query["options"];
    }
    if (queryOptions) {
      if (queryOptions.offset) {
        this.query["offset"] = queryOptions.offset;
      } else {
        this.query["offset"] = 0;
      }
    } else {
      this.query["offset"] = 0;
    }

    if (this.sort) {
      this.query["sort"] = this.sort;
    } else {
      delete this.query["status"];
    }
    this.query["inStock"] = "all"
    this.api.search(this.query).subscribe(
      (page) => {
        this.page = page;
        if (page.items && page.items.length) {
          let i = 0;
          for (let item of page.items) {
            this.page.items[i] = new Product(item);
            i++;
          }
        }
        this.page.totalPages = page.total / page.limit;
        if (this.paginatorComponent) {
          this.paginatorComponent.calculatePages(this);
        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  reset() {
    this.sort = "new";
    this.get();
  }

  showPage(pageNo: number) {
    if (this.isLoading) {
      return;
    }
    if (pageNo === -2) {
      pageNo = 1;
      return;
    }

    if (pageNo === -1) {
      pageNo = this.page.total / this.page.limit;
      return;
    }

    return this.get(this.convertToPageOption(pageNo));
  }

  private convertToPageOption(pageNo: number) {
    const options: any = {};
    if (this.page) {
      options.offset = (pageNo - 1) * this.page.limit;
      options.limit = this.page.limit;
      options.sort = this.page.sort;
    }
    return options;
  }

  updateStock(product: Product, event: MatSlideToggleChange) {
    this.isLoading = true;
    this.api
      .update(product.id, { inStock: event.checked ? "yes" : "no" })
      .subscribe(
        (item) => {
          product = item;
          this.isLoading = false;
          this.get();
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }

  updatePrice(product: Product) {
    this.isLoading = true;
    this.api
      .update(product.id, { price: product.price })
      .subscribe(
        (item) => {
          product = item;
          this.isLoading = false;
          this.get();
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }
}
