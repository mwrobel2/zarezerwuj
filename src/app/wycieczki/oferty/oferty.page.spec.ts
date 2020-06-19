import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfertyPage } from './oferty.page';

describe('OfertyPage', () => {
  let component: OfertyPage;
  let fixture: ComponentFixture<OfertyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfertyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfertyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
