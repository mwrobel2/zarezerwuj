import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { OfertyRezerwacjiPage } from './oferty-rezerwacji.page';

describe('OfertyRezerwacjiPage', () => {
  let component: OfertyRezerwacjiPage;
  let fixture: ComponentFixture<OfertyRezerwacjiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfertyRezerwacjiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OfertyRezerwacjiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
