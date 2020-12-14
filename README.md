WEB SOFTWARE DEVELOPMENT 2020
Author: Olaus Lintinen

# Self-Moneytoring
Simple web app for reporting behavior. Enables users to create account and use it to report
their daily behavior. Application also gives out some summary data. Deployed at
https://self-moneytoring.herokuapp.com/.

## Database / config
App uses PostgreSQL database. In order to run this application on your own computer run the following querys in PostgreSQL terminal in following order:


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


Ok, that should do the job. After this you need to change your database credential to the applications config file. This file can be found from app/config/config.js.


## Guidelines
One should make account at https://self-moneytoring.herokuapp.com/auth/registration. After that login and do some reporting as the app is ment for that. Also hacking, pentesting, crash testing, etc. is not allowed.

## Stats
Work put into this thingy
8.12.2020 6h
9.12.2020 5h
10.12.2020 6h
11.12.2020 13h
12.12.2020 7h
14.12.2020 11h
