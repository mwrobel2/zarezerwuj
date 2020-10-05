import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private invoices: Invoice[] = [];
  private invoicesUpdated = new Subject<Invoice[]>();

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  // GET ALL INVOICES
  getInvoices() {
    // zwracam kopię tablicy 'kontrahenci' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.assortments];

    // httpClient is generic type so we state that we will get aray of invoices
    this.http.get<{ message: string, invoices: any }>(environment.apiUrl + '/invoice')
      // I am using pipe to change id na _id
      .pipe(map((invoicesData) => {
        return invoicesData.invoices.map(invoice => {
          return {
            id: invoice._id,
            company: invoice.company,
            nip: invoice.nip,
            companyStreet: invoice.companyStreet,
            companyPostCode: invoice.companyPostCode,
            companyCity: invoice.companyCity,
            issuerLogin: invoice.issuerLogin,
            issueDate: invoice.issueDate,
            sellDate: invoice.sellDate,
            issueCity: invoice.issueCity,
            paymentType: invoice.paymentType,
            factoring: invoice.factoring,
            currency: invoice.currency,
            currencyDate: invoice.currencyDate,
            currencyRate: invoice.currencyRate,
            tableNBP: invoice.tableNBP,
            dueDate: invoice.dueDate,
            paid: invoice.paid,
            // prowizja
            commission: invoice.commission,
            paidCommision: invoice.paidCommision,
            // towary
            commodities: invoice.commodities
          };
        });
      }))
      .subscribe((transformedInvoices) => {
        // this function gets data
        // positive case
        this.invoices = transformedInvoices;
        this.invoicesUpdated.next([...this.invoices]);
      });
  }


  // I am listening to subject of invoicesUpdated
  getInvoicesUpdatedListener() {
    return this.invoicesUpdated.asObservable();
  }

  // ADDING an Invoice
  addInvoice(invoiceData: Invoice) {
    const invoice: Invoice = {
      id: null,
      company: invoiceData.company,
      nip: invoiceData.nip,
      companyStreet: invoiceData.companyStreet,
      companyPostCode: invoiceData.companyPostCode,
      companyCity: invoiceData.companyCity,
      issuerLogin: invoiceData.issuerLogin,
      issueDate: invoiceData.issueDate,
      sellDate: invoiceData.sellDate,
      issueCity: invoiceData.issueCity,
      paymentType: invoiceData.paymentType,
      factoring: invoiceData.factoring,
      currency: invoiceData.currency,
      currencyDate: invoiceData.currencyDate,
      currencyRate: invoiceData.currencyRate,
      tableNBP: invoiceData.tableNBP,
      dueDate: invoiceData.dueDate,
      paid: invoiceData.paid,
      // prowizja
      commission: invoiceData.commission,
      paidCommision: invoiceData.paidCommision,
      // towary
      commodities: invoiceData.commodities
    };
    // I'm sending data to node server
    this.http.post<{ message: string, invoiceId: string }>(environment.apiUrl + '/invoice', invoice)
      .subscribe((responseData) => {
        // console.log(responseData.message);
        const id = responseData.invoiceId;
        invoice.id = id;
        this.invoices.push(invoice);
        // I'm emitting a new vlue to invoicesUpdated
        // as a copy of invoices table
        this.invoicesUpdated.next([...this.invoices]);
        this.router.navigate(['/lazy/invoice']);
      });
  }


  // GET SINGLE INVOICE
  getInvoiceId(id: string) {
    // I'm getting an invoice from local array of invoices
    // return {...this.invoices.find(c => c.id === id)};

    // I'm getting an invoice from database
    return this.http.get<{ _id: string }>(environment.apiUrl + '/invoice/' + id);
  }


  // UPDATE AN INVOICE
  updateInvoice(id: string, invoiceData: Invoice) {
    const invoice: Invoice = invoiceData;
    this.http.put(environment.apiUrl + '/invoice/' + id, invoice)
      .subscribe(response => {
        this.router.navigate(['/invoice']);
      });
  }

  // DELETE AN INVOICE
  deleteInvoice(invoiceId: string) {
    this.http
      .delete(environment.apiUrl + '/invoice/' + invoiceId)
      .subscribe(() => {
        // console.log('Invoice deleted');
        const updatedInvoices = this.invoices.filter(
          invoice => invoice.id != invoiceId
        );
        this.invoices = updatedInvoices;
        this.invoicesUpdated.next([...this.invoices]);
      });
  }


}

