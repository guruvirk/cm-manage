import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { Router } from '@angular/router';
import { UxService } from '../../services/ux.service';
import { Order } from 'src/app/services/models';
import { IPager, Page } from 'src/app/models';
import { MatDialog } from '@angular/material';
import { OrderService } from 'src/app/services/order.service';
import { PaginatorComponent } from 'src/app/components/paginator/paginator.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy, IPager<Order> {

  page: Page<Order>;
  isMobile: boolean = false;
  isLoading = false;
  query = {
    limit: 10,
    sort: "new"
  };
  filters: {
    isSelected: boolean,
    label: String
  }[];
  status: String
  sort = 'new'

  @ViewChild('paginator', null)
  paginatorComponent: PaginatorComponent;

  constructor(
    private api: OrderService,
    private auth: RoleService,
    private router: Router,
    private uxService: UxService,
    public dialog: MatDialog) {
    if (window.screen.width < 781) {
      this.isMobile = true
    }
    this.get()
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  get(queryOptions?) {
    this.isLoading = true
    if (this.filters && this.filters.length) {
      let options = []
      for (const filter of this.filters) {
        if (filter.isSelected) {
          options.push(filter.label.toLowerCase())
        }
      }
      if (options.length) {
        this.query["options"] = options
      } else {
        delete this.query["options"];
      }
    } else {
      delete this.query["options"];
    }
    if (queryOptions) {
      if (queryOptions.offset) {
        this.query['offset'] = queryOptions.offset
      } else {
        this.query['offset'] = 0
      }
    } else {
      this.query['offset'] = 0
    }
    
    if (this.status) {
      this.query['status'] = this.status
    } else {
      delete this.query['status']
    }

    if (this.sort) {
      this.query['sort'] = this.sort
    } else {
      delete this.query['status']
    }
    this.api.search(this.query).subscribe(page => {
      this.page = page
      if (page.items && page.items.length) {
        let i = 0
        for (let item of page.items) {
          this.page.items[i] = (new Order(item))
          i++
        }
      }
      this.page.totalPages = (page.total / page.limit)
      if (this.paginatorComponent) {
        this.paginatorComponent.calculatePages(this)
      }
      this.isLoading = false
    }, err => {
      this.isLoading = false;
    })
  }

  reset() {
    this.status = null
    this.sort = 'new'
    this.get()
  }

  select(order: Order) {
    this.router.navigate(["/order", order.id])
  }

  delete(order: Order) {
    this.isLoading = true;
    this.api.update(order.id, { status: 'inactive' }).subscribe(item => {
      order = item
      this.isLoading = false;
      this.get()
    }, err => {
      this.isLoading = false;
    })
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
      pageNo = (this.page.total / this.page.limit);
      return;
    }

    return this.get(this.convertToPageOption(pageNo));
  }

  formatNZPhone(rawPhone: string): { display: string; tel: string } {
    if (!rawPhone) {
      return { display: "", tel: "" };
    }

    let phone = rawPhone.replace(/[^\d+]/g, "");

    if (phone.startsWith("+64")) {
      phone = "0" + phone.substring(3);
    } else if (phone.startsWith("64")) {
      phone = "0" + phone.substring(2);
    } else if (!phone.startsWith("0")) {
      phone = "0" + phone;
    }

    const display = phone;

    const tel = "+64" + phone.substring(1);

    return { display, tel };
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

}
