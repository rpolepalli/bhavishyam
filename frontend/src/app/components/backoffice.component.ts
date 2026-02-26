import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketService } from '../services/market.service';
import { Market, MARKET_CATEGORIES, REAL_WORLD_TEMPLATES } from '../models/models';

@Component({
  selector: 'app-backoffice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>⚙ Backoffice</h1>
        <p class="sub">Create and manage prediction markets</p>
      </div>

      <div class="backoffice-grid">
        <!-- Create Market Form -->
        <div class="panel">
          <h2>Create New Market</h2>

          <div class="templates-section">
            <p class="section-label">Quick Templates (Real-World Events)</p>
            <div class="templates-grid">
              @for (tpl of templates; track tpl.title) {
                <button class="template-btn" (click)="applyTemplate(tpl)">
                  <span class="tpl-cat">{{ getCategoryIcon(tpl.category) }}</span>
                  <span class="tpl-title">{{ tpl.title }}</span>
                </button>
              }
            </div>
          </div>

          @if (success()) {
            <div class="success-msg">✓ Market created successfully!</div>
          }
          @if (error()) {
            <div class="error-msg">{{ error() }}</div>
          }

          <form (ngSubmit)="createMarket()">
            <div class="field">
              <label>Market Title</label>
              <input [(ngModel)]="form.title" name="title" placeholder="Will X happen by Y date?" required />
            </div>
            <div class="field">
              <label>Description</label>
              <textarea [(ngModel)]="form.description" name="description" rows="3"
                placeholder="Provide context and resolution criteria..."></textarea>
            </div>
            <div class="field-row">
              <div class="field">
                <label>Category</label>
                <select [(ngModel)]="form.category" name="category">
                  @for (cat of categories; track cat.key) {
                    <option [value]="cat.key">{{ cat.icon }} {{ cat.label }}</option>
                  }
                </select>
              </div>
              <div class="field">
                <label>End Date</label>
                <input type="datetime-local" [(ngModel)]="form.endDate" name="endDate" required />
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label>Initial YES Price (p)</label>
                <input type="number" [(ngModel)]="form.yesPrice" name="yesPrice" min="1" max="99" />
              </div>
              <div class="field">
                <label>Initial NO Price (p)</label>
                <input type="number" [(ngModel)]="form.noPrice" name="noPrice" min="1" max="99" />
              </div>
            </div>
            <button type="submit" class="btn-submit" [disabled]="loading()">
              {{ loading() ? 'Creating...' : '+ Create Market' }}
            </button>
          </form>
        </div>

        <!-- Active Markets List -->
        <div class="panel">
          <h2>Active Markets</h2>
          <button class="btn-refresh" (click)="loadMarkets()">↻ Refresh</button>

          @if (markets().length === 0) {
            <div class="empty">No markets yet.</div>
          }
          @for (market of markets(); track market.id) {
            <div class="market-item">
              <div class="market-item-header">
                <span class="cat-badge">{{ getCategoryIcon(market.category) }} {{ market.category }}</span>
                <span class="status-badge" [class]="market.status.toLowerCase()">{{ market.status }}</span>
              </div>
              <div class="market-item-title">{{ market.title }}</div>
              <div class="market-item-meta">
                <span>YES: {{ market.yesPrice }}p</span>
                <span>NO: {{ market.noPrice }}p</span>
                <span>Vol: {{ market.volume }}</span>
                <span>Ends: {{ market.endDate | date:'dd MMM yy' }}</span>
              </div>
              @if (market.status === 'ACTIVE') {
                <div class="settle-row">
                  <button class="btn-settle yes" (click)="settle(market.id, true)">Settle YES</button>
                  <button class="btn-settle no" (click)="settle(market.id, false)">Settle NO</button>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; margin: 0 auto; padding: 2rem; }
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
    .backoffice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .panel {
      background: #111;
      border: 1px solid #222;
      border-radius: 10px;
      padding: 1.5rem;
    }
    .panel h2 {
      font-size: 1.1rem;
      color: #c9a84c;
      margin: 0 0 1.25rem;
      font-weight: 600;
    }
    .section-label { color: #666; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.75rem; }
    .templates-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1.5rem; }
    .template-btn {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 6px;
      padding: 8px 10px;
      cursor: pointer;
      text-align: left;
      display: flex;
      gap: 6px;
      align-items: flex-start;
      transition: border-color 0.2s;
    }
    .template-btn:hover { border-color: #c9a84c44; }
    .tpl-cat { font-size: 1rem; flex-shrink: 0; }
    .tpl-title { font-size: 0.75rem; color: #aaa; line-height: 1.3; }
    .success-msg {
      background: #22c55e22;
      border: 1px solid #22c55e44;
      color: #22c55e;
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.85rem;
    }
    .error-msg {
      background: #ff444422;
      border: 1px solid #ff444444;
      color: #ff8888;
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.85rem;
    }
    .field { margin-bottom: 1rem; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .field label { display: block; color: #888; font-size: 0.75rem; margin-bottom: 6px; letter-spacing: 0.5px; }
    .field input, .field textarea, .field select {
      width: 100%;
      padding: 9px 12px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 6px;
      color: #eee;
      font-size: 0.9rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
      font-family: inherit;
    }
    .field input:focus, .field textarea:focus, .field select:focus {
      outline: none;
      border-color: #c9a84c;
    }
    .field select option { background: #1a1a1a; }
    .btn-submit {
      width: 100%;
      padding: 11px;
      background: linear-gradient(135deg, #c9a84c, #f5d78e);
      color: #0a0a0a;
      border: none;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-submit:hover:not(:disabled) { opacity: 0.85; }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-refresh {
      background: none;
      border: 1px solid #333;
      color: #888;
      padding: 5px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      margin-bottom: 1rem;
    }
    .btn-refresh:hover { border-color: #c9a84c; color: #c9a84c; }
    .empty { color: #555; text-align: center; padding: 2rem; font-size: 0.9rem; }
    .market-item {
      border: 1px solid #1e1e1e;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
      background: #0d0d0d;
    }
    .market-item-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .cat-badge { font-size: 0.75rem; color: #888; }
    .status-badge {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .status-badge.active { background: #22c55e22; color: #22c55e; }
    .status-badge.closed { background: #ef444422; color: #ef4444; }
    .status-badge.settled { background: #c9a84c22; color: #c9a84c; }
    .market-item-title { color: #ddd; font-size: 0.9rem; margin-bottom: 8px; line-height: 1.4; }
    .market-item-meta { display: flex; gap: 12px; font-size: 0.75rem; color: #666; margin-bottom: 8px; }
    .settle-row { display: flex; gap: 8px; }
    .btn-settle {
      flex: 1;
      padding: 5px;
      border: none;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-settle.yes { background: #22c55e22; color: #22c55e; border: 1px solid #22c55e44; }
    .btn-settle.no { background: #ef444422; color: #ef4444; border: 1px solid #ef444444; }
  `]
})
export class BackofficeComponent {
  categories = MARKET_CATEGORIES;
  templates = REAL_WORLD_TEMPLATES;
  markets = signal<Market[]>([]);
  loading = signal(false);
  success = signal(false);
  error = signal('');

  form = {
    title: '',
    description: '',
    category: 'POLITICS',
    endDate: '',
    yesPrice: 50,
    noPrice: 50
  };

  constructor(private marketService: MarketService) {
    this.loadMarkets();
  }

  getCategoryIcon(key: string): string {
    return MARKET_CATEGORIES.find(c => c.key === key)?.icon ?? '🔮';
  }

  applyTemplate(tpl: { title: string; category: string }): void {
    this.form.title = tpl.title;
    this.form.category = tpl.category;
  }

  loadMarkets(): void {
    this.marketService.getMarkets().subscribe(m => this.markets.set(m));
  }

  createMarket(): void {
    if (!this.form.title || !this.form.endDate) return;
    this.loading.set(true);
    this.error.set('');
    this.success.set(false);

    const market: Partial<Market> = {
      title: this.form.title,
      description: this.form.description,
      category: this.form.category,
      endDate: new Date(this.form.endDate),
      yesPrice: this.form.yesPrice,
      noPrice: this.form.noPrice,
      status: 'ACTIVE',
      volume: 0
    };

    this.marketService.createMarket(market).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        this.form = { title: '', description: '', category: 'POLITICS', endDate: '', yesPrice: 50, noPrice: 50 };
        this.loadMarkets();
        setTimeout(() => this.success.set(false), 3000);
      },
      error: () => {
        this.error.set('Failed to create market. Please try again.');
        this.loading.set(false);
      }
    });
  }

  settle(id: string, outcome: boolean): void {
    this.marketService.settleMarket(id, outcome).subscribe(() => this.loadMarkets());
  }
}
