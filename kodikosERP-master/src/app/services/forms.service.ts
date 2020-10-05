import { Injectable } from '@angular/core';
import { ContractorForm } from '../models/contractorform.model';
import { Contractorform } from '../models/formatki/contractorform.model';
import { HttpClient } from '@angular/common/http';
import { Decoded } from '../models/decoded.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  constructor(private http: HttpClient, private router: Router) {}

  // GET SINGLE FORM INFO
  getForm(name: string) {
    return this.http.get<{ message: string; document: any }>(
      environment.apiUrl + '/formatki/name/' + name, { withCredentials: true }
    );
  }

  // SAVA FORM FIELDS INFO
  saveForm(formInfo: Contractorform, id: string) {
    const newFormInfo = {
      _id: id,
      name: 'contractors',
      selectedFields: {
        balance: formInfo.balance,
        comments: formInfo.comments,
        creditLimit: formInfo.creditLimit,
        paymentDeadline: formInfo.paymentDeadline,
        buttonDodajKontr: formInfo.buttonDodajKontr,
        buttonOfertaKontr: formInfo.buttonOfertaKontr,
        buttonEdytujKontr: formInfo.buttonEdytujKontr,
        buttonUsunKontr: formInfo.buttonUsunKontr,
        widziWszystkie: formInfo.widziWszystkie,
        adres: formInfo.adres,
        kontakty: formInfo.kontakty,
        firmy: formInfo.firmy,
        projekty: formInfo.projekty,
        kontBankowe: formInfo.kontBankowe,
        pliki: formInfo.pliki,
        buttonPliki: formInfo.buttonPliki,
      }
    };
    if (typeof id === 'undefined') {
      id = '1';
    }
    this.http
      .put(environment.apiUrl + '/formatki/' + id, newFormInfo, { withCredentials: true })
      .subscribe(wyn => {
        this.router.navigate(['/lazy/formsadmin']);
      });
  }
}
