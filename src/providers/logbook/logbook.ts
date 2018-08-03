import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the LogbookProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LogbookProvider {

  public blackspots: any;

  constructor(
    public http: HttpClient
  ) {
    console.log('Hello LogbookProvider Provider');

    this.blackspots = [
      {
        "type": "pothole",
        "list": [
          {
            "lat": 48.888318,
            "long": 2.2449226
          },
          {
            "lat": 48.889355,
            "long": 2.2437367
          },
          {
            "lat": 48.887651,
            "long": 2.2474277
          }
        ]
      },
      {
        "type": "roadblock",
        "list": [
          {
            "lat": 48.888208,
            "long": 2.2457807
          }
        ]
      },
      {
        "type": "uturn",
        "list": [
          {
            "lat": 48.890395,
            "long": 2.2455433
          }
        ]
      }];


  }

}
