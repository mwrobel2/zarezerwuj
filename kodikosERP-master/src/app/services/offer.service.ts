import { Injectable } from '@angular/core';
import { Offer } from '../models/offer.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Decoded } from '../models/decoded.model';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private offers: Offer[] = [];
  // private offersUpdated = new Subject<Offer[]>();
  private offersUpdated = new Subject<{
    offers: Offer[];
    offersCount: number;
    decoded: Decoded
  }>();

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  // GET ALL OFFERS
  getOffers(
    offersPerPage: number,
    currentPage: number,
    searchValues: any
  ) {
    // pagination
    let queryParams = `?pagesize=${offersPerPage}&page=${currentPage}`;

    // search
    if (searchValues.shortName) {
      queryParams += `&shortName=${searchValues.shortName}`;
    }
    if (searchValues.nip) {
      queryParams += `&nip=${searchValues.nip}`;
    }

    // zwracam kopię tablicy 'kontrahenci' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.assortments];

    // httpClient is generic type so we state that we will get aray of offers
    this.http
      .get<{
        message: string;
        offers: Offer[];
        maxOffers: number;
        decoded: Decoded;
      }>(environment.apiUrl + '/offer' + queryParams)
      // I am using pipe to change id na _id
      .pipe(
        map(offersData => {
          return {
            offers: offersData.offers.map(offer => {
            if (typeof offer.addBy === 'undefined') {
              offer.addBy = {};
            }
            if (typeof offer.modBy === 'undefined') {
              offer.modBy = {};
            }
            return {
              id: offer._id,
              data: offer.data,
              creator: offer.creator,
              termsOfPayment: offer.termsOfPayment,
              deliveryType: offer.deliveryType,
              labelling: offer.labelling,
              packing: offer.packing,
              // atest
              certificate: offer.certificate,
              // wykonanie
              realization: offer.realization,
              // tolerancja wykonania
              engeneeringTolerance: offer.engeneeringTolerance,
              // pochodzenie towaru
              origin: offer.origin,
              // uwagi
              comments: offer.comments,
              items: offer.items,
              currency: offer.currency,
              project: offer.project,
              company: offer.company,
              contractor: {
                shortName: offer.contractor.shortName,
                fullName: offer.contractor.fullName,
                nip: offer.contractor.nip
              },
              addDate: new Date(offer.addDate),
              modDate: new Date(offer.modDate),
              addBy: {
                login: offer.addBy.login,
                name: offer.addBy.name,
                surname: offer.addBy.surname,
                email: offer.addBy.email
              },
              modBy: {
                login: offer.modBy.login,
                name: offer.modBy.name,
                surname: offer.modBy.surname,
                email: offer.modBy.email
              }
            };
          }),
          maxOffers: offersData.maxOffers,
          decoded: offersData.decoded
        };
        })
      )
      .subscribe(transformedOffers => {
        // this function gets data
        // positive case
        this.offers = transformedOffers.offers;
        // this.offersUpdated.next([...this.offers]);
        this.offersUpdated.next({
          offers: [...this.offers],
          offersCount: transformedOffers.maxOffers,
          decoded: transformedOffers.decoded
        });
      });
  }

  // I am listening to subject of offersUpdated
  getOffersUpdatedListener() {
    return this.offersUpdated.asObservable();
  }

  // ADDING an Offer
  addOffer(offerData: Offer) {
    const offer: Offer = {
      id: null,
      data: offerData.data,
      creator: offerData.creator,
      termsOfPayment: offerData.termsOfPayment,
      deliveryType: offerData.deliveryType,
      labelling: offerData.labelling,
      packing: offerData.packing,
      // atest
      certificate: offerData.certificate,
      // wykonanie
      realization: offerData.realization,
      // tolerancja wykonania
      engeneeringTolerance: offerData.engeneeringTolerance,
      // pochodzenie towaru
      origin: offerData.origin,
      // uwagi
      comments: offerData.comments,
      currency: offerData.currency,
      project: offerData.project,
      company: offerData.company,
      items: offerData.items,
      contractor: offerData.contractor
    };

    // I'm sending data to node server
    this.http
      .post<{ message: string; offerId: string }>(
        environment.apiUrl + '/offer',
        offer
      )
      .subscribe(responseData => {
        // // console.log(responseData.message);
        // const id = responseData.offerId;
        // offer.id = id;
        // this.offers.push(offer);
        // // I'm emitting a new vlue to contractorsUpdated
        // // as a copy of contractors table
        // this.offersUpdated.next([...this.offers]);
        this.router.navigate(['/lazy/offer']);
      });
  }

  // GET SINGLE OFFER
  getOffer(id: string) {
    // I'm getting an offer from local array of offers
    // return {...this.offers.find(c => c.id === id)};

    // I'm getting an offer from database
    // return this.http.get<{ _id: string }>(environment.apiUrl + '/offer/' + id);
    return this.http.get<{ offer: Offer; decoded: Decoded }>(environment.apiUrl + '/offer/' + id);
  }

  // UPDATE AN OFFER
  updateOffer(id: string, offerData: Offer) {
    const offer: Offer = offerData;
    this.http
      .put(environment.apiUrl + '/offer/' + id, offer)
      .subscribe(response => {
        this.router.navigate(['/lazy/offer']);
      });
  }

  deleteOffer(offerId: string) {
    return this.http.delete(environment.apiUrl + '/offer/' + offerId);
    // .subscribe(() => {
    //   const updatedOffers = this.offers.filter(offer => offer.id !== offerId);
    //   this.offers = updatedOffers;
    //   this.offersUpdated.next([...this.offers]);
    // });
  }
}
