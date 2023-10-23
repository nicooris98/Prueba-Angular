import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { ProductModel } from "../models/product.model";

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should be return Data from Server", () => {
    const mockServerResponse = [
      {
        "id": "asdxx",
        "name": "nombrecito1",
        "description": "descripcion1",
        "logo": "logonuevo",
        "date_release": "2023-10-23T00:00:00.000+00:00",
        "date_revision": "2024-10-23T00:00:00.000+00:00"
      },
      {
        "id": "testtt",
        "name": "testttttt",
        "description": "tettttttttttttttttttt",
        "logo": "teast",
        "date_release": "2023-10-22T00:00:00.000+00:00",
        "date_revision": "2024-10-22T00:00:00.000+00:00"
      }
    ]

    const expectedResult = {
      totalRecords: 2,
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
      ] as any
    }

    service.getProductList().subscribe((res) => {
      expect(res).toEqual(expectedResult)
    })

    const req = httpMock.expectOne("https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products")

    req.flush(mockServerResponse)
  })

  it("should be return true if item already exists", () => {
    httpMock.verify()

    const responseMock = true

    const itemIdTest = "asdxx"

    const expectedResult = true

    service.alreadyExists(itemIdTest).subscribe((res) => {
      expect(res).toEqual(expectedResult)
    })

    const req = httpMock.expectOne(`https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products/verification?id=${itemIdTest}`)

    req.flush(responseMock)
  })

  it("should be return product if was created", () => {
    httpMock.verify()

    const responseMock = {
      id: "newTest",
      name: "testttttt",
      description: "tettttttttttttttttttt",
      logo: "teast",
      date_release: "2023-10-22T00:00:00.000+00:00",
      date_revision: "2024-10-22T00:00:00.000+00:00"
    }

    const itemTest = {
      id: "newTest",
      name: "testttttt",
      description: "tettttttttttttttttttt",
      logo: "teast",
      dateRelease: "2023-10-22",
      dateRevision: "2024-10-22"
    }

    const expectResult = {
      id: "newTest",
      name: "testttttt",
      description: "tettttttttttttttttttt",
      logo: "teast",
      date_release: "2023-10-22T00:00:00.000+00:00",
      date_revision: "2024-10-22T00:00:00.000+00:00"
    }

    service.createProduct(itemTest as unknown as ProductModel).subscribe((res) => {
      expect(res).toEqual(expectResult)
    })

    const req = httpMock.expectOne(`https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products`)

    req.flush(responseMock)
  })

  it("should be return product if was updated", () => {
    httpMock.verify()

    const responseMock = {
      id: "newTest",
      name: "testttttt",
      description: "tettttttttttttttttttt",
      logo: "teast",
      date_release: "2023-10-22T00:00:00.000+00:00",
      date_revision: "2024-10-22T00:00:00.000+00:00"
    }

    const itemTest = {
      id: "newTest",
      name: "testttttt",
      description: "tettttttttttttttttttt",
      logo: "teast",
      dateRelease: "2023-10-22",
      dateRevision: "2024-10-22"
    }

    const expectResult = {
      id: "newTest",
      name: "testttttt",
      description: "tettttttttttttttttttt",
      logo: "teast",
      date_release: "2023-10-22T00:00:00.000+00:00",
      date_revision: "2024-10-22T00:00:00.000+00:00"
    }

    service.updateProduct(itemTest as unknown as ProductModel).subscribe((res) => {
      expect(res).toEqual(expectResult)
    })

    const req = httpMock.expectOne(`https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products`)

    req.flush(responseMock)
  })

  it("should be return true if item was deleted", () => {
    httpMock.verify()

    const responseMock = true

    const itemIdTest = "asdxx"

    const expectedResult = true

    service.deleteProduct(itemIdTest).subscribe((res) => {
      expect(res).toEqual(expectedResult)
    })

    const req = httpMock.expectOne(`https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products?id=${itemIdTest}`)

    req.flush(responseMock)
  })
});
