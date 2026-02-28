CREATE TABLE IF NOT EXISTS markets (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    yes_price DECIMAL(10, 2) DEFAULT 50.00,
    no_price DECIMAL(10, 2) DEFAULT 50.00,
    volume DECIMAL(19, 2) DEFAULT 0,
    outcome BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_markets_status ON markets(status);
CREATE INDEX idx_markets_category ON markets(category);

-- Insert seed data for testing
INSERT INTO markets (title, description, category, end_date, status, yes_price, no_price, volume) VALUES
('Will Bitcoin reach $100,000 by end of 2026?', 'Prediction market for Bitcoin price reaching $100,000 USD by December 31, 2026', 'Cryptocurrency', '2026-12-31 23:59:59', 'ACTIVE', 45.50, 54.50, 1250.00),
('Will Tesla stock price exceed $300 in 2026?', 'Prediction market for Tesla (TSLA) stock price exceeding $300 per share at any point in 2026', 'Stocks', '2026-12-31 23:59:59', 'ACTIVE', 62.30, 37.70, 890.50),
('Will there be a recession in the US in 2026?', 'Prediction market for whether the United States will experience a recession (two consecutive quarters of negative GDP growth) in 2026', 'Economics', '2026-12-31 23:59:59', 'ACTIVE', 28.75, 71.25, 2100.75),
('Will OpenAI release GPT-5 in 2026?', 'Prediction market for whether OpenAI will officially release GPT-5 or equivalent next-generation model in 2026', 'Technology', '2026-12-31 23:59:59', 'ACTIVE', 73.20, 26.80, 1650.25),
('Will the Federal Reserve cut interest rates in Q1 2026?', 'Prediction market for whether the US Federal Reserve will cut interest rates at least once during the first quarter of 2026', 'Economics', '2026-03-31 23:59:59', 'ACTIVE', 55.40, 44.60, 980.00),
('Will SpaceX successfully land humans on Mars by 2026?', 'Prediction market for whether SpaceX will successfully land human astronauts on Mars by the end of 2026', 'Space', '2026-12-31 23:59:59', 'ACTIVE', 15.80, 84.20, 750.30);
