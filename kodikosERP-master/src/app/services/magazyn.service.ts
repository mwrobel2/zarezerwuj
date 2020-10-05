import { Injectable } from '@angular/core';
import { Warehouse } from '../models/magazyn.model';
import { Decoded } from '../models/decoded.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private warehouses: Warehouse[] = [];
  private warehousesUpdated = new Subject<{
    warehouses: Warehouse[];
    warehousesCount: number;
    decoded: Decoded;
  }>();

  constructor(private router: Router, private http: HttpClient) { }

  // GETS ALL ASSORTMENT
  getWarehouses(
    warehousesPerPage: number,
    currentPage: number,
    searchValues: any
  ) {
    // for pagination
    let queryParams = `?pagesize=${warehousesPerPage}&page=${currentPage}`;
    // search
    if (searchValues.fullName) {
      queryParams += `&fname=${searchValues.fullName}`;
    }
    if (searchValues.comments) {
      queryParams += `&comments=${searchValues.comments}`;
    }
    if (searchValues.rodzajTowaru) {
      queryParams += `&rodzajTowaru=${searchValues.rodzajTowaru}`;
    }
    if (searchValues.warehouseLocation) {
      queryParams += `&warehouseLocation=${searchValues.warehouseLocation}`;
    }
    if (searchValues.itemNumber) {
      queryParams += `&itemNumber=${searchValues.itemNumber}`;
    }
    if (searchValues.accountManagerLogin) {
      queryParams += `&accountManagerLogin=${searchValues.accountManagerLogin}`;
    }

    // zwracam kopię tablicy 'kontrahenci' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.warehouses];

    // httpClient is generic type so we state that we will get aray of warehouses
    this.http
      .get<{
        message: string;
        warehouses: Warehouse[];
        maxWarehouses: number;
        decoded: Decoded;
      }>(environment.apiUrl + '/warehouse' + queryParams, {
        withCredentials: true
      })
      // I am using pipe to change id na _id
      .pipe(
        map(warehousesData => {
          return {
            warehouses: warehousesData.warehouses.map(warehouse => {
              if (typeof warehouse.addBy === 'undefined') {
                warehouse.addBy = {};
              }
              if (typeof warehouse.modBy === 'undefined') {
                warehouse.modBy = {};
              }
              return {
                id: warehouse._id,
                fullName: warehouse.fullName,
                towarOpis: warehouse.towarOpis,
                comments: warehouse.comments,
                addDate: new Date(warehouse.addDate),
                modDate: new Date(warehouse.modDate),
                accountManager: warehouse.accountManager,
                accountManagerLogin: warehouse.accountManagerLogin,
                addBy: {
                  login: warehouse.addBy.login,
                  name: warehouse.addBy.name,
                  surname: warehouse.addBy.surname,
                  email: warehouse.addBy.email
                },
                modBy: {
                  login: warehouse.modBy.login,
                  name: warehouse.modBy.name,
                  surname: warehouse.modBy.surname,
                  email: warehouse.modBy.email
                },
                jednostka: warehouse.jednostka,
                wysokosc: warehouse.wysokosc,
                dlugosc: warehouse.dlugosc,
                szerokosc: warehouse.szerokosc,
                liczba: warehouse.liczba,
                supplier: warehouse.supplier,
                status: warehouse.status,
                firms: warehouse.firms,
                projects: warehouse.projects,
                pliki: warehouse.pliki,
                rodzajTowaru: warehouse.rodzajTowaru,
                idAsortymentu: warehouse.idAsortymentu,
                warehouseLocation: warehouse.warehouseLocation,
                gatunek: warehouse.gatunek,
                atest: warehouse.atest,
                odbior: warehouse.odbior,
                regal: warehouse.regal,
                polka: warehouse.polka,
                karton: warehouse.karton,
                barcode: warehouse.barcode,
                widocznyWSklepie: warehouse.widocznyWSklepie,
                itemNumber: warehouse.itemNumber,
                vat: warehouse.vat,
                cenaZakupuNetto: warehouse.cenaZakupuNetto,
                cenaHurtowaSprzedazyNetto: warehouse.cenaHurtowaSprzedazyNetto,
                cenaDetalicznaBrutto: warehouse.cenaDetalicznaBrutto,
                // cenaDetalicznaNetto: ((warehouse.cenaDetalicznaBrutto * 100) / (100 + warehouse.vat)).toFixed(2),
                cenaDetalicznaWaluta: warehouse.cenaDetalicznaWaluta,
                cenaExportEuro: warehouse.cenaExportEuro,
                cenaZakupuBrutto: warehouse.cenaZakupuBrutto,
                cenaHurtowaSprzedazyBrutto: warehouse.cenaHurtowaSprzedazyBrutto,
                cenaDetalicznaNetto: warehouse.cenaDetalicznaNetto,
                kodIndexDostawcy: warehouse.kodIndexDostawcy
              };
            }),
            maxWarehouses: warehousesData.maxWarehouses,
            decoded: warehousesData.decoded
          };
        })
      )
      .subscribe(transformedWarehousesData => {
        // this function gets data
        // positive case
        this.warehouses = transformedWarehousesData.warehouses;
        this.warehousesUpdated.next({
          warehouses: [...this.warehouses],
          warehousesCount: transformedWarehousesData.maxWarehouses,
          decoded: transformedWarehousesData.decoded
        });
      });
  }

  // GET ASSORTMENTS WITH SPECIFIC TYPE
  getWarehousesType(assortType: string) {
    // return this.http.get<{ type: string }>(
    //   environment.apiUrl + '/warehouses/type/' + type
    // );

    return this.http
      .get<{
        message: string;
        warehouses: any;
        assortType: string;
        maxWarehouses: number;
        decoded: Decoded;
      }>(environment.apiUrl + '/warehouse/type/' + assortType, {
        withCredentials: true
      })
      .pipe(
        map(warehousesData => {
          // console.log(warehousesData);
          return {
            warehouses: warehousesData.warehouses.map(warehouse => {
              return {
                id: warehouse._id,
                fullName: warehouse.fullName,
                towarOpis: warehouse.towarOpis,
                comments: warehouse.comments,
                addDate: new Date(warehouse.addDate),
                modDate: new Date(warehouse.modDate),
                accountManager: warehouse.accountManager,
                accountManagerLogin: warehouse.accountManagerLogin,
                addBy: {
                  login: warehouse.addBy.login,
                  name: warehouse.addBy.name,
                  surname: warehouse.addBy.surname,
                  email: warehouse.addBy.email
                },
                modBy: {
                  login: warehouse.modBy.login,
                  name: warehouse.modBy.name,
                  surname: warehouse.modBy.surname,
                  email: warehouse.modBy.email
                },
                jednostka: warehouse.jednostka,
                wysokosc: warehouse.wysokosc,
                dlugosc: warehouse.dlugosc,
                szerokosc: warehouse.szerokosc,
                liczba: warehouse.liczba,
                supplier: warehouse.supplier,
                status: warehouse.status,
                firms: warehouse.firms,
                projects: warehouse.projects,
                pliki: warehouse.pliki,
                rodzajTowaru: warehouse.rodzajTowaru,
                idAsortymentu: warehouse.idAsortymentu,
                warehouseLocation: warehouse.warehouseLocation,
                gatunek: warehouse.gatunek,
                atest: warehouse.atest,
                odbior: warehouse.odbior,
                regal: warehouse.regal,
                polka: warehouse.polka,
                karton: warehouse.karton,
                barcode: warehouse.barcode,
                widocznyWSklepie: warehouse.widocznyWSklepie,
                itemNumber: warehouse.itemNumber,

                vat: warehouse.vat,
                cenaZakupuNetto: warehouse.cenaZakupuNetto,
                cenaHurtowaSprzedazyNetto: warehouse.cenaHurtowaSprzedazyNetto,
                cenaDetalicznaBrutto: warehouse.cenaDetalicznaBrutto,
                cenaDetalicznaWaluta: warehouse.cenaDetalicznaWaluta,
                cenaExportEuro: warehouse.cenaExportEuro,
                cenaZakupuBrutto: warehouse.cenaZakupuBrutto,
                cenaHurtowaSprzedazyBrutto: warehouse.cenaHurtowaSprzedazyBrutto,
                cenaDetalicznaNetto: warehouse.cenaDetalicznaNetto,
                kodIndexDostawcy: warehouse.kodIndexDostawcy
              };
            }),
            maxWarehouses: warehousesData.maxWarehouses,
            decoded: warehousesData.decoded
          };
        })
      )
      .subscribe(transformedWarehousesData => {
        // this function gets data
        // positive case
        this.warehouses = transformedWarehousesData.warehouses;
        this.warehousesUpdated.next({
          warehouses: [...this.warehouses],
          warehousesCount: transformedWarehousesData.maxWarehouses,
          decoded: transformedWarehousesData.decoded
        });
      });
  }

  // GET SINGLE ASSORTMENT
  getWarehouse(id: string) {
    return this.http.get<{ warehouse: Warehouse; decoded: Decoded }>(
      environment.apiUrl + '/warehouse/' + id,
      { withCredentials: true }
    );
  }

  // GET SINGLE ASSORTMENT BY NAME
  getWarehouseByName(nazwaTowaru: string) {
    // console.log('nazwaTowaruService: ', nazwaTowaru);
    return this.http.get<{ warehouse: Warehouse }>(
      environment.apiUrl + '/warehouse/name/' + nazwaTowaru,
      { withCredentials: true }
    );
  }

  // I am listening to subject of warehousesUpdated
  getWarehousesUpdatedListener() {
    return this.warehousesUpdated.asObservable();
  }

  // DODAWANIE TOWARU
  addWarehouse(warehouseData: Warehouse) {
    const warehouse: Warehouse = {
      id: null,
      fullName: warehouseData.fullName,
      towarOpis: warehouseData.towarOpis,
      comments: warehouseData.comments,
      addDate: new Date(warehouseData.addDate),
      modDate: new Date(warehouseData.modDate),
      accountManager: warehouseData.accountManager,
      accountManagerLogin: warehouseData.accountManagerLogin,
      // addBy: {
      //   login: warehouseData.addBy.login,
      //   name: warehouseData.addBy.name,
      //   surname: warehouseData.addBy.surname,
      //   email: warehouseData.addBy.email
      // },
      // modBy: {
      //   login: warehouseData.modBy.login,
      //   name: warehouseData.modBy.name,
      //   surname: warehouseData.modBy.surname,
      //   email: warehouseData.modBy.email
      // },
      jednostka: warehouseData.jednostka,
      wysokosc: warehouseData.wysokosc,
      dlugosc: warehouseData.dlugosc,
      szerokosc: warehouseData.szerokosc,
      liczba: warehouseData.liczba,
      supplier: warehouseData.supplier,
      status: warehouseData.status,
      firms: warehouseData.firms,
      projects: warehouseData.projects,
      pliki: warehouseData.pliki,
      rodzajTowaru: warehouseData.rodzajTowaru,
      idAsortymentu: warehouseData.idAsortymentu,
      warehouseLocation: warehouseData.warehouseLocation,
      gatunek: warehouseData.gatunek,
      atest: warehouseData.atest,
      odbior: warehouseData.odbior,
      regal: warehouseData.regal,
      polka: warehouseData.polka,
      karton: warehouseData.karton,
      barcode: warehouseData.barcode,
      widocznyWSklepie: warehouseData.widocznyWSklepie,
      itemNumber: warehouseData.itemNumber,

      vat: warehouseData.vat,
      cenaZakupuNetto: warehouseData.cenaZakupuNetto,
      cenaHurtowaSprzedazyNetto: warehouseData.cenaHurtowaSprzedazyNetto,
      cenaDetalicznaBrutto: warehouseData.cenaDetalicznaBrutto,
      cenaDetalicznaWaluta: warehouseData.cenaDetalicznaWaluta,
      cenaExportEuro: warehouseData.cenaExportEuro,
      cenaZakupuBrutto: warehouseData.cenaZakupuBrutto,
      cenaHurtowaSprzedazyBrutto: warehouseData.cenaHurtowaSprzedazyBrutto,
      cenaDetalicznaNetto: warehouseData.cenaDetalicznaNetto,
      kodIndexDostawcy: warehouseData.kodIndexDostawcy
    };

    // I'm sending data to node server
    this.http
      .post<{ message: string; warehouseId: string; plikSciezka: string }>(
        environment.apiUrl + '/warehouse',
        warehouse,
        { withCredentials: true }
      )
      .subscribe(responseData => {
        if (responseData.message === 'Warehouse exist') {
          alert(`Taki towar już jest w bazie.`);
        } else {
          this.router.navigate(['/warehouselist']);
        }
      });
  }

  // UPDATE A ASSORTMENT
  updateWarehouse(id: string, warehouseData: Warehouse) {
    const warehouse: Warehouse = warehouseData;
    this.http
      .put<{ message: string; }>(environment.apiUrl + '/warehouse/' + id, warehouse, {
        withCredentials: true
      })
      .subscribe(response => {
        if (response.message === 'Warehouse exist') {
          alert(`Taki towar już jest w bazie.`);
        } else {
          this.router.navigate(['/warehouselist']);
        }
      });
  }

  // DELETE AN ASSORTMENT
  deleteWarehouse(warehouseId: string) {
    return this.http.delete(
      environment.apiUrl + '/warehouse/' + warehouseId,
      { withCredentials: true }
    );
  }
}
