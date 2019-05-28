import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isSaved;
  savedUser;
  constructor(private http: HttpClient) { }

  regUser(user) {

    const url = 'http://localhost:9500/save';
    return this.http.post(url, user).map(res => res);
  }

  updateProcess(processData, email) {

    const url = 'http://localhost:9500/process';

    return this.http.post(url, {data: processData, user: email}).map(res => res);

  }

}