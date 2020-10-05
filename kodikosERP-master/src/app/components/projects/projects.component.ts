import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  userIsAuthenticated = false;
  public loggedInUser2: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null,
    moduly: null
  };
  private authListenerSub: Subscription;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.loggedInUser2 = this.authService.getZalogowany();
    this.userIsAuthenticated = this.authService.getIsAuth();
  }

}
