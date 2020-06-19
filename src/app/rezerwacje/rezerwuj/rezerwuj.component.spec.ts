import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RezerwujComponent } from './rezerwuj.component';

describe('RezerwujComponent', () => {
  let component: RezerwujComponent;
  let fixture: ComponentFixture<RezerwujComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RezerwujComponent ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RezerwujComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
