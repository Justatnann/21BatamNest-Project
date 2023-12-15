const { int, timestamp, mysqlTable, varchar, text } = require("drizzle-orm/mysql-core");

const userSchema = mysqlTable("users", {
  userId: int("user_id").primaryKey({ autoIncrement: true }).autoincrement(),
  username: varchar("username", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
module.exports = { userSchema };
