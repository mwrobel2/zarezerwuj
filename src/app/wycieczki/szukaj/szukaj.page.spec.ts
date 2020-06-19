import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SzukajPage } from './szukaj.page';

describe('SzukajPage', () => {
  let component: SzukajPage;
  let fixture: ComponentFixture<SzukajPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SzukajPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SzukajPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
