import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

import { WycieczkiService } from '../wycieczki.service';
import { Miejsce } from '../miejsce.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-oferty',
  templateUrl: './oferty.page.html',
  styleUrls: ['./oferty.page.scss'],
})
export class OfertyPage implements OnInit, OnDestroy {
  oferty: Miejsce[];
  private placesSub: Subscription;
  constructor(private wycieczkiService: WycieczkiService, private router: Router) { }

  ngOnInit() {
    this.placesSub = this.wycieczkiService.wycieczki.subscribe(wycieczki => {
      this.oferty = wycieczki;
    });
  }
  onEdit(ofertaId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'wycieczki', 'tabs', 'oferty', 'edytuj', ofertaId]);
    console.log('Edycja pozycji', ofertaId);
  }
  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
