import { Component, OnInit, OnDestroy } from '@angular/core';
import { Miejsce } from '../../miejsce.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, LoadingController } from '@ionic/angular';
import { WycieczkiService } from '../../wycieczki.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edytuj-oferty',
  templateUrl: './edytuj-oferty.page.html',
  styleUrls: ['./edytuj-oferty.page.scss'],
})
export class EdytujOfertyPage implements OnInit, OnDestroy {
  miejsce: Miejsce;
  form: FormGroup;
  private placeSub: Subscription;

   constructor(
    private route: ActivatedRoute,
    private wycieczkiService: WycieczkiService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController
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
         this.form = new FormGroup({
           title: new FormControl(this.miejsce.title, {
            updateOn: 'blur',
            validators: [Validators.required]
           }),
           description: new FormControl(this.miejsce.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
           })
         });
       });
    });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating place...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.wycieczkiService
          .updatePlace(
            this.miejsce.id,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}

