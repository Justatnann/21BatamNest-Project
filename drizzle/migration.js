const { drizzle } = require("drizzle-orm/mysql2");
const { migrate } = require("drizzle-orm/mysql2/migrator");
const mysql = require("mysql2/promise");

//)  create the connection
const poolConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "batamnest",
  password: "",
});

const db = drizzle(poolConnection);

// this will automatically run needed migrations on the database
migrate(db, { migrationsFolder: "drizzle/migrations" })
  .then(() => {
    console.log("Migrated");
    process.exit(0);
  })
  .catch((err) => {
    console.log("Error Found");
    console.log(console.log(err));
    process.exit(0);
  });
