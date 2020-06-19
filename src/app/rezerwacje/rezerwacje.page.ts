import { Component, OnInit, OnDestroy } from '@angular/core';
import { Rezerwacje } from './rezerwacje.model';
import { IonItemSliding } from '@ionic/angular';
import { RezerwacjeService } from './rezerwacje.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rezerwacje',
  templateUrl: './rezerwacje.page.html',
  styleUrls: ['./rezerwacje.page.scss'],
})
export class RezerwacjePage implements OnInit, OnDestroy {
  loadedRezerwacje: Rezerwacje[];
  private bookingSub: Subscription;

  constructor(private rezerwacjeService: RezerwacjeService) { }

  ngOnInit() {
     this.rezerwacjeService.rezerwacje.subscribe(rezerwacje => {
      this.loadedRezerwacje = rezerwacje;
    });
  }

  onCancelBooking(rezerwacjeId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.rezerwacjeService.cancelBooking(rezerwacjeId);
  }
  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }
}
