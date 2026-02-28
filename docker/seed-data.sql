-- Bhavishyam Platform Seed Data
-- This file contains initial data for all services

-- =====================================================
-- MARKETS DATABASE SEED DATA
-- =====================================================

\c bhavishyam_markets;

-- Insert seed markets with diverse categories and realistic scenarios
INSERT INTO markets (title, description, category, end_date, status, yes_price, no_price, volume) VALUES
-- Cryptocurrency Markets
('Will Bitcoin reach $100,000 by end of 2026?', 'Prediction market for Bitcoin price reaching $100,000 USD by December 31, 2026', 'Cryptocurrency', '2026-12-31 23:59:59', 'ACTIVE', 45.50, 54.50, 1250.00),
('Will Ethereum exceed $5,000 in 2026?', 'Prediction market for Ethereum (ETH) price exceeding $5,000 at any point in 2026', 'Cryptocurrency', '2026-12-31 23:59:59', 'ACTIVE', 38.20, 61.80, 890.75),
('Will a new cryptocurrency enter top 5 by market cap in 2026?', 'Prediction market for whether a cryptocurrency not currently in top 5 will enter top 5 by market cap in 2026', 'Cryptocurrency', '2026-12-31 23:59:59', 'ACTIVE', 62.40, 37.60, 675.25),

-- Stock Markets
('Will Tesla stock price exceed $300 in 2026?', 'Prediction market for Tesla (TSLA) stock price exceeding $300 per share at any point in 2026', 'Stocks', '2026-12-31 23:59:59', 'ACTIVE', 62.30, 37.70, 890.50),
('Will Apple reach $250 per share in 2026?', 'Prediction market for Apple (AAPL) stock price reaching $250 per share at any point in 2026', 'Stocks', '2026-12-31 23:59:59', 'ACTIVE', 55.80, 44.20, 1120.00),
('Will NVIDIA stock split again in 2026?', 'Prediction market for whether NVIDIA will announce another stock split in 2026', 'Stocks', '2026-12-31 23:59:59', 'ACTIVE', 42.10, 57.90, 780.30),

-- Economics Markets
('Will there be a recession in the US in 2026?', 'Prediction market for whether the United States will experience a recession (two consecutive quarters of negative GDP growth) in 2026', 'Economics', '2026-12-31 23:59:59', 'ACTIVE', 28.75, 71.25, 2100.75),
('Will the Federal Reserve cut interest rates in Q1 2026?', 'Prediction market for whether the US Federal Reserve will cut interest rates at least once during the first quarter of 2026', 'Economics', '2026-03-31 23:59:59', 'ACTIVE', 55.40, 44.60, 980.00),
('Will inflation in India exceed 6% in 2026?', 'Prediction market for whether India''s Consumer Price Index (CPI) inflation will exceed 6% at any point in 2026', 'Economics', '2026-12-31 23:59:59', 'ACTIVE', 35.60, 64.40, 1340.50),

-- Technology Markets
('Will OpenAI release GPT-5 in 2026?', 'Prediction market for whether OpenAI will officially release GPT-5 or equivalent next-generation model in 2026', 'Technology', '2026-12-31 23:59:59', 'ACTIVE', 73.20, 26.80, 1650.25),
('Will Apple launch AR glasses in 2026?', 'Prediction market for whether Apple will officially launch consumer AR glasses in 2026', 'Technology', '2026-12-31 23:59:59', 'ACTIVE', 41.90, 58.10, 920.75),
('Will a quantum computer break RSA encryption in 2026?', 'Prediction market for whether a quantum computer will successfully break RSA-2048 encryption in 2026', 'Technology', '2026-12-31 23:59:59', 'ACTIVE', 12.30, 87.70, 450.00),

-- Space Markets
('Will SpaceX successfully land humans on Mars by 2026?', 'Prediction market for whether SpaceX will successfully land human astronauts on Mars by the end of 2026', 'Space', '2026-12-31 23:59:59', 'ACTIVE', 15.80, 84.20, 750.30),
('Will NASA launch Artemis III mission in 2026?', 'Prediction market for whether NASA will successfully launch the Artemis III lunar landing mission in 2026', 'Space', '2026-12-31 23:59:59', 'ACTIVE', 68.50, 31.50, 1200.00),
('Will India launch its first crewed space mission in 2026?', 'Prediction market for whether ISRO will successfully launch Gaganyaan with crew in 2026', 'Space', '2026-12-31 23:59:59', 'ACTIVE', 52.70, 47.30, 680.25),

-- Politics Markets
('Will the current US President win re-election in 2028?', 'Prediction market for the 2028 US Presidential election outcome', 'Politics', '2028-11-07 23:59:59', 'ACTIVE', 48.90, 51.10, 3200.50),
('Will UK hold a general election in 2026?', 'Prediction market for whether the United Kingdom will hold a general election in 2026', 'Politics', '2026-12-31 23:59:59', 'ACTIVE', 34.20, 65.80, 890.75),

-- Sports Markets
('Will India win the 2026 T20 World Cup?', 'Prediction market for India winning the ICC T20 World Cup 2026', 'Sports', '2026-06-30 23:59:59', 'ACTIVE', 22.40, 77.60, 1850.00),
('Will Lionel Messi play in the 2026 FIFA World Cup?', 'Prediction market for whether Lionel Messi will participate in the 2026 FIFA World Cup', 'Sports', '2026-07-19 23:59:59', 'ACTIVE', 31.80, 68.20, 2100.25),

-- Entertainment Markets
('Will a Bollywood film gross ₹1000 Cr worldwide in 2026?', 'Prediction market for whether any Bollywood film will gross ₹1000 crores worldwide in 2026', 'Entertainment', '2026-12-31 23:59:59', 'ACTIVE', 45.60, 54.40, 1120.50),
('Will Netflix launch ad-supported tier in India in 2026?', 'Prediction market for whether Netflix will launch an advertisement-supported subscription tier in India in 2026', 'Entertainment', '2026-12-31 23:59:59', 'ACTIVE', 67.30, 32.70, 780.00);

-- =====================================================
-- USERS DATABASE SEED DATA
-- =====================================================

\c bhavishyam_users;

-- Insert seed users
INSERT INTO users (email, name, password_hash, balance, created_at) VALUES
('admin@bhavishyam.com', 'Admin User', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VdLSnZpOeYNqL.vuI.FrU.SrTQBFRG', 100000.00, CURRENT_TIMESTAMP),
('demo@example.com', 'Demo User', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VdLSnZpOeYNqL.vuI.FrU.SrTQBFRG', 10000.00, CURRENT_TIMESTAMP),
('trader1@example.com', 'Active Trader', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VdLSnZpOeYNqL.vuI.FrU.SrTQBFRG', 5000.00, CURRENT_TIMESTAMP),
('investor@example.com', 'Smart Investor', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VdLSnZpOeYNqL.vuI.FrU.SrTQBFRG', 15000.00, CURRENT_TIMESTAMP),
('newbie@example.com', 'Market Newbie', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VdLSnZpOeYNqL.vuI.FrU.SrTQBFRG', 1000.00, CURRENT_TIMESTAMP);

-- Note: Password hash is for 'password123' - should be changed in production

-- =====================================================
-- WALLET DATABASE SEED DATA
-- =====================================================

\c bhavishyam_wallet;

-- Insert some sample transactions (balances are managed in user service)
INSERT INTO transactions (user_id, amount, type, reference, status, created_at) VALUES
(1, 100000.00, 'DEPOSIT', 'INITIAL_ADMIN_BALANCE', 'COMPLETED', CURRENT_TIMESTAMP),
(2, 10000.00, 'DEPOSIT', 'WELCOME_BONUS', 'COMPLETED', CURRENT_TIMESTAMP),
(3, 5000.00, 'DEPOSIT', 'INITIAL_DEPOSIT', 'COMPLETED', CURRENT_TIMESTAMP),
(4, 15000.00, 'DEPOSIT', 'INVESTMENT_FUND', 'COMPLETED', CURRENT_TIMESTAMP),
(5, 1000.00, 'DEPOSIT', 'STARTER_AMOUNT', 'COMPLETED', CURRENT_TIMESTAMP);

-- =====================================================
-- TRADING DATABASE SEED DATA
-- =====================================================

\c bhavishyam_trading;

-- Insert some sample orders to make the platform look active
INSERT INTO orders (market_id, user_id, side, type, quantity, price, status, created_at) VALUES
-- Bitcoin market orders
(1, 2, 'YES', 'BUY', 100, 45.50, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(1, 3, 'NO', 'BUY', 150, 54.50, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(1, 4, 'YES', 'BUY', 200, 46.00, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

-- Tesla market orders
(4, 2, 'YES', 'BUY', 80, 62.30, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
(4, 5, 'NO', 'BUY', 120, 37.70, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '2 hours'),

-- OpenAI GPT-5 market orders
(10, 3, 'YES', 'BUY', 300, 73.20, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '4 hours'),
(10, 4, 'YES', 'BUY', 150, 74.00, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '1 hour'),

-- Some pending orders
(1, 5, 'YES', 'BUY', 50, 44.00, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(4, 3, 'NO', 'BUY', 75, 36.00, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '10 minutes');

-- Insert positions based on filled orders
INSERT INTO positions (user_id, market_id, yes_shares, no_shares, avg_yes_price, avg_no_price, created_at, updated_at) VALUES
(2, 1, 100, 0, 45.50, 0, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(3, 1, 0, 150, 0, 54.50, CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(4, 1, 200, 0, 46.00, 0, CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(2, 4, 80, 0, 62.30, 0, CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
(5, 4, 0, 120, 0, 37.70, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(3, 10, 300, 0, 73.20, 0, CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP - INTERVAL '4 hours'),
(4, 10, 150, 0, 74.00, 0, CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '1 hour');

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

SELECT 'Seed data insertion completed successfully!' as status;