import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">🔮</div>
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-sub">Sign in to Bhavishyam</p>

        @if (error()) {
          <div class="error-msg">{{ error() }}</div>
        }

        <form (ngSubmit)="login()">
          <div class="field">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="you@example.com" required />
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn-submit" [disabled]="loading()">
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="auth-footer">
          Don't have an account? <a routerLink="/register">Register</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(ellipse at center, #1a1400 0%, #0a0a0a 70%);
    }
    .auth-card {
      background: #111;
      border: 1px solid #c9a84c33;
      border-radius: 12px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    .auth-logo { font-size: 3rem; margin-bottom: 1rem; }
    .auth-title {
      font-size: 1.6rem;
      font-weight: 700;
      background: linear-gradient(135deg, #c9a84c, #f5d78e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.25rem;
    }
    .auth-sub { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
    .error-msg {
      background: #ff444422;
      border: 1px solid #ff4444;
      color: #ff8888;
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.85rem;
    }
    .field { text-align: left; margin-bottom: 1rem; }
    .field label { display: block; color: #888; font-size: 0.8rem; margin-bottom: 6px; letter-spacing: 0.5px; }
    .field input {
      width: 100%;
      padding: 10px 14px;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 6px;
      color: #eee;
      font-size: 0.95rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .field input:focus { outline: none; border-color: #c9a84c; }
    .btn-submit {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #c9a84c, #f5d78e);
      color: #0a0a0a;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: opacity 0.2s;
    }
    .btn-submit:hover:not(:disabled) { opacity: 0.85; }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .auth-footer { color: #666; font-size: 0.85rem; margin-top: 1.5rem; }
    .auth-footer a { color: #c9a84c; text-decoration: none; }
    .auth-footer a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private userService: UserService, private router: Router) {}

  login(): void {
    if (!this.email) return;
    this.loading.set(true);
    this.error.set('');
    this.userService.login(this.email).subscribe({
      next: () => this.router.navigate(['/markets']),
      error: () => {
        this.error.set('Invalid credentials. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
