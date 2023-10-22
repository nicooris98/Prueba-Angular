import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from "src/app/shared/services/product.service";
import { IAPIResults } from "src/app/shared/interfaces/api-result.interface";
import { ProductModel } from "src/app/shared/models/product.model";
import { Router } from "@angular/router";

enum MENU_OPTIONS {
  EDIT = "edit",
  DELETE = "delete"
}

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
  menu = [
    {
      url: MENU_OPTIONS.EDIT,
      label: "Editar"
    },
    {
      url: MENU_OPTIONS.DELETE,
      label: "Eliminar"
    }
  ]

  records: IAPIResults<ProductModel> = {
    totalRecords: 0,
    data: []
  }

  showModal: boolean = false
  selectedProduct: ProductModel = null
  textModal: string = ""
  showModalSuccess: boolean = false
  showModalError: boolean = false

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
    this.router.navigate(["/products/create"], { queryParams: { product: null } })
  }

  editProduct(product: ProductModel): void {
    this.router.navigate(["/products/edit"], { queryParams: { product: JSON.stringify(product) } })
  }

  handleActions(url, product): void {
    if (url == MENU_OPTIONS.EDIT) {
      this.editProduct(product)
      return
    }
    if (url == MENU_OPTIONS.DELETE) {
      this.selectedProduct = product
      this.showModal = true
      return
    }
  }

  cancelModal(): void {
    this.showModal = false
    this.selectedProduct = null
  }

  confirmDelete(): void {
    this.productService.deleteProduct(this.selectedProduct.id).subscribe(res => {
      if(res) {
        this.loadData()
        this.textModal = "Producto elminado con exito!"
        this.showModalSuccess = true
        setTimeout(() => {
          this.showModalSuccess = false
        }, 2000);
      }
      else {
        this.textModal = "Error al eliminar el producto"
        this.showModalError = true
        setTimeout(() => {
          this.showModalError = false
        }, 2000);
      }
      this.showModal = false
    })
  }

}
