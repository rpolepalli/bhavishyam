import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/users';
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('bhavishyam_user');
    if (stored) this.currentUser.set(JSON.parse(stored));
  }

  register(data: { email: string; name: string; password: string }): Observable<User> {
    return this.http.post<User>(this.apiUrl, {
      email: data.email,
      name: data.name,
      passwordHash: data.password
    }).pipe(tap(user => this.setUser(user)));
  }

  login(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`)
      .pipe(tap(user => this.setUser(user)));
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  private setUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('bhavishyam_user', JSON.stringify(user));
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('bhavishyam_user');
  }
}
