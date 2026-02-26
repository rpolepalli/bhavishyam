import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Market, MARKET_CATEGORIES, REAL_WORLD_TEMPLATES } from '../app/models/models';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <div class="sidebar">
        <nav>
          <button [class.active]="tab() === 'markets'" (click)="tab.set('markets')">📊 Markets</button>
          <button [class.active]="tab() === 'users'" (click)="tab.set('users')">👥 Users</button>
        </nav>
      </div>

      <div class="content">
        @if (tab() === 'markets') {
          <div class="section-header">
            <h2>Markets</h2>
            <button class="btn-primary" (click)="showCreate.set(!showCreate())">
              {{ showCreate() ? '✕ Cancel' : '+ New Market' }}
            </button>
          </div>

          @if (showCreate()) {
            <div class="create-panel">
              <h3>Create Market</h3>

              <div class="templates">
                <p class="label">Quick Templates</p>
                <div class="tpl-grid">
                  @for (tpl of templates; track tpl.title) {
                    <button class="tpl-btn" (click)="applyTemplate(tpl)">
                      {{ getCategoryIcon(tpl.category) }} {{ tpl.title }}
                    </button>
                  }
                </div>
              </div>

              @if (createSuccess()) { <div class="msg-success">✓ Market created!</div> }
              @if (createError()) { <div class="msg-error">{{ createError() }}</div> }

              <div class="form-grid">
                <div class="field full">
                  <label>Title</label>
                  <input [(ngModel)]="form.title" placeholder="Will X happen by Y?" />
                </div>
                <div class="field full">
                  <label>Description</label>
                  <textarea [(ngModel)]="form.description" rows="2" placeholder="Resolution criteria..."></textarea>
                </div>
                <div class="field">
                  <label>Category</label>
                  <select [(ngModel)]="form.category">
                    @for (cat of categories; track cat.key) {
                      <option [value]="cat.key">{{ cat.icon }} {{ cat.label }}</option>
                    }
                  </select>
                </div>
                <div class="field">
                  <label>End Date</label>
                  <input type="datetime-local" [(ngModel)]="form.endDate" />
                </div>
                <div class="field">
                  <label>YES Price (p)</label>
                  <input type="number" [(ngModel)]="form.yesPrice" min="1" max="99" />
                </div>
                <div class="field">
                  <label>NO Price (p)</label>
                  <input type="number" [(ngModel)]="form.noPrice" min="1" max="99" />
                </div>
              </div>
              <button class="btn-primary" (click)="createMarket()" [disabled]="creating()">
                {{ creating() ? 'Creating...' : 'Create Market' }}
              </button>
            </div>
          }

          <div class="markets-table">
            <div class="table-head">
              <span>Title</span><span>Category</span><span>YES</span><span>NO</span><span>Vol</span><span>Ends</span><span>Status</span><span>Actions</span>
            </div>
            @for (m of markets(); track m.id) {
              <div class="table-row">
                <span class="title-cell">{{ m.title }}</span>
                <span class="cat-cell">{{ getCategoryIcon(m.category) }} {{ m.category }}</span>
                <span class="yes-cell">{{ m.yesPrice }}p</span>
                <span class="no-cell">{{ m.noPrice }}p</span>
                <span>{{ m.volume }}</span>
                <span>{{ m.endDate | date:'dd MMM yy' }}</span>
                <span class="status" [class]="m.status.toLowerCase()">{{ m.status }}</span>
                <span class="actions">
                  @if (m.status === 'ACTIVE') {
                    <button class="btn-yes" (click)="settle(m.id, true)">YES</button>
                    <button class="btn-no" (click)="settle(m.id, false)">NO</button>
                  }
                </span>
              </div>
            }
          </div>
        }

        @if (tab() === 'users') {
          <div class="section-header"><h2>Users</h2></div>
          <div class="markets-table">
            <div class="table-head">
              <span>ID</span><span>Name</span><span>Email</span><span>Balance</span>
            </div>
            @for (u of users(); track u.id) {
              <div class="table-row">
                <span>#{{ u.id }}</span>
                <span>{{ u.name }}</span>
                <span class="email-cell">{{ u.email }}</span>
                <span class="yes-cell">₹{{ u.balance | number:'1.2-2' }}</span>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard { display: flex; min-height: calc(100vh - 52px); }
    .sidebar {
      width: 160px;
      background: #0d0d0d;
      border-right: 1px solid #1a1a1a;
      padding: 1rem 0;
      flex-shrink: 0;
    }
    .sidebar nav { display: flex; flex-direction: column; gap: 2px; padding: 0 8px; }
    .sidebar nav button {
      background: none;
      border: none;
      color: #777;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.78rem;
      text-align: left;
      transition: all 0.15s;
    }
    .sidebar nav button:hover { background: #1a1a1a; color: #ccc; }
    .sidebar nav button.active { background: #c9a84c22; color: #c9a84c; }
    .content { flex: 1; padding: 1.5rem; overflow: auto; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
    .section-header h2 { font-size: 1rem; font-weight: 600; color: #ddd; }
    .btn-primary {
      padding: 6px 14px;
      background: linear-gradient(135deg, #c9a84c, #f5d78e);
      color: #0a0a0a;
      border: none;
      border-radius: 5px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .create-panel {
      background: #111;
      border: 1px solid #1e1e1e;
      border-radius: 8px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .create-panel h3 { font-size: 0.85rem; color: #c9a84c; margin-bottom: 1rem; }
    .templates { margin-bottom: 1rem; }
    .label { font-size: 0.7rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem; }
    .tpl-grid { display: flex; flex-wrap: wrap; gap: 6px; }
    .tpl-btn {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      color: #999;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.72rem;
      cursor: pointer;
    }
    .tpl-btn:hover { border-color: #c9a84c44; color: #ccc; }
    .msg-success { background: #22c55e22; border: 1px solid #22c55e44; color: #22c55e; padding: 7px 10px; border-radius: 5px; font-size: 0.78rem; margin-bottom: 0.75rem; }
    .msg-error { background: #ff444422; border: 1px solid #ff444444; color: #ff8888; padding: 7px 10px; border-radius: 5px; font-size: 0.78rem; margin-bottom: 0.75rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }
    .field.full { grid-column: 1 / -1; }
    .field label { display: block; color: #777; font-size: 0.7rem; margin-bottom: 4px; }
    .field input, .field textarea, .field select {
      width: 100%;
      padding: 7px 10px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 5px;
      color: #eee;
      font-size: 0.82rem;
      box-sizing: border-box;
      font-family: inherit;
    }
    .field input:focus, .field textarea:focus, .field select:focus { outline: none; border-color: #c9a84c; }
    .field select option { background: #1a1a1a; }
    .markets-table { background: #111; border: 1px solid #1a1a1a; border-radius: 8px; overflow: hidden; }
    .table-head {
      display: grid;
      grid-template-columns: 3fr 1.2fr 0.6fr 0.6fr 0.6fr 1fr 0.8fr 1.2fr;
      padding: 9px 14px;
      background: #161616;
      color: #555;
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #1a1a1a;
    }
    .table-row {
      display: grid;
      grid-template-columns: 3fr 1.2fr 0.6fr 0.6fr 0.6fr 1fr 0.8fr 1.2fr;
      padding: 10px 14px;
      border-bottom: 1px solid #141414;
      align-items: center;
      font-size: 0.8rem;
      color: #bbb;
    }
    .table-row:last-child { border-bottom: none; }
    .table-row:hover { background: #141414; }
    .title-cell { color: #ddd; font-size: 0.78rem; }
    .cat-cell { color: #888; font-size: 0.75rem; }
    .email-cell { color: #888; font-size: 0.75rem; }
    .yes-cell { color: #22c55e; font-weight: 600; }
    .no-cell { color: #ef4444; font-weight: 600; }
    .status { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
    .status.active { color: #22c55e; }
    .status.closed { color: #ef4444; }
    .status.settled { color: #c9a84c; }
    .actions { display: flex; gap: 5px; }
    .btn-yes { background: #22c55e22; color: #22c55e; border: 1px solid #22c55e44; padding: 3px 8px; border-radius: 3px; font-size: 0.7rem; cursor: pointer; }
    .btn-no { background: #ef444422; color: #ef4444; border: 1px solid #ef444444; padding: 3px 8px; border-radius: 3px; font-size: 0.7rem; cursor: pointer; }
  `]
})
export class DashboardComponent {
  tab = signal<'markets' | 'users'>('markets');
  markets = signal<Market[]>([]);
  users = signal<any[]>([]);
  showCreate = signal(false);
  creating = signal(false);
  createSuccess = signal(false);
  createError = signal('');

  categories = MARKET_CATEGORIES;
  templates = REAL_WORLD_TEMPLATES;

  form = { title: '', description: '', category: 'POLITICS', endDate: '', yesPrice: 50, noPrice: 50 };

  constructor(private http: HttpClient) {
    this.loadMarkets();
    this.loadUsers();
  }

  getCategoryIcon(key: string): string {
    return MARKET_CATEGORIES.find(c => c.key === key)?.icon ?? '🔮';
  }

  applyTemplate(tpl: { title: string; category: string }): void {
    this.form.title = tpl.title;
    this.form.category = tpl.category;
  }

  loadMarkets(): void {
    this.http.get<Market[]>('/api/markets').subscribe(m => this.markets.set(m));
  }

  loadUsers(): void {
    this.http.get<any[]>('/api/users').subscribe(u => this.users.set(u));
  }

  createMarket(): void {
    if (!this.form.title || !this.form.endDate) return;
    this.creating.set(true);
    this.createError.set('');
    this.createSuccess.set(false);
    this.http.post<Market>('/api/markets', {
      title: this.form.title,
      description: this.form.description,
      category: this.form.category,
      endDate: new Date(this.form.endDate),
      yesPrice: this.form.yesPrice,
      noPrice: this.form.noPrice,
      status: 'ACTIVE',
      volume: 0
    }).subscribe({
      next: () => {
        this.createSuccess.set(true);
        this.creating.set(false);
        this.form = { title: '', description: '', category: 'POLITICS', endDate: '', yesPrice: 50, noPrice: 50 };
        this.loadMarkets();
        setTimeout(() => this.createSuccess.set(false), 3000);
      },
      error: () => { this.createError.set('Failed to create market.'); this.creating.set(false); }
    });
  }

  settle(id: string, outcome: boolean): void {
    this.http.post(`/api/markets/${id}/settle?outcome=${outcome}`, {}).subscribe(() => this.loadMarkets());
  }
}
