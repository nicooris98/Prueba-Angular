import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditComponent } from './product-edit.component';
import { ActivatedRoute, Router, convertToParamMap } from "@angular/router";
import { of } from "rxjs";
import { ProductService } from "src/app/shared/services/product.service";
import { ProductServiceMock } from "src/app/shared/services/product.service.mock";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";

describe('ProductEditComponent', () => {
  let component: ProductEditComponent;
  let fixture: ComponentFixture<ProductEditComponent>;
  let activatedRoute: ActivatedRoute;
  let formBuilder: FormBuilder;
  let router: Router


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductEditComponent, ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ product: null })
          }
        },
        {
          provide: ProductService, useClass: ProductServiceMock
        },
        FormBuilder
      ]
    });
    fixture = TestBed.createComponent(ProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    activatedRoute = TestBed.inject(ActivatedRoute)
    formBuilder = TestBed.inject(FormBuilder)
    router = TestBed.inject(Router)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  })

  it('should be default controls when resets', () => {
    const defaultForm = component.defaultControls().getRawValue()
    component.isCreate = true
    component.resetForm()
    const productForm = component.productForm.getRawValue()
    expect(productForm).toEqual(defaultForm)
  })

  it('should have required error in controls when no data', () => {
    component.isCreate = true
    component.resetForm()
    const form = component.productForm
    form.get("id").setValue("")
    form.get("description").setValue("")
    form.get("name").setValue("")
    form.get("logo").setValue("")
    fixture.detectChanges()
    const idControl = form.get("id")
    const descriptionControl = form.get("description")
    const nameControl = form.get("name")
    const logoControl = form.get("logo")
    expect(idControl.hasError("required")).toBe(true)
    expect(descriptionControl.hasError("required")).toBe(true)
    expect(nameControl.hasError("required")).toBe(true)
    expect(logoControl.hasError("required")).toBe(true)
  })

  it('should render modal-ok when create', () => {

    let modalOk = fixture.nativeElement.querySelector("#modal-ok")
    expect(modalOk).toBeNull()

    const createProduct = {
      id: "asdxx",
      name: "nombrecito1",
      description: "descripcion1",
      logo: "logonuevo",
      dateRelease: "2023-10-23T00:00:00.000+00:00",
      dateRevision: "2024-10-23T00:00:00.000+00:00"
    } as any

    component.productForm = formBuilder.group({
      id: new FormControl(createProduct.id),
      name: new FormControl(createProduct.name, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])),
      description: new FormControl(createProduct.description, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])),
      logo: new FormControl(createProduct.logo, Validators.compose([Validators.required])),
      dateRelease: new FormControl(component.formatDate(createProduct.dateRelease.toString()), Validators.compose([Validators.required])),
      dateRevision: new FormControl(component.formatDate(createProduct.dateRevision.toString()), Validators.compose([Validators.required]))
    })
    component.isCreate = true
    component.onSubmit()
    fixture.detectChanges()

    modalOk = fixture.nativeElement.querySelector("#modal-ok")
    fixture.detectChanges()

    expect(modalOk).toBeTruthy()
  })

  it('should navigate to products', () => {

    const navigateSpy = spyOn(router, 'navigate')

    const editProduct = {
      id: "asdxx",
      name: "nombrecito1",
      description: "descripcion1",
      logo: "logonuevo",
      dateRelease: "2023-10-23T00:00:00.000+00:00",
      dateRevision: "2024-10-23T00:00:00.000+00:00"
    } as any

    component.productForm = formBuilder.group({
      id: new FormControl(editProduct.id),
      name: new FormControl(editProduct.name, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])),
      description: new FormControl(editProduct.description, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])),
      logo: new FormControl(editProduct.logo, Validators.compose([Validators.required])),
      dateRelease: new FormControl(component.formatDate(editProduct.dateRelease.toString()), Validators.compose([Validators.required])),
      dateRevision: new FormControl(component.formatDate(editProduct.dateRevision.toString()), Validators.compose([Validators.required]))
    })
    component.isCreate = true
    component.onSubmit()
    fixture.detectChanges()
    setTimeout(() => {
      expect(navigateSpy).toHaveBeenCalledWith(['/products'])
    }, 2000);
  })

  it('should render modal-ok when update', () => {

    let modalOk = fixture.nativeElement.querySelector("#modal-ok")
    expect(modalOk).toBeNull()

    const editProduct = {
      id: "asdxx",
      name: "nombrecito1",
      description: "descripcion1",
      logo: "logonuevo",
      dateRelease: "2023-10-23T00:00:00.000+00:00",
      dateRevision: "2024-10-23T00:00:00.000+00:00"
    } as any

    component.productForm = formBuilder.group({
      id: new FormControl(editProduct.id),
      name: new FormControl(editProduct.name, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])),
      description: new FormControl(editProduct.description, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])),
      logo: new FormControl(editProduct.logo, Validators.compose([Validators.required])),
      dateRelease: new FormControl(component.formatDate(editProduct.dateRelease.toString()), Validators.compose([Validators.required])),
      dateRevision: new FormControl(component.formatDate(editProduct.dateRevision.toString()), Validators.compose([Validators.required]))
    })
    component.isCreate = false
    component.onSubmit()
    fixture.detectChanges()

    modalOk = fixture.nativeElement.querySelector("#modal-ok")
    fixture.detectChanges()

    expect(modalOk).toBeTruthy()
  })

  it('should render Reset button', () => {

    const resetButton = fixture.nativeElement.querySelector(".reset")

    expect(resetButton).toBeTruthy()
  })

  it('should render Reiniciar', () => {

    const resetButtonText = fixture.nativeElement.querySelector(".reset").textContent

    const expectedText = "Reiniciar"
    expect(resetButtonText).toBe(expectedText)
  })

  it('should render Submit button', () => {

    const resetButton = fixture.nativeElement.querySelector(".submit")

    expect(resetButton).toBeTruthy()
  })

  it('should render Enviar', () => {

    const resetButtonText = fixture.nativeElement.querySelector(".submit").textContent

    const expectedText = "Enviar"
    expect(resetButtonText).toBe(expectedText)
  })
});
