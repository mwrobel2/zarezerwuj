import { Component, OnInit, Input } from '@angular/core';
import { Miejsce } from '../../miejsce.model';

@Component({
  selector: 'app-pozycja-oferty',
  templateUrl: './pozycja-oferty.component.html',
  styleUrls: ['./pozycja-oferty.component.scss'],
})
export class PozycjaOfertyComponent implements OnInit {
  @Input() oferta: Miejsce;
  constructor() { }

  ngOnInit() {
  }
}
