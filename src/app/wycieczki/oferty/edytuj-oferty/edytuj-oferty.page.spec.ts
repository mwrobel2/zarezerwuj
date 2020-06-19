import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EdytujOfertyPage } from './edytuj-oferty.page';

describe('EdytujOfertyPage', () => {
  let component: EdytujOfertyPage;
  let fixture: ComponentFixture<EdytujOfertyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdytujOfertyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(EdytujOfertyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
