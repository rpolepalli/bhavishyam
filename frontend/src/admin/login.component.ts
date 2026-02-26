import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

@Component({
  selector: 'admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <img src="assets/logo.svg" class="logo-img" alt="Bhavishyam" />
        <h1>Admin Portal</h1>
        <p class="sub">Bhavishyam Backoffice</p>

        @if (error()) {
          <div class="error">{{ error() }}</div>
        }

        <form (ngSubmit)="login()">
          <div class="field">
            <label>Admin Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="admin@bhavishyam.in" required />
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required />
          </div>
          <button type="submit" [disabled]="loading()">
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(ellipse at center, #1a1400 0%, #0a0a0a 70%);
    }
    .login-card {
      background: #111;
      border: 1px solid #c9a84c33;
      border-radius: 10px;
      padding: 2rem;
      width: 340px;
      text-align: center;
    }
    .logo-img { width: 72px; height: auto; margin-bottom: 0.75rem; }
    h1 {
      font-size: 1.2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #c9a84c, #f5d78e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.2rem;
    }
    .sub { color: #555; font-size: 0.78rem; margin-bottom: 1.5rem; }
    .error {
      background: #ff444422;
      border: 1px solid #ff444444;
      color: #ff8888;
      padding: 8px;
      border-radius: 5px;
      font-size: 0.78rem;
      margin-bottom: 1rem;
    }
    .field { text-align: left; margin-bottom: 0.85rem; }
    .field label { display: block; color: #777; font-size: 0.72rem; margin-bottom: 5px; letter-spacing: 0.3px; }
    .field input {
      width: 100%;
      padding: 8px 11px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 5px;
      color: #eee;
      font-size: 0.85rem;
      box-sizing: border-box;
    }
    .field input:focus { outline: none; border-color: #c9a84c; }
    button[type=submit] {
      width: 100%;
      padding: 10px;
      background: linear-gradient(135deg, #c9a84c, #f5d78e);
      color: #0a0a0a;
      border: none;
      border-radius: 5px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      margin-top: 0.25rem;
    }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class AdminLoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private auth: AdminAuthService, private router: Router) {
    if (this.auth.isAuthenticated()) this.router.navigate(['/dashboard']);
  }

  login(): void {
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.error.set('Access denied. Admin credentials required.');
        this.loading.set(false);
      }
    });
  }
}
