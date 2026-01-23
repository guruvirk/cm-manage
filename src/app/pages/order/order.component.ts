import { Component, OnInit, OnDestroy } from "@angular/core";
import { RoleService } from "../../services/role.service";
import { Router, ActivatedRoute } from "@angular/router";
import { UxService } from "../../services/ux.service";
import { Order } from "src/app/services/models";
import { MatDialog } from "@angular/material";
import { OrderService } from "src/app/services/order.service";

@Component({
  selector: "app-orders",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit, OnDestroy {
  order: Order;
  isMobile: boolean = false;
  isLoading = false;

  constructor(
    private api: OrderService,
    private auth: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private uxService: UxService,
    public dialog: MatDialog,
  ) {
    if (window.screen.width < 781) {
      this.isMobile = true;
    }
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.isLoading = true;
        this.api.get(params.id).subscribe(
          (item) => {
            this.order = item;
            this.isLoading = false;
          },
          (err) => {
            this.isLoading = false;
          },
        );
      }
    });
  }

  update(status: string) {
    this.isLoading = true;
    this.api.update(this.order.id, { status: status }).subscribe(
      (item) => {
        this.order = item;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      },
    );
  }

  ngOnInit() {}

  ngOnDestroy(): void {}

  back() {
    this.uxService.back();
  }

  print() {
    let popupWinindow;
    let innerContents = document.getElementById("page").innerHTML;
    popupWinindow = window.open(
      "",
      "_blank",
      "scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no",
    );
    popupWinindow.document.open();
    popupWinindow.document.write(
      '<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' +
        innerContents +
        "</html>",
    );
    popupWinindow.document.close();
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
}
