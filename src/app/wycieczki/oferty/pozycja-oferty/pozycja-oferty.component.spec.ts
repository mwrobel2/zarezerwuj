import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PozycjaOfertyComponent } from './pozycja-oferty.component';

describe('PozycjaOfertyComponent', () => {
  let component: PozycjaOfertyComponent;
  let fixture: ComponentFixture<PozycjaOfertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PozycjaOfertyComponent ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(PozycjaOfertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
