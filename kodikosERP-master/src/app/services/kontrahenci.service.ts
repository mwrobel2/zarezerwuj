import { Injectable } from '@angular/core';
import { Contractor } from '../models/kontrahent.model';
// decoded info about name, surname ... from JWT
import { Decoded } from '../models/decoded.model';
// 'event emitter'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractorsService {
  private contractors: Contractor[] = [];
  // I am creating an updated contractors subject
  // it is a generic type
  // I'm passing Contractor table as payload
  // it is an observer
  private contractorsUpdated = new Subject<{
    contractors: Contractor[];
    contractorsCount: number;
    decoded: Decoded;
  }>();

  constructor(private router: Router, private http: HttpClient) { }

  // GETS ALL CONTRACTORS
  getContactors(
    contractorsPerPage: number,
    currentPage: number,
    searchValues: any
  ) {
    // for pagination
    let queryParams = `?pagesize=${contractorsPerPage}&page=${currentPage}`;
    // search
    if (searchValues.fullName) {
      queryParams += `&fname=${searchValues.fullName}`;
    }
    if (searchValues.shortName) {
      queryParams += `&name=${searchValues.shortName}`;
    }
    if (searchValues.nip) {
      queryParams += `&nip=${searchValues.nip}`;
    }
    if (searchValues.comments) {
      queryParams += `&comments=${searchValues.comments}`;
    }
    if (searchValues.accountManagerLogin) {
      queryParams += `&accountManagerLogin=${searchValues.accountManagerLogin}`;
    }

    // zwracam kopię tablicy 'kontrahenci' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.contractors];

    // httpClient is generic type so we state that we will get aray of contractors
    this.http
      .get<{
        message: string;
        contractors: Contractor[];
        maxContractors: number;
        decoded: Decoded;
      }>(environment.apiUrl + '/contractors' + queryParams, { withCredentials: true })
      // I am using pipe to change id na _id
      .pipe(
        map(contractorsData => {
          // console.log(contractorsData.contractors);
          return {
            contractors: contractorsData.contractors.map(contractor => {
              if (typeof contractor.addBy === 'undefined') {
                contractor.addBy = {};
              }
              if (typeof contractor.modBy === 'undefined') {
                contractor.modBy = {};
              }
              return {
                id: contractor._id,
                contrType: contractor.contrType,
                shortName: contractor.shortName,
                fullName: contractor.fullName,
                nip: contractor.nip,
                country: contractor.country,
                city: contractor.city,
                street: contractor.street,
                postcode: contractor.postcode,
                paymentDeadline: contractor.paymentDeadline,
                creditLimit: contractor.creditLimit,
                creditLimitCurrency: contractor.creditLimitCurrency,
                comments: contractor.comments,
                ceo: contractor.ceo,
                krs: contractor.krs,
                regon: contractor.regon,
                status: contractor.status,
                balance: contractor.balance,
                addDate: new Date(contractor.addDate),
                modDate: new Date(contractor.modDate),
                accountManager: contractor.accountManager,
                accountManagerLogin: contractor.accountManagerLogin,
                addBy: {
                  login: contractor.addBy.login,
                  name: contractor.addBy.name,
                  surname: contractor.addBy.surname,
                  email: contractor.addBy.email
                },
                modBy: {
                  login: contractor.modBy.login,
                  name: contractor.modBy.name,
                  surname: contractor.modBy.surname,
                  email: contractor.modBy.email
                },
                streetShipping: contractor.streetShipping,
                cityShipping: contractor.cityShipping,
                countryShipping: contractor.countryShipping,
                postcodeShipping: contractor.postcodeShipping,
                widziCeneEuro: contractor.widziCeneEuro,
                anotherContacts: contractor.anotherContacts,
                bankAccounts: contractor.bankAccounts,
                firms: contractor.firms,
                projects: contractor.projects,
                pliki: contractor.pliki
              };
            }),
            maxContractors: contractorsData.maxContractors,
            decoded: contractorsData.decoded
          };
        })
      )
      .subscribe(transformedContractorsData => {
        // this function gets data
        // positive case
        this.contractors = transformedContractorsData.contractors;
        this.contractorsUpdated.next({
          contractors: [...this.contractors],
          contractorsCount: transformedContractorsData.maxContractors,
          decoded: transformedContractorsData.decoded
        });
      });
  }



  // GETS ALL CONTRACTORS WITHOUT PARAMS
  getContactorsSimple() {
    return this.http.get<{message: string; contractors: Contractor[]; }>(environment.apiUrl + '/contractors', { withCredentials: true });
  }

  // GET CONTRACTORS WITH SPECIFIC TYPE
  getContactorsType(contrType: string) {
    // return this.http.get<{ type: string }>(
    //   environment.apiUrl + '/contractors/type/' + type
    // );

    return this.http
      .get<{
        message: string;
        contractors: any;
        contrType: string;
        maxContractors: number;
        decoded: Decoded;
      }>(environment.apiUrl + '/contractors/type/' + contrType, { withCredentials: true })
      .pipe(
        map(contractorsData => {
          // console.log(contractorsData);
          return {
            contractors: contractorsData.contractors.map(contractor => {
              return {
                id: contractor._id,
                contrType: contractor.contrType,
                shortName: contractor.shortName,
                fullName: contractor.fullName,
                nip: contractor.nip,
                country: contractor.country,
                city: contractor.city,
                street: contractor.street,
                postcode: contractor.postcode,
                widziCeneEuro: contractor.widziCeneEuro,
                paymentDeadline: contractor.paymentDeadline,
                creditLimit: contractor.creditLimit,
                creditLimitCurrency: contractor.creditLimitCurrency,
                comments: contractor.comments,
                ceo: contractor.ceo,
                krs: contractor.krs,
                regon: contractor.regon,
                status: contractor.status
              };
            }),
            maxContractors: contractorsData.maxContractors,
            decoded: contractorsData.decoded
          };
        })
      )
      .subscribe(transformedContractorsData => {
        // this function gets data
        // positive case
        this.contractors = transformedContractorsData.contractors;
        this.contractorsUpdated.next({
          contractors: [...this.contractors],
          contractorsCount: transformedContractorsData.maxContractors,
          decoded: transformedContractorsData.decoded
        });
      });
  }

  // GET SINGLE CONTRACTOR
  getContractor(id: string) {
    // I'm getting a contractor from local array of contractors
    // return {...this.contractors.find(c => c.id === id)};

    // I'm getting a contractor from databas
    // return this.http.get<{ _id: string }>(
    return this.http.get<{ contractor: Contractor; decoded: Decoded }>(
      environment.apiUrl + '/contractors/' + id, { withCredentials: true }
    );
  }

  // I am listening to subject of contractorsUpdated
  getContractorsUpdatedListener() {
    return this.contractorsUpdated.asObservable();
  }

  // ADDING A CONTRACTOR
  // addContractor(contractorData: Contractor, plik: File) {
  addContractor(contractorData: Contractor) {
    const contractor: Contractor = {
      id: null,
      contrType: contractorData.contrType,
      shortName: contractorData.shortName,
      fullName: contractorData.fullName,
      nip: contractorData.nip,
      country: contractorData.country,
      city: contractorData.city,
      street: contractorData.street,
      postcode: contractorData.postcode,
      paymentDeadline: contractorData.paymentDeadline,
      creditLimit: contractorData.creditLimit,
      creditLimitCurrency: contractorData.creditLimitCurrency,
      comments: contractorData.comments,
      ceo: contractorData.ceo,
      krs: contractorData.krs,
      regon: contractorData.regon,
      status: contractorData.status,
      accountManager: contractorData.accountManager,
      accountManagerLogin: contractorData.accountManagerLogin,
      balance: contractorData.balance,
      streetShipping: contractorData.streetShipping,
      cityShipping: contractorData.cityShipping,
      countryShipping: contractorData.countryShipping,
      postcodeShipping: contractorData.postcodeShipping,
      widziCeneEuro: contractorData.widziCeneEuro,
      anotherContacts: contractorData.anotherContacts,
      bankAccounts: contractorData.bankAccounts,
      firms: contractorData.firms,
      projects: contractorData.projects,
      pliki: contractorData.pliki
    };



    console.log('CONTRACTOR', contractor);
    // I'm sending data to node server
    this.http
      .post<{ message: string; contractorId: string; plikSciezka: string }>(
        environment.apiUrl + '/contractors',
        contractor, { withCredentials: true }
      )
      .subscribe(responseData => {
        if (responseData.message === 'Contractor exist') {
          alert(`Kontrahent z tym numerem NIP już istnieje w bazie`);
        } else {
          // console.log('plikSciezka: ', responseData.plikSciezka);
          this.router.navigate(['/contractorslist']);
        }
        // const id = responseData.contractorId;
        // contractor.id = id;
        // this.contractors.push(contractor);
        // // I'm emitting a new vlue to contractorsUpdated
        // // as a copy of contractors table
        // this.contractorsUpdated.next([...this.contractors]);
      });
  }

  // UPDATE A CONTRACTOR
  updateContractor(id: string, contractorData: Contractor) {
    const contractor: Contractor = contractorData;
    this.http
      .put(environment.apiUrl + '/contractors/' + id, contractor, { withCredentials: true })
      .subscribe(response => {
        this.router.navigate(['/contractorslist']);
      });
  }

  // DELETE A CONTRACTOR
  deleteContractor(contractorId: string) {
    return this.http.delete(
      environment.apiUrl + '/contractors/' + contractorId, { withCredentials: true }
    );
    // .subscribe(() => {
    //   // console.log('Contractor deleted');
    //   const updatedContractors = this.contractors.filter(
    //     contractor => contractor.id != contractorId
    //   );
    //   this.contractors = updatedContractors;
    //   this.contractorsUpdated.next([...this.contractors]);
    // });
  }
}
