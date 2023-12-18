ALTER TABLE `purchase_item` DROP FOREIGN KEY `purchase_item_purchase_id_purchase_invoice_purchase_id_fk`;
--> statement-breakpoint
ALTER TABLE `purchase_item` DROP FOREIGN KEY `purchase_item_raw_material_id_raw_material_raw_material_id_fk`;
--> statement-breakpoint
ALTER TABLE `sales_item` DROP FOREIGN KEY `sales_item_sales_id_sales_invoice_sales_id_fk`;
--> statement-breakpoint
ALTER TABLE `sales_item` DROP FOREIGN KEY `sales_item_product_id_products_product_id_fk`;
--> statement-breakpoint
ALTER TABLE `stock_material` DROP FOREIGN KEY `stock_material_material_id_raw_material_raw_material_id_fk`;
--> statement-breakpoint
ALTER TABLE `stock_product` DROP FOREIGN KEY `stock_product_product_id_products_product_id_fk`;
--> statement-breakpoint
ALTER TABLE `work_in_progress` DROP FOREIGN KEY `work_in_progress_product_id_products_product_id_fk`;
--> statement-breakpoint
ALTER TABLE `work_in_progress` DROP FOREIGN KEY `work_in_progress_raw_material_id_raw_material_raw_material_id_fk`;
--> statement-breakpoint
ALTER TABLE `work_in_progress` DROP COLUMN `raw_material_id`;