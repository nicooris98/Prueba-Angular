import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormControl } from "@angular/forms";
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "src/app/shared/services/product.service";
import { ProductModel } from "src/app/shared/models/product.model";
import { switchMap, of } from "rxjs";

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  productForm: FormGroup = this.defaultControls()
  idAlreadyExists: boolean = false
  isCreate: boolean = true
  showModal: boolean = false
  textModal: string = "Producto creado correctamente"
  titleForm: string = "Formulario de Registro"

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe
  ) { }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (Object.keys(params).length === 0) {
        this.isCreate = true
      } else {
        this.isCreate = false
        const editProduct: ProductModel = JSON.parse(params["product"])
        this.productForm = this.formBuilder.group({
          id: new FormControl(editProduct.id),
          name: new FormControl(editProduct.name, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])),
          description: new FormControl(editProduct.description, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])),
          logo: new FormControl(editProduct.logo, Validators.compose([Validators.required])),
          dateRelease: new FormControl(this.formatDate(editProduct.dateRelease.toString()), Validators.compose([Validators.required])),
          dateRevision: new FormControl(this.formatDate(editProduct.dateRevision.toString()), Validators.compose([Validators.required]))
        })
        this.productForm.get("id").disable()
      }
      this.productForm.get("dateRevision").disable()
      this.productForm.get("dateRelease").valueChanges.subscribe((release: string) => {
        if (release) {
          this.productForm.get("dateRevision").setValue(this.addOneYear(release))
        }
      })
    })
  }

  defaultControls(): FormGroup {
    return new FormGroup({
      id: new FormControl("", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      name: new FormControl("", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])),
      description: new FormControl("", Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])),
      logo: new FormControl("", Validators.compose([Validators.required])),
      dateRelease: new FormControl(this.formatDate(new Date().toString()), Validators.compose([Validators.required])),
      dateRevision: new FormControl(this.formatDatePlusOne(new Date().toString()), Validators.compose([Validators.required]))
    })
  }

  formatDate(original: string): string {
    const date = new Date(original)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  formatDatePlusOne(original: string): string {
    const date = new Date(original)
    const year = date.getFullYear()+1
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  addOneYear(date: string): string {
    const parts = date.split("-")
    const year = +parts[0] + 1
    let newDate = `${year}-${parts[1]}-${parts[2]}`
    return newDate
  }

  resetForm(): void {
    if (this.isCreate) {
      this.productForm = this.defaultControls()
    } else {
      this.productForm.get("description").reset()
      this.productForm.get("name").reset()
      this.productForm.get("logo").reset()
      this.productForm.get("dateRelease").reset()
      this.productForm.get("dateRevision").reset()
    }
  }

  onSubmit(): void {
    if (this.productForm.valid && this.isCreate) {
      this.productService.alreadyExists(this.productForm.get("id").value).pipe(switchMap(res => {
        if (!res) {
          return this.productService.createProduct(this.productForm.getRawValue())
        }
        this.idAlreadyExists = true
        return of(null)
      })).subscribe(response => {
        if (Object.keys(response).length == 6) {
          this.showModal = true
          this.textModal = "Producto creado correctamente"
          setTimeout(() => {
            this.router.navigate(["/products"])
          }, 2000);
        }
        else {
          setTimeout(() => {
            this.idAlreadyExists = false
          }, 1000)
        }
      })
    }
    if (this.productForm.valid && !this.isCreate) {
      this.productService.updateProduct(this.productForm.getRawValue()).subscribe(res => {
        if (Object.keys(res).length == 6) {
          this.showModal = true
          this.textModal = "Producto actualizado correctamente"
          setTimeout(() => {
            this.router.navigate(["/products"])
          }, 2000);
        }
        else {
          setTimeout(() => {
            this.idAlreadyExists = false
          }, 1000)
        }
      })
    }
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'yyyy-MM-dd');
  }

}
