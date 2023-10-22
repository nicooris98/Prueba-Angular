import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { ProductModel } from "../models/product.model";
import { IAPIResults } from "../interfaces/api-result.interface";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private headers = new HttpHeaders().set("authorId", "1")

  constructor(private httpClient: HttpClient) { }

  public getProductList(): Observable<IAPIResults<ProductModel[]>> {
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
      }) as unknown as IAPIResults<ProductModel[]>))
  }
}
