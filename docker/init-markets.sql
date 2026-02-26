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
