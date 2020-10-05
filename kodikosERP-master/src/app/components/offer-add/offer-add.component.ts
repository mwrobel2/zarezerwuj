import { Component, OnInit, ViewChild } from '@angular/core';
import { Offer } from '../../models/offer.model';
import { NgForm } from '@angular/forms';
import { OfferService } from '../../services/offer.service';
import { Dictionary } from '../../models/slownik.model';
import { DictionaryService } from '../../services/slowniki.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ContractorsService } from '../../services/kontrahenci.service';
import * as zmienne from '../../models/zmienne.json';
import { MatTableDataSource } from '@angular/material/table';
import { Warehouse } from '../../models/magazyn.model';
import { WarehouseService } from '../../services/magazyn.service';
import { MatPaginator } from '@angular/material/paginator';
import { Offerform } from '../../models/formatki/offerform.model';
import { Decoded } from 'src/app/models/decoded.model';

@Component({
  selector: 'app-offer-add',
  templateUrl: './offer-add.component.html',
  styleUrls: ['./offer-add.component.scss']
})
export class OfferAddComponent implements OnInit {

  // decoded - decoded info about name, surname from JWT
  decoded: Decoded = {
    login: '',
    userId: '',
    name: '',
    surname: '',
    email: '',
    iat: null,
    exp: null
  };
  private mode = 'create';
  private offerId: string;
  private idKontrahenta: string;
  public posFromHand = false;
  public posFromWarehouse = false;
  public goodsDataSource: any;
  displayedColumns: string[];
  public warehouseSub: Subscription;
  warehouse: Warehouse[] = [];
  // public warehouseItems: any = null;
  warehouseItems = new MatTableDataSource<Warehouse>();
  dispColWarehouse: string[];

  public loggedInUser2: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null,
    moduly: null
  };

  public loggedInUserSub: Subscription;
  public loggedInUser: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null
  };

  offer: Offer = {
    data: new Date(),
    creator: this.loggedInUser2.name + ' ' + this.loggedInUser2.surname,
    termsOfPayment: '',
    deliveryType: '',
    labelling: '',
    packing: '',
    // atest
    certificate: '',
    // wykonanie
    // realization: '',
    // tolerancja wykonania
    engeneeringTolerance: '',
    // pochodzenie towaru
    origin: '',
    // uwagi
    comments: '',
    project: '',
    company: '',
    items: [{}],
    contractor: { shortName: null, fullName: null, nip: null },
    currency: 'PLN',
    item: {
      id: null,
      name: null,
      priceNetSell: null,
      vat: zmienne.defaultVAT,
      priceGrossSell: null
    }
  };

  dispFields: Offerform = {
    data: true,
    creator: true,
    termsOfPayment: true,
    deliveryType: true,
    labelling: true,
    packing: true,
    certificate: true,
    realization: true,
    engeneeringTolerance: true,
    origin: true,
    comments: true,
    contractor: true,
    addDate: true,
    modDate: true,
    addBy: true,
    modBy: true,
    items: true,
    contractorShortName: true,
    contractorFullName: true,
    contractorNIP: true,
    currency: true,
    project: true,
    company: true
  };

  // towary: [{name?: string, priceNetSell?: number, vat?: number, priceGrossSell?: number}] = [{}];

  dictionaries: Dictionary[] = [
    {
      name: null
    }
  ];

  private authListenerSub: Subscription;
  userIsAuthenticated = true;

  constructor(
    private offerService: OfferService,
    private dictionaryService: DictionaryService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private contractorsService: ContractorsService,
    private warehouseService: WarehouseService
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.offer.item.priceGrossSell = this.offer.item.priceNetSell;
    this.loggedInUser2 = this.authService.getZalogowany();
    this.offer.creator = '';
    // I'm checkin parameters of URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('offerId')) {
        // it means that we are in edit mode
        this.mode = 'edit';
        this.offerId = paramMap.get('offerId');
        // I'm getting data about single offer
        this.offerService.getOffer(this.offerId)
          .subscribe(
            (offerData: { offer: Offer; decoded: Decoded }) => {
              this.offer = offerData.offer;
              delete this.offer._id;
              this.offer.id = offerData.offer._id;
              this.decoded = offerData.decoded;
            });
      } else if (paramMap.has('contractorId')) {
        this.mode = 'addFromContractors';
        this.idKontrahenta = this.route.snapshot.paramMap.get('contractorId');

        this.contractorsService
          .getContractor(this.idKontrahenta)
          .subscribe(response => {
            this.offer.contractor.shortName = response.contractor.shortName;
            this.offer.contractor.fullName = response.contractor.fullName;
            this.offer.contractor.nip = response.contractor.nip;
          });
      } else {
        this.mode = 'create';
        this.offerId = null;
      }
    });

    // I'm checking if user is authenticated
    // this.userIsAuthenticated = this.authService.getIsAuth();
    // I'm setting up an subscription to authStatusListener
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        // console.log('authenticated www', isAuthenticated);
        this.userIsAuthenticated = isAuthenticated;
      });

    // Checking user name and surname
    this.loggedInUserSub = this.authService
      .getLoggedInUserListener()
      .subscribe(loggedUser => {
        this.loggedInUser = loggedUser;
      });
    this.loggedInUser.name = sessionStorage.getItem('KODuserName');
    this.loggedInUser.surname = sessionStorage.getItem('KODuserSurname');

    this.displayedColumns = [
      'name',
      'priceNetSell',
      'vat',
      'priceGrossSell',
      'action'
    ];

    this.dispColWarehouse = ['shortName', 'pricePurchase', 'action'];

    this.getDictionary('kontrahentWaluty', 1);
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      console.log('wylogowany');
    }
  }

  powrot() {
    window.history.go(-1);
  }

  fromHand() {
    this.posFromHand = !this.posFromHand;
    this.offer.item = {
      id: null,
      name: null,
      priceNetSell: null,
      vat: zmienne.defaultVAT,
      priceGrossSell: null
    };
  }

  fromWarehouse() {
    this.posFromWarehouse = !this.posFromWarehouse;
    this.offer.item = {
      id: null,
      name: null,
      priceNetSell: null,
      vat: zmienne.defaultVAT,
      priceGrossSell: null
    };
    this.warehouseService.getWarehouse(this.offerId);
    this.warehouseSub = this.warehouseService
      .getWarehousesUpdatedListener()
      .subscribe((warehouses) => {
        this.warehouseItems.paginator = this.paginator;
        this.warehouseItems.data = warehouses.warehouses;
      });
  }

  obliczBrutto() {
    this.offer.item.priceGrossSell =
      Math.round(
        (this.offer.item.priceNetSell +
          (this.offer.item.priceNetSell * this.offer.item.vat) / 100) *
        100
      ) / 100;
  }

  obliczNetto() {
    this.offer.item.priceNetSell =
      Math.round(
        ((this.offer.item.priceGrossSell * 100) / (100 + this.offer.item.vat)) *
        100
      ) / 100;
  }

  obliczNettoBrutto() {
    if (this.offer.item.priceNetSell) {
      this.offer.item.priceGrossSell =
        Math.round(
          (this.offer.item.priceNetSell +
            (this.offer.item.priceNetSell * this.offer.item.vat) / 100) *
          100
        ) / 100;
    }
  }

  addItem() {
    if (typeof this.offer.items[0].name === 'undefined') {
      this.offer.items[0].id = Date.now();
      this.offer.items[0].name = this.offer.item.name;
      this.offer.items[0].priceGrossSell = this.offer.item.priceGrossSell;
      this.offer.items[0].priceNetSell = this.offer.item.priceNetSell;
      this.offer.items[0].vat = this.offer.item.vat;
    } else {
      this.offer.item.id = Date.now();
      this.offer.items.push(this.offer.item);
    }
    this.offer.item = {
      id: null,
      name: null,
      priceNetSell: null,
      priceGrossSell: null,
      vat: zmienne.defaultVAT
    };
    this.goodsDataSource = new MatTableDataSource(this.offer.items);
  }

  onSaveOffer(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const offer: Offer = {
      data: new Date(),
      creator: this.loggedInUser2.name + ' ' + this.loggedInUser2.surname,
      termsOfPayment: form.value.termsOfPayment,
      deliveryType: form.value.deliveryType,
      labelling: form.value.labelling,
      packing: form.value.packing,
      // atest
      certificate: form.value.certificate,
      // wykonanie
      // realization: form.value.realization,
      // tolerancja wykonania
      engeneeringTolerance: form.value.engeneeringTolerance,
      // pochodzenie towaru
      origin: form.value.origin,
      // uwagi
      comments: form.value.comments,
      items: this.offer.items,
      currency: form.value.currency,
      project: form.value.project,
      company: form.value.company,
      contractor: {
        shortName: form.value.shortName,
        fullName: form.value.fullName,
        nip: form.value.nip
      }
    };

    if (this.mode === 'create') {
      this.offerService.addOffer(offer);
    } else if (this.mode === 'addFromContractors') {
      this.offerService.addOffer(offer);
    } else {
      this.offerService.updateOffer(this.offerId, offer);
    }
  }

  deleteCommodity(element) {
    if (this.offer.items.length === 1) {
      const el = {
        id: null,
        name: null,
        priceNetSell: null,
        vat: zmienne.defaultVAT,
        priceGrossSell: null
      };
      this.offer.item = el;
      this.offer.items.splice(this.offer.items.indexOf(element), 1);
      const el2 = {};
      this.offer.items.push(el2);
    } else {
      this.offer.items.splice(this.offer.items.indexOf(element), 1);
      this.goodsDataSource = new MatTableDataSource(this.offer.items);
    }
  }

  editCommodity(element) {
    if (
      typeof this.offer.item.name !== 'undefined' &&
      typeof this.offer.item.name
    ) {
      this.offer.item.name = element.name;
    }
    if (
      typeof this.offer.item.priceNetSell !== 'undefined' &&
      typeof this.offer.item.priceNetSell
    ) {
      this.offer.item.priceNetSell = element.priceNetSell;
    }
    if (
      typeof this.offer.item.priceGrossSell !== 'undefined' &&
      typeof this.offer.item.priceGrossSell
    ) {
      this.offer.item.priceGrossSell = element.priceGrossSell;
    }
    if (
      typeof this.offer.item.vat !== 'undefined' &&
      typeof this.offer.item.vat
    ) {
      this.offer.item.vat = element.vat;
    }
    this.deleteCommodity(element);
  }

  getDictionary(name: string, index: number) {
    return (
      this.dictionaryService
        .getDictionaryName(name)
        .subscribe(dictionaryData => {
          this.dictionaries[index] = dictionaryData;
          delete this.dictionaries[index]._id;
          this.dictionaries[index].id = dictionaryData._id;
        })
    );
  }
}
