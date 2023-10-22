import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from "src/app/shared/services/product.service";
import { BehaviorSubject, Observable, of } from "rxjs"
import { IAPIResults } from "src/app/shared/interfaces/api-result.interface";
import { ProductModel } from "src/app/shared/models/product.model";
import { Router } from "@angular/router";

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [CommonModule]
})
export class ProductListComponent implements OnInit {

  rows: number = 5
  page: number = 1
  rowsPerPage: number[] = [5, 10, 20]

  records: IAPIResults<ProductModel> = {
    totalRecords: 0,
    data: []
  }

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData(): void {
    this.productService.getProductList().subscribe(res => {
      if (res) {
        this.records = {
          totalRecords: res.totalRecords,
          data: res.data.splice(0, this.rows)
        }
      }
    })
  }

  handleOption(event): void {
    this.rows = event as number
    this.loadData()
  }

  handleChange(event): void {
    const val = event.target.value
    this.loadData()
    setTimeout(() => {
      this.records.data = this.records.data.filter((el: ProductModel) => el.description.toUpperCase().includes(val.toUpperCase()) || el.name.toUpperCase().includes(val.toUpperCase()))
    }, 500)
  }

  createProduct(): void {
    this.router.navigate(["/products/create"], { queryParams: { product: null}})
  }

}
