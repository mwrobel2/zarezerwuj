import { Component, OnInit, OnDestroy } from "@angular/core";
import { Contractor } from "../../models/kontrahent.model";
import { ContractorsService } from "../../services/kontrahenci.service";
import { Subscription } from "rxjs";
import { User } from "../../models/user.model";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Contractorform } from "../../models/formatki/contractorform.model";
import { LogowanierejestracjaService } from "../../services/logowanierejestracja.service";
import { environment } from "../../../environments/environment";
import { PlikiService } from "../../services/pliki.service";
import { Invoice } from "../../models/invoice.model";
import { InvoiceService } from "../../services/invoice.service";
import { AuthService } from "../../services/auth.service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-export",
  templateUrl: "./export.component.html",
  styleUrls: ["./export.component.scss"]
})
export class ExportComponent implements OnInit {
  contractors: Contractor[] = [];
  private contractorsSub: Subscription;

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
    contractorFields: null
  };

  totalContractors = 0;
  contractorsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];

  acKolumny: string[];
  dkKolumny: string[];
  plikiKolumny: string[];

  private searchValues = {
    fullName: "",
    shortName: "",
    nip: "",
    comments: "",
    accountManagerLogin: ""
  };

  contractor = {
    nip: "",
    shortName: "",
    fullName: "",
    comments: "",
    anotherContacts: [{}],
    bankAccounts: [{}]
  };

  isLoading = false;

  // I declare displayed fields
  dispFields: Contractorform = {
    balance: false,
    comments: false,
    creditLimit: false,
    paymentDeadline: false,
    status: false,
    buttonDodajKontr: false,
    buttonOfertaKontr: false,
    buttonEdytujKontr: false,
    buttonUsunKontr: false,
    widziWszystkie: false,
    adres: false,
    kontakty: false,
    firmy: false,
    projekty: false,
    kontBankowe: false,
    pliki: false,
    buttonPliki: false
  };
  backendUrl = environment.backendUrl;

  invoices: Invoice[] = [];
  private invoicesSub: Subscription;
  private authListenerSub: Subscription;

  public loggedInUserSub: Subscription;

  totalInvoices = 10;
  invoicesPerPage = 5;

  fileContractors: String =
    "Identyfikator kontrahenta wykorzystywany w pliku CSV z danymi dokumentów, Skrót;Nazwa;Kod kraju;NIP;Miejscowość;Gmina;Ulica;Nr domu, Nr mieszkania;Kod pocztowy;Poczta;Symbol rachunku bankowego;Numer rachunku bankowego.\n";
  fileInvoices: String = "";

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public contractorsService: ContractorsService,
    private router: Router,
    public invoiceService: InvoiceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
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
        console.log(this.loggedInUser);
      });
    this.loggedInUser.name = sessionStorage.getItem("KODuserName");
    this.loggedInUser.surname = sessionStorage.getItem("KODuserSurname");

    this.invoiceService.getInvoices();
    this.invoicesSub = this.invoiceService
      .getInvoicesUpdatedListener()
      .subscribe((invoices: Invoice[]) => {
        // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKICH KONTRAKTORÓW W TEN SPOSÓB ....
        // console.log('invoices get', invoices);
        this.invoices = invoices;
      });

    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      user => {
        this.loggedInUser = user;
        if (
          typeof this.loggedInUser !== "undefined" &&
          this.loggedInUser.moduly !== null &&
          typeof this.loggedInUser.moduly !== "undefined"
        ) {
          this.userIsAuthenticated = true;
          this.dispFields = this.loggedInUser.contractorFields;

          if (!this.dispFields.widziWszystkie) {
            this.searchValues.accountManagerLogin = this.loggedInUser.login;
          }
          // po zweryfikowaniu usera pobieram kontrahentów
          this.contractorsService.getContactors(
            this.contractorsPerPage,
            this.currentPage,
            this.searchValues
          );
        }
      },
      error => {
        this.router.navigate(["/login"]);
      }
    );

    this.contractorsSub = this.contractorsService
      .getContractorsUpdatedListener()
      .subscribe(
        (contractorsData: {
          contractors: Contractor[];
          contractorsCount: number;
        }) => {
          this.isLoading = false;
          this.totalContractors = contractorsData.contractorsCount;
          this.contractors = contractorsData.contractors;
          this.contractors.forEach(contractor => {
            this.fileContractors = this.fileContractors.concat(
              contractor?.id,
              ";",
              contractor?.shortName,
              ";",
              contractor?.fullName,
              ";",
              contractor?.country,
              ";",
              contractor?.nip,
              ";",
              contractor?.city,
              ";",
              contractor?.city,
              ";",
              contractor?.street,
              ";",
              ";",
              ";",
              contractor?.postcode,
              ";",
              contractor?.city,
              ";",
              contractor?.country,
              ";",
              contractor?.bankAccounts[0]?.dkNrKonta,
              "\n"
            );
          });
        }
      );
  }

  saveTextAsFile(data, filename) {
    if (!data) {
      console.error("Console.save: No data");
      return;
    }

    if (!filename) filename = "export.csv";

    const blob = new Blob([data], { type: "text/plain" });
    saveAs(blob, filename);
  }
}
