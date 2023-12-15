const { int, timestamp, mysqlTable, varchar, text } = require("drizzle-orm/mysql-core");
const rawMaterial = mysqlTable("raw_material", {
  rawMaterialId: int("raw_material_id").primaryKey({ autoIncrement: true }).autoincrement(),
  rawMaterialName: varchar("raw_material_name", { length: 256 }).unique().notNull(),
  rawMaterialStock: int("raw_material_stock").notNull(),
  unit: varchar("unit", { length: 30 }).notNull(),
});

module.exports = { rawMaterial };
