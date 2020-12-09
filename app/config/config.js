let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
  config.database = {};
} else {
  config.database = {
    hostname: "rogue.db.elephantsql.com",
    database: "xhjtwwhy",
    user: "xhjtwwhy",
    password: "kuyGvYAZ4uAsIRlJxg0l2g5g2AOlS8aj",
    port: 5432
  };
}

const redirectSleepTime = 10 * 1000;


export { config, redirectSleepTime }; 