import { Injectable } from '@angular/core';
import { Miejsce } from './miejsce.model';
// import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { AuthService } from '../auth/auth.service';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WycieczkiService {
  private miejsce = new BehaviorSubject<Miejsce[]>([
    new Miejsce(
      'w1',
      'Zamek Książ',
      'Perła Dolnego Śląska- zwiedzanie zamku wraz noclegiem.',
      'https://historia.org.pl/wp-content/uploads/2014/12/Ksi%C4%85%C5%BC-zamek.jpg',
       71.99,
       new Date('2020-01-01'),
       new Date('2020-12-31'),
       'abc'
       ),
    new Miejsce(
      'w2',
      'Zamek Czocha',
      'W Karkonoszach, nocleg oraz zwiedzanie zamku i okolic.',
      'https://malewypady.pl/wp-content/uploads/2017/02/3f889e327081d12bb875fc647ea86722.jpg',
       69.99,
       new Date('2020-01-01'),
       new Date('2020-12-31'),
       'abc'
       ),
    new Miejsce(
      'w3',
      'Zamek Kliczków',
      'Na Dolnym Śląsku, nocleg i kolacja ze zwiedzaniem zamku.',
      'https://media-cdn.tripadvisor.com/media/photo-s/16/ae/34/3d/zamek-kliczkow.jpg',
       80.99,
       new Date('2020-01-01'),
       new Date('2020-12-31'),
       'abc'
       )
  ]);

  get wycieczki() {
    return this.miejsce.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  getPlace(id: string) {
    return this.wycieczki.pipe(
      take(1),
      map(wycieczki => {
        return {...wycieczki.find(p => p.id === id) };
      })
    );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    const newPlace = new Miejsce(
      Math.random().toString(),
      title,
      description,
      'https://www.wykop.pl/cdn/c3201142/comment_Wo9Gk8qI4EZGVFQz4OzLvn7mylt7lFFm.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.http
     .post<{name: string}>('https://zarezerwuj-46c51.firebaseio.com/oferowane-wycieczki.json', {
       ...newPlace,
        id: null
      }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.wycieczki;
        }),
        take(1),
        tap(wycieczki => {
          newPlace.id = generatedId;
          this.miejsce.next(wycieczki.concat(newPlace));
        })
      );
    // return this.wycieczki.pipe(
    //  take(1),
    //   delay(1000),
    //   tap(wycieczki => {
    //    this.miejsce.next(wycieczki.concat(newPlace));
    //  })
    // );
  }
  updatePlace(miejsceId: string, title: string, description: string) {
  return this.wycieczki.pipe(
    take(1),
    delay(1000),
    tap(wycieczki => {
      const updatedPlaceIndex = wycieczki.findIndex(pl => pl.id === miejsceId);
      const updatedPlaces = [...wycieczki];
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] = new Miejsce(
        oldPlace.id,
        title,
        description,
        oldPlace.imageUrl,
        oldPlace.price,
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId
      );
      this.miejsce.next(updatedPlaces);
    })
  );
}
}
