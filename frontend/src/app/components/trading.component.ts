import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarketService } from '../services/market.service';
import { UserService } from '../services/user.service';
import { Order } from '../models/models';

@Component({
  selector: 'app-trading',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="trading-panel">
      @if (selectedMarket(); as market) {
        <div class="panel-header">
          <h3>Place Order</h3>
          <span class="market-title">{{ market.title }}</span>
        </div>

        @if (!user()) {
          <div class="auth-prompt">
            <span>🔐</span>
            <p>Please <a routerLink="/login">sign in</a> to trade.</p>
          </div>
        } @else {
          <div class="order-form">
            <!-- Side selector -->
            <div class="form-label">Prediction</div>
            <div class="toggle-group">
              <button [class.active-yes]="side() === 'YES'" (click)="side.set('YES')">
                YES <span class="price-hint">{{ market.yesPrice }}p</span>
              </button>
              <button [class.active-no]="side() === 'NO'" (click)="side.set('NO')">
                NO <span class="price-hint">{{ market.noPrice }}p</span>
              </button>
            </div>

            <!-- Type selector -->
            <div class="form-label">Order Type</div>
            <div class="toggle-group">
              <button [class.active-type]="type() === 'BUY'" (click)="type.set('BUY')">BUY</button>
              <button [class.active-type]="type() === 'SELL'" (click)="type.set('SELL')">SELL</button>
            </div>

            <div class="form-label">Quantity</div>
            <input type="number" [(ngModel)]="quantity" min="1" placeholder="10" />

            <div class="form-label">Price (p)</div>
            <input type="number" [(ngModel)]="price" min="1" max="99" placeholder="50" />

            <div class="total-row">
              <span>Total Cost</span>
              <span class="total-value">₹{{ (total() / 100) | number:'1.2-2' }}</span>
            </div>

            @if (orderSuccess()) {
              <div class="success-msg">✓ Order placed successfully!</div>
            }
            @if (orderError()) {
              <div class="error-msg">{{ orderError() }}</div>
            }

            <button class="btn-place" (click)="placeOrder()" [disabled]="placing()">
              {{ placing() ? 'Placing...' : (type() + ' ' + side()) }}
            </button>
          </div>
        }
      } @else {
        <div class="no-market">
          <span class="no-market-icon">👆</span>
          <p>Select a market to start trading</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .trading-panel {
      background: #111;
      border: 1px solid #1e1e1e;
      border-radius: 10px;
      padding: 1.5rem;
      position: sticky;
      top: 80px;
    }
    .panel-header { margin-bottom: 1.25rem; }
    .panel-header h3 { color: #c9a84c; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px; }
    .market-title { color: #ddd; font-size: 0.9rem; line-height: 1.4; display: block; }
    .auth-prompt {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    .auth-prompt span { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
    .auth-prompt a { color: #c9a84c; text-decoration: none; }
    .form-label { color: #666; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; margin-top: 1rem; }
    .toggle-group { display: flex; gap: 0; border-radius: 6px; overflow: hidden; border: 1px solid #2a2a2a; }
    .toggle-group button {
      flex: 1;
      padding: 9px;
      background: #1a1a1a;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .toggle-group button:not(:last-child) { border-right: 1px solid #2a2a2a; }
    .toggle-group button.active-yes { background: #22c55e22; color: #22c55e; }
    .toggle-group button.active-no { background: #ef444422; color: #ef4444; }
    .toggle-group button.active-type { background: #c9a84c22; color: #c9a84c; }
    .price-hint { font-size: 0.7rem; opacity: 0.7; }
    input {
      width: 100%;
      padding: 9px 12px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 6px;
      color: #eee;
      font-size: 0.9rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    input:focus { outline: none; border-color: #c9a84c; }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-top: 1px solid #1e1e1e;
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #888;
    }
    .total-value { color: #c9a84c; font-weight: 700; font-size: 1.1rem; }
    .success-msg {
      background: #22c55e22;
      border: 1px solid #22c55e44;
      color: #22c55e;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
    }
    .error-msg {
      background: #ef444422;
      border: 1px solid #ef444444;
      color: #ef4444;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
    }
    .btn-place {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #c9a84c, #f5d78e);
      color: #0a0a0a;
      border: none;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .btn-place:hover:not(:disabled) { opacity: 0.85; }
    .btn-place:disabled { opacity: 0.5; cursor: not-allowed; }
    .no-market {
      text-align: center;
      padding: 3rem 1rem;
      color: #444;
    }
    .no-market-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
    .no-market p { font-size: 0.9rem; }
  `]
})
export class TradingComponent {
  selectedMarket = computed(() => this.marketService.selectedMarket());
  user = computed(() => this.userService.currentUser());

  side = signal<'YES' | 'NO'>('YES');
  type = signal<'BUY' | 'SELL'>('BUY');
  quantity = 10;
  price = 50;
  placing = signal(false);
  orderSuccess = signal(false);
  orderError = signal('');

  total = computed(() => this.quantity * this.price);

  constructor(private marketService: MarketService, private userService: UserService) {}

  placeOrder(): void {
    const market = this.selectedMarket();
    const user = this.user();
    if (!market || !user) return;

    this.placing.set(true);
    this.orderSuccess.set(false);
    this.orderError.set('');

    this.marketService.placeOrder({
      marketId: market.id,
      userId: user.id,
      side: this.side(),
      type: this.type(),
      quantity: this.quantity,
      price: this.price
    }).subscribe({
      next: (order: Order) => {
        console.log('Order placed:', order);
        this.orderSuccess.set(true);
        this.placing.set(false);
        setTimeout(() => this.orderSuccess.set(false), 3000);
      },
      error: () => {
        this.orderError.set('Failed to place order. Please try again.');
        this.placing.set(false);
      }
    });
  }
}
