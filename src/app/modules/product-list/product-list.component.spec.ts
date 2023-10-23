import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { ProductService } from "src/app/shared/services/product.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ProductServiceMock } from "src/app/shared/services/product.service.mock";
import { By } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { ProductModel } from "src/app/shared/models/product.model";

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let router: Router

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductListComponent, HttpClientTestingModule],
      providers: [{
        provide: ProductService, useClass: ProductServiceMock
      }]
    });
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  })

  it('should have 2 data records when have 2 rows', () => {
    const expectedResult = {
      totalRecords: 3,
      data: [
        {
          id: "asdxx",
          name: "nombrecito1",
          description: "descripcion1",
          logo: "logonuevo",
          dateRelease: "2023-10-23T00:00:00.000+00:00",
          dateRevision: "2024-10-23T00:00:00.000+00:00"
        },
        {
          id: "testtt",
          name: "testttttt",
          description: "tettttttttttttttttttt",
          logo: "teast",
          dateRelease: "2023-10-22T00:00:00.000+00:00",
          dateRevision: "2024-10-22T00:00:00.000+00:00"
        }
      ]
    }

    component.rows = 2

    component.ngOnInit()

    expect(component.records).toEqual(expectedResult as any)
  })

  it('should render modal-delete when click dropdown delete', () => {

    let modalDelete = fixture.nativeElement.querySelector("#modal-delete")
    expect(modalDelete).toBeNull()

    const testProduct = {
      id: "asdxx",
      name: "nombrecito1",
      description: "descripcion1",
      logo: "logonuevo",
      dateRelease: "2023-10-23T00:00:00.000+00:00",
      dateRevision: "2024-10-23T00:00:00.000+00:00"
    }

    component.handleActions("delete", testProduct)

    fixture.detectChanges()

    modalDelete = fixture.nativeElement.querySelector("#modal-delete")

    expect(modalDelete).toBeTruthy()
  })

  it('should render modal-ok when confirm delete', () => {

    let modalOk = fixture.nativeElement.querySelector("#modal-ok")
    expect(modalOk).toBeNull()

    component.selectedProduct = {
      id: "asdxx",
      name: "nombrecito1",
      description: "descripcion1",
      logo: "logonuevo",
      dateRelease: "2023-10-23T00:00:00.000+00:00",
      dateRevision: "2024-10-23T00:00:00.000+00:00"
    } as any

    component.confirmDelete()

    fixture.detectChanges()

    modalOk = fixture.nativeElement.querySelector("#modal-ok")

    expect(modalOk).toBeTruthy()
  })

  it('should render Producto elminado con exito! when modal-ok', () => {

    component.selectedProduct = {
      id: "asdxx",
      name: "nombrecito1",
      description: "descripcion1",
      logo: "logonuevo",
      dateRelease: "2023-10-23T00:00:00.000+00:00",
      dateRevision: "2024-10-23T00:00:00.000+00:00"
    } as any

    component.confirmDelete()

    fixture.detectChanges()

    let textModal = fixture.nativeElement.querySelector("#modal-ok").textContent

    const expectedText = " Producto elminado con exito! "

    expect(textModal).toBe(expectedText)
  })

  it('should render 3 Resultados when loadData', () => {

    component.ngOnInit()

    fixture.detectChanges()

    const totalText = fixture.nativeElement.querySelector(".total").textContent

    const expectedText = "3 Resultados"

    expect(totalText).toBe(expectedText)
  })

  it('should navigate to create', () => {

    const navigateSpy = spyOn(router, 'navigate')

    component.createProduct()

    expect(navigateSpy).toHaveBeenCalledWith(['/products/create'], { queryParams: { product: null } })
  })

  it('should navigate to edit', () => {

    const navigateSpy = spyOn(router, 'navigate')

    const product = {
      id: "asdxx",
      name: "nombrecito1",
      description: "descripcion1",
      logo: "logonuevo",
      dateRelease: "2023-10-23T00:00:00.000+00:00",
      dateRevision: "2024-10-23T00:00:00.000+00:00"
    }

    component.editProduct(product as unknown as ProductModel)

    expect(navigateSpy).toHaveBeenCalledWith(['/products/edit'], { queryParams: { product: JSON.stringify(product) } })
  })
});
