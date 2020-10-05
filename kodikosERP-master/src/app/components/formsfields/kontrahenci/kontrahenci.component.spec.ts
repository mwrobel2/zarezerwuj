import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KontrahenciComponent } from './kontrahenci.component';

describe('KontrahenciComponent', () => {
  let component: KontrahenciComponent;
  let fixture: ComponentFixture<KontrahenciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KontrahenciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KontrahenciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
