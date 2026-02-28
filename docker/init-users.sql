CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(19, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Insert seed users
INSERT INTO users (email, name, password_hash, balance, created_at) VALUES
('admin@bhavishyam.com', 'Admin User', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VdLSnZpOeYNqL.vuI.FrU.SrTQBFRG', 100000.00, CURRENT_TIMESTAMP),
('demo@example.com', 'Demo User', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VdLSnZpOeYNqL.vuI.FrU.SrTQBFRG', 10000.00, CURRENT_TIMESTAMP),
('trader1@example.com', 'Active Trader', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VdLSnZpOeYNqL.vuI.FrU.SrTQBFRG', 5000.00, CURRENT_TIMESTAMP),
('investor@example.com', 'Smart Investor', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VdLSnZpOeYNqL.vuI.FrU.SrTQBFRG', 15000.00, CURRENT_TIMESTAMP),
('newbie@example.com', 'Market Newbie', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VdLSnZpOeYNqL.vuI.FrU.SrTQBFRG', 1000.00, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;
