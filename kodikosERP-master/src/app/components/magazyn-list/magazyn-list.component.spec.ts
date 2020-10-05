import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MagazynListComponent } from './magazyn-list.component';

describe('MagazynListComponent', () => {
  let component: MagazynListComponent;
  let fixture: ComponentFixture<MagazynListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagazynListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagazynListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
