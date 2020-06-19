import { Component, OnInit, OnDestroy } from '@angular/core';
import { Miejsce } from '../miejsce.model';
import { WycieczkiService } from '../wycieczki.service';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-szukaj',
  templateUrl: './szukaj.page.html',
  styleUrls: ['./szukaj.page.scss'],
})
export class SzukajPage implements OnInit, OnDestroy {
  loadedMiejsca: Miejsce[];
  listedLoadedMiejsca: Miejsce[];
  relevantPlaces: Miejsce[];
  private placesSub: Subscription;

  constructor(private wycieczkiService: WycieczkiService, private menuCtrl: MenuController, private authService: AuthService ) { }

  ngOnInit() {
    this.placesSub = this.wycieczkiService.wycieczki.subscribe(wycieczki => {
      this.loadedMiejsca = wycieczki;
      this.relevantPlaces = this.loadedMiejsca;
      this.listedLoadedMiejsca = this.relevantPlaces.slice(1);
    });
  }
  onOpenMenu() {
    this.menuCtrl.toggle();
  }
  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.loadedMiejsca;
      this.listedLoadedMiejsca = this.relevantPlaces.slice(1);
    } else {
      this.relevantPlaces = this.loadedMiejsca.filter(
        miejsce => miejsce.userId !== this.authService.userId
      );
      this.listedLoadedMiejsca = this.relevantPlaces.slice(1);
    }
  }
  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
