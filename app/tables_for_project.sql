CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);

CREATE UNIQUE INDEX ON users((lower(email)));

CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  user_id INTEGER REFERENCES users(id),
  sleep_duration DECIMAL,
  sleep_quality INTEGER NOT NULL CHECK (sleep_quality > 0 AND sleep_quality < 6),
  time_spent_on_sports_n_exercise DECIMAL,
  time_spent_studying DECIMAL,
  regularity_of_eating INTEGER NOT NULL CHECK (sleep_quality > 0 AND sleep_quality < 6),
  quality_of_eating INTEGER NOT NULL CHECK (sleep_quality > 0 AND sleep_quality < 6),
  generic_mood INTEGER NOT NULL CHECK (sleep_quality > 0 AND sleep_quality < 6)  
);
