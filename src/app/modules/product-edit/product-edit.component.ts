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

  productForm: FormGroup
  idAlreadyExists: boolean = false
  isCreate: boolean = true
  showModal: boolean = false

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe
  ) { }


  ngOnInit(): void {
    if (this.activatedRoute.snapshot.paramMap.get('product') == null) {
      this.isCreate = true
      this.productForm = this.formBuilder.group({
        id: new FormControl("", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
        name: new FormControl("", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])),
        description: new FormControl("", Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])),
        logo: new FormControl("", Validators.compose([Validators.required])),
        dateRelease: new FormControl(new Date(), Validators.compose([Validators.required])),
        dateRevision: new FormControl(new Date(), Validators.compose([Validators.required]))
      })
    } else {
      this.isCreate = false
      const editProduct: ProductModel = JSON.parse(this.activatedRoute.snapshot.paramMap.get('product'))
      this.productForm = this.formBuilder.group({
        id: new FormControl(editProduct.id, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
        name: new FormControl(editProduct.name, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(200)])),
        description: new FormControl(editProduct.description, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])),
        logo: new FormControl(editProduct.logo, Validators.compose([Validators.required])),
        dateRelease: new FormControl(editProduct.dateRelease, Validators.compose([Validators.required])),
        dateRevision: new FormControl(editProduct.dateRevision, Validators.compose([Validators.required]))
      })
    }
    this.productForm.get("dateRevision").disable()
    this.productForm.get("dateRelease").valueChanges.subscribe((release: string) => {
      if(release) {
        this.productForm.get("dateRevision").setValue(this.addOneYear(release))
      }
    })
  }

  addOneYear(date: string): string {
    const parts = date.split("-")
    const year = +parts[0] + 1
    let newDate = `${year}-${parts[1]}-${parts[2]}`
    return newDate
  }

  resetForm(): void {
    this.productForm.reset()
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.productService.alreadyExists(this.productForm.get("id").value).pipe(switchMap(res => {
        if (!res) {
          if (this.isCreate) {
            return this.productService.createProduct(this.productForm.getRawValue())
          }
        }
        this.idAlreadyExists = true
        return of(null)
      })).subscribe(response => {
        if (Object.keys(response).length == 6) {
          this.showModal = true
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
