import { Injectable, signal } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';
import { PriceUpdate, Order } from '../models/models';

const MAX_HISTORY = 30;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any> | null = null;
  private priceUpdates$ = new Subject<PriceUpdate>();
  private orderUpdates$ = new Subject<Order>();

  connectionStatus = signal<'connected' | 'disconnected' | 'connecting'>('disconnected');
  latestPrice = signal<PriceUpdate | null>(null);

  // Price history per market: marketId -> yesPrice[]
  priceHistory = signal<Record<string, number[]>>({});
  // Flash state per market: marketId -> 'up' | 'down' | null
  priceFlash = signal<Record<string, 'up' | 'down' | null>>({});

  connect(url: string): void {
    if (this.socket$) return;

    this.connectionStatus.set('connecting');
    this.socket$ = webSocket({
      url,
      openObserver: { next: () => this.connectionStatus.set('connected') },
      closeObserver: { next: () => this.connectionStatus.set('disconnected') }
    });

    this.socket$.subscribe({
      next: (msg) => this.handleMessage(msg),
      error: (err) => console.error('WebSocket error:', err),
      complete: () => this.connectionStatus.set('disconnected')
    });
  }

  /** Seed initial price points from loaded markets */
  seedHistory(markets: { id: string | number; yesPrice: number }[]): void {
    const hist: Record<string, number[]> = {};
    for (const m of markets) {
      hist[String(m.id)] = [m.yesPrice];
    }
    this.priceHistory.set(hist);
  }

  private handleMessage(msg: any): void {
    switch (msg.type) {
      case 'PRICE_UPDATE':
        const priceUpdate: PriceUpdate = {
          marketId: msg.marketId,
          yesPrice: msg.yesPrice,
          noPrice: msg.noPrice,
          volume: msg.volume,
          timestamp: new Date(msg.timestamp)
        };
        this.latestPrice.set(priceUpdate);
        this.priceUpdates$.next(priceUpdate);
        this.updateHistory(priceUpdate);
        break;
      case 'ORDER_UPDATE':
        this.orderUpdates$.next(msg.order);
        break;
    }
  }

  private updateHistory(update: PriceUpdate): void {
    const key = String(update.marketId);

    // Determine flash direction BEFORE updating history
    const oldHist = this.priceHistory()[key];
    if (oldHist && oldHist.length >= 1) {
      const prev = oldHist[oldHist.length - 1];
      const curr = update.yesPrice;
      const dir = curr > prev ? 'up' as const : curr < prev ? 'down' as const : null;
      if (dir) {
        this.priceFlash.update(f => ({ ...f, [key]: dir }));
        setTimeout(() => {
          this.priceFlash.update(f => ({ ...f, [key]: null }));
        }, 600);
      }
    }

    // Update history — create entirely new record + new array
    this.priceHistory.update(h => {
      const prev = h[key] || [];
      const arr = [...prev, update.yesPrice];
      if (arr.length > MAX_HISTORY) arr.shift();
      return { ...h, [key]: arr };
    });
  }

  subscribeToPrices(): Observable<PriceUpdate> {
    return this.priceUpdates$.asObservable();
  }

  subscribeToOrders(): Observable<Order> {
    return this.orderUpdates$.asObservable();
  }

  subscribeToMarket(marketId: string): void {
    this.socket$?.next({ action: 'subscribe', marketId });
  }

  disconnect(): void {
    this.socket$?.complete();
    this.socket$ = null;
  }
}
