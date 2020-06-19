import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RezerwacjePage } from './rezerwacje.page';

describe('RezerwacjePage', () => {
  let component: RezerwacjePage;
  let fixture: ComponentFixture<RezerwacjePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RezerwacjePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RezerwacjePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
