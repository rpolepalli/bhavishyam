import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/models';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private apiUrl = '/api/wallet';

  constructor(private http: HttpClient) {}

  getTransactions(userId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions/user/${userId}`);
  }

  deposit(userId: string, amount: number): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, {
      userId, amount, type: 'DEPOSIT'
    });
  }
}
