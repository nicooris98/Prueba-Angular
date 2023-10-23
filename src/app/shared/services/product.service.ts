import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http"
import { Observable, catchError, map, of, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { ProductModel } from "../models/product.model";
import { IAPIResults } from "../interfaces/api-result.interface";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private headers = new HttpHeaders().set("authorId", "1")

  constructor(private httpClient: HttpClient) { }

  public getProductList(): Observable<IAPIResults<ProductModel>> {
    return this.httpClient
      .get(`${environment.apiUrl}/products`, { headers: this.headers })
      .pipe(map((results: any[]) => Object.assign({}, {
        totalRecords: results.length,
        data: results.map(item => Object.assign({}, {
          id: item.id,
          name: item.name,
          logo: item.logo,
          description: item.description,
          dateRelease: item.date_release,
          dateRevision: item.date_revision
        }))
      }) as unknown as IAPIResults<ProductModel>))
  }

  public alreadyExists(productId: string): Observable<boolean> {
    return this.httpClient
      .get<boolean>(`${environment.apiUrl}/products/verification`, { headers: this.headers, params: { id: productId } })
  }

  public createProduct(product: ProductModel): Observable<any> {
    const productJSON = {
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.dateRelease,
      date_revision: product.dateRevision
    }
    return this.httpClient
      .post(`${environment.apiUrl}/products`, productJSON, { headers: this.headers })
  }

  public updateProduct(product: ProductModel): Observable<any> {
    const productJSON = {
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.dateRelease,
      date_revision: product.dateRevision
    }
    return this.httpClient
      .put(`${environment.apiUrl}/products`, productJSON, { headers: this.headers })
  }

  public deleteProduct(productId: string): Observable<any> {
    return this.httpClient
      .delete(`${environment.apiUrl}/products`, { headers: this.headers, params: { id: productId }})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error.text == "Product successfully removed") {
            return of(true)
          }
          return of(false)
        }))
  }
}
