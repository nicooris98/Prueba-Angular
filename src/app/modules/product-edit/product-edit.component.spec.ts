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

  it('should render ID inválido! when id error', () => {
    component.isCreate = true
    component.resetForm()
    component.productForm.get("id").setValue("")
    component.productForm.get("id").markAsTouched()
    fixture.detectChanges()
    const errorText = fixture.nativeElement.querySelector("#id-error").textContent
    const expectedText = " ID inválido! "
    expect(errorText).toBe(expectedText)
  })

  it('should render Formulario de Registro in Form', () => {
    const title = fixture.nativeElement.querySelector(".form-title").textContent
    const expectedText = "Formulario de Registro"
    expect(title).toBe(expectedText)
  })

  it('should render id input in Form', () => {
    const idInput = fixture.nativeElement.querySelector("#id-input")
    expect(idInput).toBeTruthy()
  })

  it('should be invalid form', () => {
    component.isCreate = true
    component.resetForm()

    expect(component.productForm.invalid).toBe(true)
  })

  it('should render Producto actualizado correctamente when update', () => {

    component.isCreate = false

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
    component.onSubmit()
    fixture.detectChanges()

    let textModal = fixture.nativeElement.querySelector(".ok").textContent

    const expectedText = " Producto actualizado correctamente "

    expect(textModal).toBe(expectedText)
  })

  it('dateRevision should be dateRelease + 1 year', () => {

    component.isCreate = true

    component.productForm = component.defaultControls()
    component.productForm.get("dateRelease").setValue("2024-01-01")
    fixture.detectChanges()
    setTimeout(() => {
      const dateValue = component.productForm.get("dateRevision").value
      const expectedValue = "2025-01-01"

      expect(dateValue).toBe(expectedValue)
    }, 500)
  })

  it('should be default', () => {

    const expectedForm = formBuilder.group({
      id: new FormControl("", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      name: new FormControl("", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])),
      description: new FormControl("", Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])),
      logo: new FormControl("", Validators.compose([Validators.required])),
      dateRelease: new FormControl(component.formatDate(new Date().toString()), Validators.compose([Validators.required])),
      dateRevision: new FormControl(component.formatDatePlusOne(new Date().toString()), Validators.compose([Validators.required]))
    }).value
    const form = component.productForm.value
    expect(form).toEqual(expectedForm)
  })
});
