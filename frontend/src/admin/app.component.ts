import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

@Component({
  selector: 'admin-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="admin-shell">
      @if (admin()) {
        <header class="admin-header">
          <div class="brand">
            <img src="assets/logo.svg" class="logo-img" alt="Bhavishyam" />
            <span class="name">Bhavishyam</span>
            <span class="badge">Admin</span>
          </div>
          <div class="admin-info">
            <span class="admin-name">{{ admin()!.name }}</span>
            <button class="btn-logout" (click)="logout()">Logout</button>
          </div>
        </header>
      }
      <router-outlet />
    </div>
  `,
  styles: [`
    .admin-shell { min-height: 100vh; background: #0a0a0a; }
    .admin-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      height: 52px;
      background: #0d0d0d;
      border-bottom: 1px solid #c9a84c22;
    }
    .brand { display: flex; align-items: center; gap: 8px; }
    .logo-img { height: 30px; width: auto; }
    .name {
      font-size: 0.95rem;
      font-weight: 700;
      background: linear-gradient(135deg, #c9a84c, #f5d78e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .badge {
      font-size: 0.65rem;
      background: #c9a84c22;
      color: #c9a84c;
      border: 1px solid #c9a84c44;
      padding: 2px 7px;
      border-radius: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .admin-info { display: flex; align-items: center; gap: 1rem; }
    .admin-name { font-size: 0.8rem; color: #888; }
    .btn-logout {
      background: none;
      border: 1px solid #333;
      color: #666;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.75rem;
    }
    .btn-logout:hover { border-color: #c9a84c; color: #c9a84c; }
  `]
})
export class AdminAppComponent {
  admin = computed(() => this.auth.currentAdmin());
  constructor(private auth: AdminAuthService) {}
  logout(): void { this.auth.logout(); window.location.href = '/admin/login'; }
}
