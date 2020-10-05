import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsadminComponent } from './formsadmin.component';

describe('FormsadminComponent', () => {
  let component: FormsadminComponent;
  let fixture: ComponentFixture<FormsadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
