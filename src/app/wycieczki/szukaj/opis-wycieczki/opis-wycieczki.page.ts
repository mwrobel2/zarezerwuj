import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Router } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Miejsce } from '../../miejsce.model';
import { Subscription } from 'rxjs';
import { WycieczkiService } from '../../wycieczki.service';
import { ActivatedRoute } from '@angular/router';
import { RezerwujComponent } from '../../../rezerwacje/rezerwuj/rezerwuj.component';
import { RezerwacjeService } from '../../../rezerwacje/rezerwacje.service';

@Component({
  selector: 'app-opis-wycieczki',
  templateUrl: './opis-wycieczki.page.html',
  styleUrls: ['./opis-wycieczki.page.scss'],
})
export class OpisWycieczkiPage implements OnInit, OnDestroy {
  miejsce: Miejsce;
  private placeSub: Subscription;

   constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private wycieczkiService: WycieczkiService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private rezerwacjeService: RezerwacjeService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('miejsceId')) {
        this.navCtrl.navigateBack('/wycieczki/tabs/szukaj');
        return;
      }
      this.placeSub = this.wycieczkiService
        .getPlace(paramMap.get('miejsceId'))
        .subscribe(miejsce => {
          this.miejsce = miejsce;
        });
    });
  }
  onBookPlace()  {
    // this.router.navigateByUrl('/wycieczki/tabs/szukaj');
    // this.navCtrl.navigateBack('/wycieczki/tabs/szukaj');
    // this.navCtrl.pop();
    this.actionSheetCtrl
      .create({
        header: 'Wybierz',
        buttons: [
          {
            text: 'Wybrana Data',
            handler: () => {
              this.openBookingModal('select');
            }
          },
          {
            text: 'Dowolny termin',
            handler: () => {
              this.openBookingModal('random');
            }
          },
          {
            text: 'Anuluj',
            role: 'cancel'
          }
        ]
      })
      .then(actionSheetEl => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: RezerwujComponent,
        componentProps: { selectedMiejsce: this.miejsce, selectedMode: mode }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        if (resultData.role === 'confirm') {
          this.loadingCtrl
            .create({ message: 'Zerezerwowane !'})
            .then(loadingEl => {
              loadingEl.present();
              const data = resultData.data.bookingData;
              this.rezerwacjeService
              .addBooking(
                this.miejsce.id,
                this.miejsce.title,
                this.miejsce.imageUrl,
                data.firstName,
                data.lastName,
                data.guestNumber,
                data.startDate,
                data.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
            });
        }
      });
  }
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
