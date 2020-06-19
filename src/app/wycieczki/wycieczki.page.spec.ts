import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WycieczkiPage } from './wycieczki.page';

describe('WycieczkiPage', () => {
  let component: WycieczkiPage;
  let fixture: ComponentFixture<WycieczkiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WycieczkiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WycieczkiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
