import { Injectable } from '@angular/core';
import { Dictionary } from '../models/slownik.model';
// 'event emitter'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private dictionaries: Dictionary[] = [];
  // I am creating an updated dictionaries subject
  // it is a generic type
  // I'm passing Dictionary table as payload
  // it is an observer
  private dictionariesUpdated = new Subject<Dictionary[]>();

  constructor(private router: Router, private http: HttpClient) {}

  // GETS ALL DICTIONARies
  getDictionaries() {
    // zwracam kopię tablicy 'słowniki' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.dictionaries];

    // httpClient is generic type so we state that we will get aray of dictionaries
    this.http
      .get<{ message: string; dictionaries: any }>(
        environment.apiUrl + '/dictionary', {withCredentials: true}
      )
      // I am using pipe to change id na _id
      .pipe(
        map(dictionariesData => {
          return dictionariesData.dictionaries.map(dictionary => {
            return {
              id: dictionary._id,
              name: dictionary.name,
              values: dictionary.values,
              description: dictionary.description
            };
          });
        })
      )
      .subscribe(transformedDictionaries => {
        // this function gets data
        // positive case
        this.dictionaries = transformedDictionaries;
        this.dictionariesUpdated.next([...this.dictionaries]);
      });
  }

  // GET SINGLE DICTIONARY
  getDictionary(id: string) {
    // I'm getting a dictionary from local array of dictionaries
    // return {...this.dictionaries.find(c => c.id === id)};

    // I'm getting a dictionary from databas
    return this.http.get<{ _id: string }>(
      environment.apiUrl + '/dictionary/' + id, {withCredentials: true}
    );
  }

  // GET DICTIONARY BY NAME
  getDictionaryName(name: string) {
    return this.http.get<{ _id: string, values: [] }>(
      environment.apiUrl + '/dictionary/name/' + name, {withCredentials: true}
    );
  }

  // I am listening to subject of dictionariesUpdated
  getDictionariesUpdatedListener() {
    return this.dictionariesUpdated.asObservable();
  }

  // ADDING A DICTIONARY
  addDictionary(dictionaryData: Dictionary) {
    const dictionary: Dictionary = {
      id: null,
      name: dictionaryData.name,
      values: dictionaryData.values,
      description: dictionaryData.description
    };
    // I'm sending data to node server
    this.http
      .post<{ message: string; dictionaryId: string }>(
        environment.apiUrl + '/dictionary',
        dictionary, {withCredentials: true}
      )
      .subscribe(responseData => {
        // console.log(responseData.message);
        const id = responseData.dictionaryId;
        dictionary.id = id;
        this.dictionaries.push(dictionary);
        // I'm emitting a new vlue to dictionariesUpdated
        // as a copy of dictionaries table
        this.dictionariesUpdated.next([...this.dictionaries]);
        this.router.navigate(['/dictlist']);
      });
  }

  // UPDATE A DICTIONARY
  updateDictionary(id: string, dictionaryData: Dictionary) {
    const dictionary: Dictionary = dictionaryData;
    this.http
      .put(environment.apiUrl + '/dictionary/' + id, dictionary, {withCredentials: true})
      .subscribe(response => {
        // console.log('RRRRR', response);
        this.router.navigate(['/dictlist']);
      });
  }

  // DELETE A DICTIONARY
  deleteDictionary(dictionaryId: string) {
    this.http
      .delete(environment.apiUrl + '/dictionary/' + dictionaryId, {withCredentials: true})
      .subscribe(() => {
        // console.log('Dictionary deleted');
        const updatedDictionaries = this.dictionaries.filter(
          dictionary => dictionary.id !== dictionaryId
        );
        this.dictionaries = updatedDictionaries;
        this.dictionariesUpdated.next([...this.dictionaries]);
      });
  }
}
