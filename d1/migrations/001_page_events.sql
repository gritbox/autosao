CREATE TABLE IF NOT EXISTS page_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id TEXT NOT NULL,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  page_path TEXT NOT NULL,
  visitor_type TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  country TEXT
);

CREATE INDEX idx_client_timestamp ON page_events (client_id, timestamp);
CREATE INDEX idx_client_visitor ON page_events (client_id, visitor_type);