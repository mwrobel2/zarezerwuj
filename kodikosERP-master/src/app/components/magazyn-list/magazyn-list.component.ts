import { Component, OnInit, OnDestroy } from '@angular/core';
import { Warehouse } from '../../models/magazyn.model';
import { WarehouseService } from '../../services/magazyn.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { PageEvent } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Warehouseform } from '../../models/formatki/warehouseform.model';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { environment } from '../../../environments/environment';
import { PlikiService } from '../../services/pliki.service';

@Component({
  selector: 'app-magazyn-list',
  templateUrl: './magazyn-list.component.html',
  styleUrls: ['./magazyn-list.component.scss']
})
export class MagazynListComponent implements OnInit, OnDestroy {


  warehouses: Warehouse[] = [];
  private warehouseSub: Subscription;

  public zalogowanyUser: Subscription;
  userIsAuthenticated = false;

  public loggedInUser: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null,
    moduly: null,
    contractorFields: null,
    szkodliwaFields: null,
    warehouseFields: null
  };

  totalWarehouses = 0;
  warehousePerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];

  plikiKolumny: string[];

  private searchValues = {
    fullName: '',
    comments: '',
    accountManagerLogin: '',
    rodzajTowaru: '',
    itemNumber: '',
    warehouseLocation: ''
  };

  warehouse = {
    fullName: '',
    comments: '',
    rodzajTowaru: '',
    itemNumber: '',
    warehouseLocation: ''
  };

  isLoading = false;

  // I declare displayed fields
  dispFields: Warehouseform = {
    comments: false,
    status: false,
    buttonDodajKontr: false,
    buttonEdytujKontr: false,
    buttonUsunKontr: false,
    widziWszystkie: false,
    firmy: false,
    projekty: false,
    pliki: false,
    buttonPliki: false
  };
  backendUrl = environment.backendUrl;

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public warehouseService: WarehouseService,
    private router: Router,
    private plikiService: PlikiService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      user => {
        this.loggedInUser = user;
        if (typeof this.loggedInUser !== 'undefined' && this.loggedInUser.moduly !== null
          && typeof this.loggedInUser.moduly !== 'undefined') {
          this.userIsAuthenticated = true;
          this.dispFields = this.loggedInUser.warehouseFields;

          if (!this.dispFields.widziWszystkie) {
            this.searchValues.accountManagerLogin = this.loggedInUser.login;
          }
          // po zweryfikowaniu usera pobieram pliki z bazy
          this.warehouseService.getWarehouses(
            this.warehousePerPage,
            this.currentPage,
            this.searchValues
          );
        }
      },
      error => {
        this.router.navigate(['/login']);
      });

    this.warehouseSub = this.warehouseService
      .getWarehousesUpdatedListener()
      .subscribe(
        (warehouseData: {
          warehouses: Warehouse[];
          warehousesCount: number;
        }) => {
          this.isLoading = false;
          this.totalWarehouses = warehouseData.warehousesCount;
          this.warehouses = warehouseData.warehouses;
        }
      );


    this.plikiKolumny = [
      'name',
      'rodzaj',
    ];
  }

  powrot() {
    window.history.go(-1);
  }

  onDelete(warehouseId: string, pliki: any) {
    if (confirm('Czy na pewno usunąć informację z magazynu?')) {
      let liczbaPlikow = pliki.length;


      if (pliki.length > 0) {
        pliki.forEach((plik: { fileName: string, katalog: string }) => {
          this.plikiService.ksujPlik(plik.fileName, plik.katalog).subscribe((res: { usuniety: string }) => {
            liczbaPlikow--;
            //  nawet jeżeli z jakichś powodów pliku nie dało się usunąć
            // if (res.usuniety === 'ok' && liczbaPlikow <= 0) {
            if (liczbaPlikow <= 0) {
              this.isLoading = true;
              this.warehouseService.deleteWarehouse(warehouseId).subscribe(() => {
                this.warehouseService.getWarehouses(
                  this.warehousePerPage,
                  this.currentPage,
                  this.searchValues
                );
              });
            }
          });
        });
      } else {
        // nie było plików do usunięcia więc usuwam wpis z bazy
        this.isLoading = true;
        this.warehouseService.deleteWarehouse(warehouseId).subscribe(() => {
          this.warehouseService.getWarehouses(
            this.warehousePerPage,
            this.currentPage,
            this.searchValues
          );
        });
      }
    }
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      this.logowanierejestracjaService.logout().subscribe(
        data => { this.router.navigate(['/']); },
        error => console.error(error)
      );
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.warehousePerPage = pageData.pageSize;
    this.warehouseService.getWarehouses(
      this.warehousePerPage,
      this.currentPage,
      this.searchValues
    );
  }

  onSearchWarehouse(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.searchValues = {
      fullName: form.value.fullName,
      comments: form.value.comments,
      accountManagerLogin: null,
      rodzajTowaru: form.value.rodzajTowaru,
      itemNumber: form.value.itemNumber,
      warehouseLocation: form.value.warehouseLocation
    };
    if (!this.dispFields.widziWszystkie) {
      this.searchValues.accountManagerLogin = this.loggedInUser.login;
    }
    this.currentPage = 1;
    this.warehouseService.getWarehouses(
      this.warehousePerPage,
      this.currentPage,
      this.searchValues
    );
    this.warehouseSub = this.warehouseService
      .getWarehousesUpdatedListener()
      .subscribe(
        (warehouseData: {
          warehouses: Warehouse[];
          warehousesCount: number;
        }) => {
          // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKICH KONTRAKTORÓW W TEN SPOSÓB ....
          this.isLoading = false;
          this.totalWarehouses = warehouseData.warehousesCount;
          this.warehouses = warehouseData.warehouses;
        }
      );
  }

  clearForm(form: NgForm) {
    this.warehouse.fullName = '';
    this.warehouse.comments = '';
    this.warehouse.rodzajTowaru = '';
    this.warehouse.itemNumber = '';
    this.warehouse.warehouseLocation = '';
  }

  utworzNaWzor(id: string) {
    this.router.navigate(['/warehousecreate', { warehouseId: id, nowy: 'tak' }]);
  }

  ngOnDestroy(): void {
    this.warehouseSub.unsubscribe();
    this.zalogowanyUser.unsubscribe();
  }
}


