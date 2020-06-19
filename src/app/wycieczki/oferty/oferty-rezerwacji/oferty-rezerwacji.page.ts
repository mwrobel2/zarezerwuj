import { Component, OnInit, OnDestroy } from '@angular/core';
import { Miejsce } from '../../miejsce.model';
import { WycieczkiService } from '../../wycieczki.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-oferty-rezerwacji',
  templateUrl: './oferty-rezerwacji.page.html',
  styleUrls: ['./oferty-rezerwacji.page.scss'],
})
export class OfertyRezerwacjiPage implements OnInit, OnDestroy {
  miejsce: Miejsce;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private wycieczkiService: WycieczkiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('miejsceId')) {
        this.navCtrl.navigateBack('/wycieczki/tabs/oferty');
        return;
      }
      this.placeSub = this.wycieczkiService
        .getPlace(paramMap.get('miejsceId'))
        .subscribe(miejsce => {
           this.miejsce = miejsce;
        });
    });
  }
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
