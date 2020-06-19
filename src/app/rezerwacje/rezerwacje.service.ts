import { Injectable } from '@angular/core';
import { Rezerwacje } from './rezerwacje.model';
import { take, tap, delay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RezerwacjeService {
  private rezerwacji = new BehaviorSubject<Rezerwacje[]>([]);

  get rezerwacje() {
    return this.rezerwacji.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}
  addBooking(
    miejsceId: string,
    miejsceTitle: string,
    miejsceImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Rezerwacje(
      Math.random().toString(),
      miejsceId,
      this.authService.userId,
      miejsceTitle,
      miejsceImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );
    return this.rezerwacji.pipe(
      take(1),
      delay(500),
      tap(rezerwacje => {
        this.rezerwacji.next(rezerwacje.concat(newBooking));
      })
    );
  }
  cancelBooking(rezerwacjeId: string) {}
  fetchBookings() {
    this.http
      .get(
        `'https://zarezerwuj-46c51.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${
          this.authService.userId
        }"`
      );
  }
}
