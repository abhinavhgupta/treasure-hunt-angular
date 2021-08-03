import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TreasueHuntRequest } from "../model/treasure-hunt.model";

const SERVICE_URL="http://localhost:8080"

@Injectable({
    providedIn:'root'
})
export class TreasureHuntService{
   public constructor(private _http: HttpClient){
   }

   public getTreasureHunt(treasueHuntRequest: TreasueHuntRequest): Observable<any>{
      return this._http.post(`${SERVICE_URL}/hunt`,treasueHuntRequest);
   }
}