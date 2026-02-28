export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  endDate: Date;
  status: 'ACTIVE' | 'CLOSED' | 'SETTLED';
  yesPrice: number;
  noPrice: number;
  volume: number;
  outcome?: boolean;
}

export interface Order {
  id: string;
  marketId: string | number;
  userId: string | number;
  side: 'YES' | 'NO';
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  status: 'PENDING' | 'FILLED' | 'CANCELLED';
  createdAt: Date;
}

export interface Position {
  marketId: string;
  marketTitle: string;
  yesShares: number;
  noShares: number;
  avgYesPrice: number;
  avgNoPrice: number;
  currentValue: number;
  profitLoss: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADE';
  createdAt: Date;
}

export interface PriceUpdate {
  marketId: string;
  yesPrice: number;
  noPrice: number;
  volume?: number;
  timestamp: Date;
}

export const MARKET_CATEGORIES = [
  { key: 'Cryptocurrency', label: 'Cryptocurrency', icon: '₿' },
  { key: 'Stocks', label: 'Stocks', icon: '📈' },
  { key: 'Economics', label: 'Economics', icon: '💰' },
  { key: 'Technology', label: 'Technology', icon: '💻' },
  { key: 'Space', label: 'Space', icon: '🚀' },
  { key: 'POLITICS', label: 'Politics', icon: '🏛️' },
  { key: 'SPORTS', label: 'Sports', icon: '⚽' },
  { key: 'ENTERTAINMENT', label: 'Entertainment', icon: '🎬' },
  { key: 'WEATHER', label: 'Weather', icon: '🌦️' },
  { key: 'OTHER', label: 'Other', icon: '🔮' },
];

export const REAL_WORLD_TEMPLATES = [
  { title: 'Will [Team A] win the next match?', category: 'SPORTS' },
  { title: 'Will Bitcoin exceed $100K by end of month?', category: 'CRYPTO' },
  { title: 'Will the RBI cut interest rates this quarter?', category: 'ECONOMY' },
  { title: 'Will [Party] win the upcoming state election?', category: 'POLITICS' },
  { title: 'Will [Movie] gross ₹100 Cr in opening weekend?', category: 'ENTERTAINMENT' },
  { title: 'Will it rain in Mumbai this weekend?', category: 'WEATHER' },
  { title: 'Will [Company] IPO this year?', category: 'TECHNOLOGY' },
];
