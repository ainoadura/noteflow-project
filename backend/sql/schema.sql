-- backend/sql/schema.sql
CREATE TABLE IF NOT EXISTS notes (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,              
  type VARCHAR(50) NOT NULL CHECK (type IN ('standard', 'checklist', 'idea')),
  color VARCHAR(30),          
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS checklist_items (
  id VARCHAR(50) PRIMARY KEY, 
  note_id VARCHAR(50) NOT NULL REFERENCES notes(id) ON DELETE CASCADE, 
  text VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE
);