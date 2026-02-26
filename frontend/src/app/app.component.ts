import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';
import { TradingComponent } from './components/trading.component';
import { MarketService } from './services/market.service';
import { MARKET_CATEGORIES } from './models/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, NavbarComponent, TradingComponent, RouterLinkActive],
  template: `
    <div class="app">
      <app-navbar />
      <div class="app-layout">

        <!-- Left sidebar -->
        <aside class="left-sidebar">
          <nav class="sidebar-nav">
            <a routerLink="/markets" routerLinkActive="active" [routerLinkActiveOptions]="{exact:false}"
               class="nav-item nav-markets" (click)="clearCategory()">
              <span class="nav-icon">📊</span>
              <span>Markets</span>
            </a>
            @for (cat of categories; track cat.key) {
              <a routerLink="/markets" class="nav-item cat-item"
                 [class.cat-active]="activeCategory() === cat.key"
                 (click)="setCategory(cat.key)">
                <span class="nav-icon">{{ cat.icon }}</span>
                <span>{{ cat.label }}</span>
                @if (countByCategory(cat.key) > 0) {
                  <span class="nav-count">{{ countByCategory(cat.key) }}</span>
                }
              </a>
            }
            <div class="nav-divider">Account</div>
            <a routerLink="/my-orders" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📋</span>
              <span>My Orders</span>
            </a>
          </nav>
        </aside>

        <!-- Main content -->
        <main class="main-content">
          <router-outlet />
        </main>

        <!-- Right trading panel -->
        @if (showTrading()) {
          <aside class="right-sidebar">
            <app-trading />
          </aside>
        }
      </div>
    </div>
  `,
  styles: [`
    .app { min-height: 100vh; background: #0a0a0a; color: #eee; display: flex; flex-direction: column; }
    .app-layout { display: flex; flex: 1; min-height: 0; }

    .left-sidebar {
      width: 200px;
      flex-shrink: 0;
      background: #0d0d0d;
      border-right: 1px solid #161616;
      padding: 0.75rem 0;
      position: sticky;
      top: 56px;
      height: calc(100vh - 56px);
      overflow-y: auto;
    }
    .sidebar-nav { display: flex; flex-direction: column; gap: 1px; padding: 0 8px; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 8px 10px;
      border-radius: 6px;
      color: #888;
      text-decoration: none;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .nav-item:hover { background: #161616; color: #ccc; }
    .nav-item.active, .nav-item.cat-active { background: #c9a84c15; color: #c9a84c; }
    .nav-markets { color: #c9a84c; font-weight: 600; }
    .nav-icon { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }
    .nav-count {
      margin-left: auto;
      background: #1e1e1e;
      color: #666;
      font-size: 0.7rem;
      padding: 1px 6px;
      border-radius: 8px;
    }
    .nav-item.cat-active .nav-count { background: #c9a84c22; color: #c9a84c; }
    .nav-divider {
      font-size: 0.65rem;
      color: #444;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 10px 10px 4px;
    }

    .main-content { flex: 1; min-width: 0; overflow: auto; }

    .right-sidebar {
      width: 280px;
      flex-shrink: 0;
      padding: 0.75rem;
      border-left: 1px solid #161616;
      position: sticky;
      top: 56px;
      height: calc(100vh - 56px);
      overflow-y: auto;
    }
  `]
})
export class AppComponent {
  categories = MARKET_CATEGORIES;
  activeCategory = this.marketService.activeCategory;
  showTrading = computed(() => !!this.marketService.selectedMarket());

  constructor(private marketService: MarketService) {}

  setCategory(key: string): void {
    this.activeCategory.set(this.activeCategory() === key ? '' : key);
  }

  clearCategory(): void {
    this.activeCategory.set('');
  }

  countByCategory(key: string): number {
    return this.marketService.markets().filter(m => (m.category || '').toUpperCase() === key.toUpperCase()).length;
  }
}
