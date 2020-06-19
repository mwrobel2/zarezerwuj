import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpisWycieczkiPage } from './opis-wycieczki.page';

describe('OpisWycieczkiPage', () => {
  let component: OpisWycieczkiPage;
  let fixture: ComponentFixture<OpisWycieczkiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpisWycieczkiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpisWycieczkiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
