import { Component, OnInit, OnDestroy } from '@angular/core';
import { Offer } from '../../models/offer.model';
import { OfferService } from '../../services/offer.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Offerform } from '../../models/formatki/offerform.model';
import { NgForm } from '@angular/forms';
import { Decoded } from 'src/app/models/decoded.model';


@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit, OnDestroy {
  offers: Offer[] = [];
  private offersSub: Subscription;
  private authListenerSub: Subscription;
  userIsAuthenticated = false;
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

  decoded: Decoded = {
    login: '',
    userId: '',
    name: '',
    surname: '',
    email: '',
    iat: null,
    exp: null
  };

  totalOffers = 0;
  offersPerPage = 10;
  pageSizeOptions = [2, 5, 10, 50, 100];
  dataSource: any;
  displayedColumns: string[];

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
    currency: true
  };

  offer = {
    contractor: { shortName: '', fullName: '', nip: '' },
  };

  private searchValues = {
    fullName: '',
    shortName: '',
    nip: '',
  };

  currentPage = 1;
  isLoading = false;


  constructor(
    public offerService: OfferService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loggedInUser2 = this.authService.getZalogowany();
    // I'm checking if user is authenticated
    this.userIsAuthenticated = this.authService.getIsAuth();

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
        // console.log(this.loggedInUser);
      });
    this.loggedInUser.name = sessionStorage.getItem('KODuserName');
    this.loggedInUser.surname = sessionStorage.getItem('KODuserSurname');

    this.offerService.getOffers(
      this.offersPerPage,
      this.currentPage,
      this.searchValues
    );

    this.displayedColumns = [
      'data',
      'creator',
      'termsOfPayment',
      'deliveryType',
      'labelling',
      'packing',
      'certificate',
      // 'realization',
      'engeneeringTolerance',
      'origin',
      'comments',
      'action'
    ];

    this.offersSub = this.offerService
      .getOffersUpdatedListener()
      .subscribe(
        (offersData: {
          offers: Offer[];
          offersCount: number;
          decoded: Decoded;
        }) => {
          // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKIE OFERTY W TEN SPOSÓB ....
          // console.log('contractors get', contractors);
          this.isLoading = false;
          this.totalOffers = offersData.offersCount;
          this.offers = offersData.offers;
          this.decoded = offersData.decoded;
          // this.dataSource = offers;
        });
  }

  ngOnDestroy(): void {
    this.offersSub.unsubscribe();
    this.authListenerSub.unsubscribe();
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      this.router.navigate(['/']);
    }
  }

  powrot() {
    window.history.go(-1);
  }

  onDelete(offerId: string) {
    if (confirm('Czy napewno usunąć tą ofertę?')) {
      this.isLoading = true;
      this.offerService.deleteOffer(offerId).subscribe(() => {
        this.offerService.getOffers(
          this.offersPerPage,
          this.currentPage,
          this.searchValues
        );
      });
    }
  }

  onSearchOffer(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // console.log(form.value.nazwaPelna);
    this.searchValues = {
      fullName: form.value.nazwaPelna,
      shortName: form.value.nazwaKrotka,
      nip: form.value.nip,
    };
    this.currentPage = 1;
    this.offerService.getOffers(
      this.offersPerPage,
      this.currentPage,
      this.searchValues
    );
    this.offersSub = this.offerService
      .getOffersUpdatedListener()
      .subscribe(
        (offersData: {
          offers: Offer[];
          offersCount: number;
        }) => {
          // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKICH KONTRAKTORÓW W TEN SPOSÓB ....
          // console.log('contractors get', contractors);
          this.isLoading = false;
          this.totalOffers = offersData.offersCount;
          this.offers = offersData.offers;
        }
      );
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    // console.log(pageData);
    this.currentPage = pageData.pageIndex + 1;
    this.offersPerPage = pageData.pageSize;
    this.offerService.getOffers(
      this.offersPerPage,
      this.currentPage,
      this.searchValues
    );
  }

  clearForm(form: NgForm) {
    this.offer.contractor.nip = '';
    this.offer.contractor.shortName = '';
    this.offer.contractor.fullName = '';
  }
}
