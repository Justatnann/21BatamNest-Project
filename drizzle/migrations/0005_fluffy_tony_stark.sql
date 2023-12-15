CREATE TABLE `recipe` (
	`product_id` int NOT NULL,
	`raw_material_id` int,
	`quantity` int NOT NULL
);
--> statement-breakpoint
ALTER TABLE `recipe` ADD CONSTRAINT `recipe_product_id_products_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recipe` ADD CONSTRAINT `recipe_raw_material_id_raw_material_raw_material_id_fk` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_material`(`raw_material_id`) ON DELETE no action ON UPDATE no action;