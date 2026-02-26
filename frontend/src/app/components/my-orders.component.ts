import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MarketService } from '../services/market.service';
import { UserService } from '../services/user.service';
import { Order } from '../models/models';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>My Orders</h1>
        <p class="sub">Track your prediction positions</p>
      </div>

      @if (!user()) {
        <div class="empty-state">
          <span class="empty-icon">🔐</span>
          <p>Please <a routerLink="/login">sign in</a> to view your orders.</p>
        </div>
      } @else if (loading()) {
        <div class="loading">Loading orders...</div>
      } @else if (orders().length === 0) {
        <div class="empty-state">
          <span class="empty-icon">📋</span>
          <p>No orders yet. <a routerLink="/markets">Browse markets</a> to start trading.</p>
        </div>
      } @else {
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-value">{{ orders().length }}</div>
            <div class="stat-label">Total Orders</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ pendingCount() }}</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ filledCount() }}</div>
            <div class="stat-label">Filled</div>
          </div>
          <div class="stat-card gold">
            <div class="stat-value">₹{{ totalInvested() | number:'1.0-0' }}</div>
            <div class="stat-label">Total Invested</div>
          </div>
        </div>

        <div class="orders-table">
          <div class="table-header">
            <span>Market</span>
            <span>Side</span>
            <span>Type</span>
            <span>Qty</span>
            <span>Price</span>
            <span>Total</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          @for (order of orders(); track order.id) {
            <div class="table-row">
              <span class="market-id">Market #{{ order.marketId }}</span>
              <span class="badge" [class.yes]="order.side === 'YES'" [class.no]="order.side === 'NO'">
                {{ order.side }}
              </span>
              <span class="type">{{ order.type }}</span>
              <span>{{ order.quantity }}</span>
              <span>{{ order.price }}p</span>
              <span class="total">₹{{ (order.quantity * order.price / 100) | number:'1.2-2' }}</span>
              <span class="status" [class]="order.status.toLowerCase()">{{ order.status }}</span>
              <span class="date">{{ order.createdAt | date:'dd MMM, HH:mm' }}</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1100px; margin: 0 auto; padding: 2rem; }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 {
      font-size: 1.8rem;
      font-weight: 700;
      background: linear-gradient(135deg, #c9a84c, #f5d78e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.25rem;
    }
    .sub { color: #666; font-size: 0.9rem; }
    .empty-state {
      text-align: center;
      padding: 4rem;
      color: #666;
    }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
    .empty-state a { color: #c9a84c; text-decoration: none; }
    .loading { text-align: center; padding: 3rem; color: #666; }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: #111;
      border: 1px solid #222;
      border-radius: 8px;
      padding: 1.25rem;
      text-align: center;
    }
    .stat-card.gold { border-color: #c9a84c44; }
    .stat-value { font-size: 1.6rem; font-weight: 700; color: #eee; }
    .stat-card.gold .stat-value { color: #c9a84c; }
    .stat-label { font-size: 0.75rem; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .orders-table { background: #111; border: 1px solid #222; border-radius: 8px; overflow: hidden; }
    .table-header {
      display: grid;
      grid-template-columns: 2fr 0.7fr 0.7fr 0.7fr 0.7fr 1fr 1fr 1.2fr;
      padding: 12px 16px;
      background: #1a1a1a;
      color: #666;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #222;
    }
    .table-row {
      display: grid;
      grid-template-columns: 2fr 0.7fr 0.7fr 0.7fr 0.7fr 1fr 1fr 1.2fr;
      padding: 14px 16px;
      border-bottom: 1px solid #1a1a1a;
      align-items: center;
      font-size: 0.9rem;
      color: #ccc;
      transition: background 0.15s;
    }
    .table-row:hover { background: #1a1a1a; }
    .table-row:last-child { border-bottom: none; }
    .market-id { color: #888; font-size: 0.85rem; }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .badge.yes { background: #22c55e22; color: #22c55e; border: 1px solid #22c55e44; }
    .badge.no { background: #ef444422; color: #ef4444; border: 1px solid #ef444444; }
    .type { color: #888; font-size: 0.85rem; }
    .total { color: #c9a84c; font-weight: 600; }
    .status { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
    .status.pending { color: #f59e0b; }
    .status.filled { color: #22c55e; }
    .status.cancelled { color: #ef4444; }
    .date { color: #666; font-size: 0.8rem; }
  `]
})
export class MyOrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  user = computed(() => this.userService.currentUser());

  pendingCount = computed(() => this.orders().filter(o => o.status === 'PENDING').length);
  filledCount = computed(() => this.orders().filter(o => o.status === 'FILLED').length);
  totalInvested = computed(() => this.orders().reduce((sum, o) => sum + (o.quantity * o.price / 100), 0));

  constructor(private marketService: MarketService, private userService: UserService) {}

  ngOnInit(): void {
    const user = this.userService.currentUser();
    if (!user) { this.loading.set(false); return; }

    this.marketService.getUserOrders(user.id).subscribe({
      next: (orders: Order[]) => { this.orders.set(orders); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
