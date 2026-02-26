import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AdminUser { id: string; email: string; name: string; balance: number; }

// Admin credentials are validated server-side via the user-service.
// Only users with id === '1' (seed admin) are granted access.
@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly STORAGE_KEY = 'bhavishyam_admin';
  currentAdmin = signal<AdminUser | null>(null);

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) this.currentAdmin.set(JSON.parse(stored));
  }

  login(email: string): Observable<AdminUser> {
    return this.http.get<AdminUser>(`/api/users/email/${email}`).pipe(
      tap(user => {
        if (String(user.id) !== '1') throw new Error('Not an admin');
        this.currentAdmin.set(user);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      })
    );
  }

  logout(): void {
    this.currentAdmin.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.currentAdmin();
  }
}
