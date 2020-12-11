--CHECKLIST

--LOGIN FORM VALIDATION IS NOT PERFECT BUT BASICALLY WORKS
--REPORTING VALIDATION DOES NOT WORK


--API VALIDATION
--APIT TOTEUTETTU TLLÄ HETKELLÄ VÄÄRIN
--LANDING PAGE MORE COMPLICATED
--TESTS
--DEPLOY AT HEROKU
--CANT REPORT THINGS ON PASSED DAYS

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
  sleep_quality INTEGER CHECK (sleep_quality > 0 AND sleep_quality < 6),
  generic_mood_morning INTEGER CHECK (generic_mood_morning > 0 AND generic_mood_morning < 6),
  time_spent_on_sports_n_exercise DECIMAL,
  time_spent_studying DECIMAL,
  regularity_of_eating INTEGER CHECK (regularity_of_eating > 0 AND regularity_of_eating < 6),
  quality_of_eating INTEGER CHECK (quality_of_eating > 0 AND quality_of_eating < 6),
  generic_mood_evening INTEGER CHECK (generic_mood_evening > 0 AND generic_mood_evening < 6)  
);

