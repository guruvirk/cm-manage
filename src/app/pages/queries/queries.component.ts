import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { Router } from '@angular/router';
import { UxService } from '../../services/ux.service';
import { Query } from 'src/app/services/models';
import { IPager, Page } from 'src/app/models';
import { MatDialog } from '@angular/material';
import { QueryService } from 'src/app/services/query.service';
import { PaginatorComponent } from 'src/app/components/paginator/paginator.component';

@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.css']
})
export class QueriesComponent implements OnInit, OnDestroy, IPager<Query> {

  page: Page<Query>;
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
  sort = 'new'

  @ViewChild('paginator', null)
  paginatorComponent: PaginatorComponent;

  constructor(
    private api: QueryService,
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
          this.page.items[i] = (new Query(item))
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
    this.sort = 'new'
    this.get()
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
