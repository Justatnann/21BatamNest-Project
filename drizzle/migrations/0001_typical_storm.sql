ALTER TABLE `stock_material` MODIFY COLUMN `material_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `stock_product` MODIFY COLUMN `product_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `raw_material` ADD `raw_material_price` int NOT NULL;