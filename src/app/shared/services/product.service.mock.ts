import { of } from "rxjs"

export class ProductServiceMock {
  public getProductList() {
    return of(
      {
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
          },
          {
            id: "testtt2",
            name: "testttttt",
            description: "tettttttttttttttttttt",
            logo: "teast",
            dateRelease: "2023-10-22T00:00:00.000+00:00",
            dateRevision: "2024-10-22T00:00:00.000+00:00"
          },
        ]
      })
  }

  public deleteProduct(productId: string) {
    //return of(false)
    return of(true)
  }

  public createProduct(product) {
    return of({
      id: "asdxx",
      name: "nombrecito1",
      description: "descripcion1",
      logo: "logonuevo",
      dateRelease: "2023-10-23T00:00:00.000+00:00",
      dateRevision: "2024-10-23T00:00:00.000+00:00"
    })
  }

  public updateProduct(product) {
    return of({
      id: "asdxx",
      name: "nombrecito1",
      description: "descripcion1",
      logo: "logonuevo",
      dateRelease: "2023-10-23T00:00:00.000+00:00",
      dateRevision: "2024-10-23T00:00:00.000+00:00"
    })
  }

  public alreadyExists(productId) {
    return of(false)
  }
}