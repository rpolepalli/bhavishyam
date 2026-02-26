import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Market, Order, Position } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MarketService {
  private apiUrl = '/api';

  markets = signal<Market[]>([]);
  selectedMarket = signal<Market | null>(null);
  activeCategory = signal('');

  constructor(private http: HttpClient) {}

  getMarkets(): Observable<Market[]> {
    return this.http.get<Market[]>(`${this.apiUrl}/markets`);
  }

  getMarket(id: string): Observable<Market> {
    return this.http.get<Market>(`${this.apiUrl}/markets/${id}`);
  }

  createMarket(market: Partial<Market>): Observable<Market> {
    return this.http.post<Market>(`${this.apiUrl}/markets`, market);
  }

  settleMarket(id: string, outcome: boolean): Observable<Market> {
    return this.http.post<Market>(`${this.apiUrl}/markets/${id}/settle?outcome=${outcome}`, {});
  }

  placeOrder(order: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/trading/orders`, order);
  }

  getPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(`${this.apiUrl}/trading/positions`);
  }

  getUserOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/trading/orders/user/${userId}`);
  }
}
