import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NowaOfertaPage } from './nowa-oferta.page';

describe('NowaOfertaPage', () => {
  let component: NowaOfertaPage;
  let fixture: ComponentFixture<NowaOfertaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NowaOfertaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NowaOfertaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
