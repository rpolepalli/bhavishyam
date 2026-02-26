import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="brand">
        <img src="assets/logo.svg" class="logo-img" alt="Bhavishyam" />
        <div class="brand-text">
          <span class="brand-name">Bhavishyam</span>
          <span class="brand-tagline">Predict the Future</span>
        </div>
      </a>

      <div class="nav-links">
        <a routerLink="/markets" routerLinkActive="active">Markets</a>
        @if (user()) {
          <a routerLink="/my-orders" routerLinkActive="active">My Orders</a>
          @if (isAdmin()) {
            <a href="/admin/" class="admin-link">⚙ Admin</a>
          }
        }
      </div>

      <div class="nav-actions">
        @if (user(); as u) {
          <div class="user-info">
            <span class="balance">₹{{ u.balance | number:'1.2-2' }}</span>
            <span class="username">{{ u.name }}</span>
            <button class="btn-ghost" (click)="logout()">Logout</button>
          </div>
        } @else {
          <a routerLink="/login" class="btn-outline">Login</a>
          <a routerLink="/register" class="btn-gold">Register</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      height: 56px;
      background: #0a0a0a;
      border-bottom: 1px solid #c9a84c33;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }
    .logo-img { height: 38px; width: auto; }
    .brand-text { display: flex; flex-direction: column; }
    .brand-name {
      font-size: 1.2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #c9a84c, #f5d78e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 0.5px;
    }
    .brand-tagline {
      font-size: 0.62rem;
      color: #c9a84c88;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .nav-links { display: flex; gap: 1.5rem; }
    .nav-links a {
      color: #999;
      text-decoration: none;
      font-size: 0.85rem;
      letter-spacing: 0.3px;
      transition: color 0.2s;
    }
    .nav-links a:hover, .nav-links a.active { color: #c9a84c; }
    .admin-link { color: #c9a84c88 !important; }
    .nav-actions { display: flex; align-items: center; gap: 0.75rem; }
    .user-info { display: flex; align-items: center; gap: 0.75rem; }
    .balance { color: #c9a84c; font-weight: 600; font-size: 0.85rem; }
    .username { color: #ccc; font-size: 0.85rem; }
    .btn-ghost {
      background: none;
      border: none;
      color: #777;
      cursor: pointer;
      font-size: 0.82rem;
    }
    .btn-ghost:hover { color: #c9a84c; }
    .btn-outline {
      padding: 6px 14px;
      border: 1px solid #c9a84c;
      color: #c9a84c;
      border-radius: 4px;
      text-decoration: none;
      font-size: 0.82rem;
      transition: all 0.2s;
    }
    .btn-outline:hover { background: #c9a84c22; }
    .btn-gold {
      padding: 6px 14px;
      background: linear-gradient(135deg, #c9a84c, #f5d78e);
      color: #0a0a0a;
      border-radius: 4px;
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 700;
      transition: opacity 0.2s;
    }
    .btn-gold:hover { opacity: 0.85; }
  `]
})
export class NavbarComponent {
  user = computed(() => this.userService.currentUser());
  isAdmin = computed(() => {
    const u = this.userService.currentUser();
    return u?.id === '1'; // simple admin check — user id 1 is admin
  });

  constructor(private userService: UserService) {}

  logout(): void {
    this.userService.logout();
  }
}
