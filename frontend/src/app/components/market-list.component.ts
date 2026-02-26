import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarketService } from '../services/market.service';
import { WebsocketService } from '../services/websocket.service';
import { Market, PriceUpdate, MARKET_CATEGORIES } from '../models/models';
import { MiniChartComponent } from './mini-chart.component';

@Component({
  selector: 'app-market-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MiniChartComponent],
  template: `
    <div class="markets-page">
      <div class="hero">
        <div class="hero-content">
          <h1>Prediction Markets</h1>
          <p>Trade on real-world outcomes. Buy YES or NO shares and profit from your predictions.</p>
          <div class="ws-status" [class.connected]="isConnected()">
            <span class="dot"></span>
            {{ isConnected() ? 'Live prices' : 'Connecting...' }}
          </div>
        </div>
      </div>

      <div class="search-bar">
        <input [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)"
          placeholder="🔍  Search markets..." class="search-input" />
      </div>

      @if (filteredMarkets().length === 0) {
        <div class="empty-state">
          <span class="empty-icon">🔮</span>
          <p>No markets found.</p>
        </div>
      }

      @for (group of groupedMarkets(); track group.category) {
        <div class="category-section">
          <div class="category-heading">
            <span class="cat-icon">{{ getCategoryIcon(group.category) }}</span>
            <span class="cat-name">{{ getCategoryLabel(group.category) }}</span>
            <span class="cat-line"></span>
            <span class="cat-total">{{ group.markets.length }} markets</span>
          </div>
          <div class="markets-grid">
            @for (market of group.markets; track market.id) {
              <div class="market-card" (click)="selectMarket(market)"
                [class.selected]="selectedMarket()?.id === market.id"
                [class.flash-up]="flashMap()[market.id + ''] === 'up'"
                [class.flash-down]="flashMap()[market.id + ''] === 'down'">
                <div class="card-header">
                  <span class="card-category">{{ getCategoryIcon(market.category) }}</span>
                  <span class="card-status" [class]="market.status.toLowerCase()">{{ market.status }}</span>
                </div>
                <h3 class="card-title">{{ market.title }}</h3>
                <p class="card-desc">{{ market.description }}</p>
                <div class="chart-row">
                  <app-mini-chart [data]="historyMap()[market.id + ''] || []"></app-mini-chart>
                </div>
                <div class="price-bar">
                  <div class="price-yes"
                    [style.width.%]="market.yesPrice"
                    [class.flash-green]="flashMap()[market.id + ''] === 'up'">
                    <span>YES {{ market.yesPrice }}p</span>
                  </div>
                  <div class="price-no"
                    [style.width.%]="market.noPrice"
                    [class.flash-red]="flashMap()[market.id + ''] === 'down'">
                    <span>NO {{ market.noPrice }}p</span>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="vol">Vol: {{ market.volume | number }}</span>
                  <span class="end-date">Ends {{ market.endDate | date:'dd MMM yy' }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .markets-page { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem 2.5rem; }
    .hero {
      background: linear-gradient(135deg, #1a1200 0%, #0d0d0d 100%);
      border: 1px solid #c9a84c22; border-radius: 10px;
      padding: 1.5rem 1.75rem; margin: 1rem 0;
      position: relative; overflow: hidden;
    }
    .hero::before {
      content: '🔮'; position: absolute; right: 1.5rem; top: 50%;
      transform: translateY(-50%); font-size: 5rem; opacity: 0.07;
    }
    .hero-content h1 {
      font-size: 1.3rem; font-weight: 800;
      background: linear-gradient(135deg, #c9a84c, #f5d78e);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; margin: 0 0 0.35rem;
    }
    .hero-content p { color: #777; font-size: 0.78rem; margin: 0 0 0.75rem; }
    .ws-status {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 0.68rem; color: #ef4444; background: #ef444411;
      padding: 3px 9px; border-radius: 20px; border: 1px solid #ef444433;
    }
    .ws-status.connected { color: #22c55e; background: #22c55e11; border-color: #22c55e33; }
    .dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
    .ws-status.connected .dot { animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

    .search-bar { margin-bottom: 1.25rem; }
    .search-input {
      width: 100%; padding: 8px 13px; background: #111;
      border: 1px solid #222; border-radius: 7px; color: #eee;
      font-size: 0.8rem; box-sizing: border-box;
    }
    .search-input:focus { outline: none; border-color: #c9a84c44; }

    .empty-state { text-align: center; padding: 3rem; color: #555; }
    .empty-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }

    .category-section { margin-bottom: 2rem; }
    .category-heading { display: flex; align-items: center; gap: 8px; margin-bottom: 0.75rem; }
    .cat-icon { font-size: 1rem; }
    .cat-name { font-size: 0.72rem; font-weight: 700; color: #c9a84c; text-transform: uppercase; letter-spacing: 1px; }
    .cat-line { flex: 1; height: 1px; background: #1a1a1a; }
    .cat-total { font-size: 0.68rem; color: #555; }

    .markets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
      gap: 0.75rem;
    }

    .market-card {
      background: #111; border: 1px solid #1e1e1e; border-radius: 9px;
      padding: 1rem; cursor: pointer; transition: all 0.2s;
    }
    .market-card:hover { border-color: #c9a84c44; transform: translateY(-1px); }
    .market-card.selected { border-color: #c9a84c; background: #1a1200; }
    .market-card.flash-up { animation: flashUp 0.6s ease-out; }
    .market-card.flash-down { animation: flashDown 0.6s ease-out; }
    @keyframes flashUp {
      0% { box-shadow: inset 0 0 0 1px #22c55e88, 0 0 12px #22c55e33; }
      100% { box-shadow: none; }
    }
    @keyframes flashDown {
      0% { box-shadow: inset 0 0 0 1px #ef444488, 0 0 12px #ef444433; }
      100% { box-shadow: none; }
    }

    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; }
    .card-category { font-size: 1rem; }
    .card-status {
      font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
      padding: 2px 7px; border-radius: 4px;
    }
    .card-status.active { background: #22c55e22; color: #22c55e; }
    .card-status.closed { background: #ef444422; color: #ef4444; }
    .card-status.settled { background: #c9a84c22; color: #c9a84c; }
    .card-title { font-size: 0.82rem; color: #ddd; margin: 0 0 0.4rem; line-height: 1.4; font-weight: 600; }
    .card-desc { font-size: 0.72rem; color: #666; margin: 0 0 0.5rem; line-height: 1.4; }

    .chart-row {
      margin-bottom: 0.5rem; background: #0a0a0a;
      border-radius: 5px; padding: 4px 6px; border: 1px solid #1a1a1a;
    }

    .price-bar {
      display: flex; height: 24px; border-radius: 5px; overflow: hidden;
      margin-bottom: 0.6rem; font-size: 0.68rem; font-weight: 700;
    }
    .price-yes {
      background: #22c55e22; border: 1px solid #22c55e44; color: #22c55e;
      display: flex; align-items: center; justify-content: center;
      min-width: 55px; transition: width 0.5s, background 0.3s;
    }
    .price-no {
      background: #ef444422; border: 1px solid #ef444444; color: #ef4444;
      display: flex; align-items: center; justify-content: center;
      min-width: 55px; transition: width 0.5s, background 0.3s;
    }
    .price-yes.flash-green { animation: priceFlashGreen 0.6s ease-out; }
    .price-no.flash-red { animation: priceFlashRed 0.6s ease-out; }
    @keyframes priceFlashGreen {
      0% { background: #22c55e55; color: #fff; } 100% { background: #22c55e22; color: #22c55e; }
    }
    @keyframes priceFlashRed {
      0% { background: #ef444455; color: #fff; } 100% { background: #ef444422; color: #ef4444; }
    }

    .card-footer { display: flex; justify-content: space-between; font-size: 0.68rem; color: #555; }
  `]
})
export class MarketListComponent implements OnInit {
  markets = signal<Market[]>([]);
  searchQuery = signal('');
  categories = MARKET_CATEGORIES;

  selectedMarket = computed(() => this.marketService.selectedMarket());
  isConnected = computed(() => this.wsService.connectionStatus() === 'connected');

  // Expose signals as computed so Angular template tracks changes
  historyMap = computed(() => this.wsService.priceHistory());
  flashMap = computed(() => this.wsService.priceFlash());

  filteredMarkets = computed((): Market[] => {
    let list = this.markets();
    const cat = this.marketService.activeCategory();
    if (cat) list = list.filter(m => (m.category || '').toUpperCase() === cat.toUpperCase());
    const q = this.searchQuery().toLowerCase();
    if (q) list = list.filter(m => m.title.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q));
    return list;
  });

  groupedMarkets = computed((): { category: string; markets: Market[] }[] => {
    const map = new Map<string, Market[]>();
    for (const m of this.filteredMarkets()) {
      const cat = m.category || 'OTHER';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(m);
    }
    return Array.from(map.entries()).map(([category, markets]) => ({ category, markets }));
  });

  constructor(private marketService: MarketService, private wsService: WebsocketService) {}

  ngOnInit(): void {
    this.loadMarkets();
    const wsUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;
    this.wsService.connect(wsUrl);
    this.wsService.subscribeToPrices().subscribe((update: PriceUpdate) => {
      this.markets.update(markets =>
        markets.map(m => String(m.id) === String(update.marketId)
          ? { ...m, yesPrice: update.yesPrice, noPrice: update.noPrice, ...(update.volume != null ? { volume: update.volume } : {}) }
          : m
        )
      );
    });
  }

  loadMarkets(): void {
    this.marketService.getMarkets().subscribe(markets => {
      this.markets.set(markets);
      this.marketService.markets.set(markets);
      this.wsService.seedHistory(markets);
    });
  }

  selectMarket(market: Market): void {
    this.marketService.selectedMarket.set(market);
    this.wsService.subscribeToMarket(market.id);
  }

  getCategoryIcon(key: string): string {
    return MARKET_CATEGORIES.find(c => c.key.toUpperCase() === (key || '').toUpperCase())?.icon ?? '🔮';
  }

  getCategoryLabel(key: string): string {
    return MARKET_CATEGORIES.find(c => c.key.toUpperCase() === (key || '').toUpperCase())?.label ?? key;
  }
}
