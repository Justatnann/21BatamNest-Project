CREATE TABLE `raw_material` (
	`raw_material_id` int AUTO_INCREMENT NOT NULL,
	`raw_material_name` varchar(256) NOT NULL,
	`raw_material_stock` int NOT NULL,
	`unit` varchar(30) NOT NULL,
	CONSTRAINT `raw_material_raw_material_id` PRIMARY KEY(`raw_material_id`),
	CONSTRAINT `raw_material_raw_material_name_unique` UNIQUE(`raw_material_name`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`product_id` int AUTO_INCREMENT NOT NULL,
	`product_name` varchar(255) NOT NULL,
	`product_stock` int NOT NULL,
	`product_price` bigint NOT NULL,
	CONSTRAINT `products_product_id` PRIMARY KEY(`product_id`)
);
--> statement-breakpoint
CREATE TABLE `purchase_invoice` (
	`purchase_id` int AUTO_INCREMENT NOT NULL,
	`purchase_date` timestamp NOT NULL DEFAULT (now()),
	`amount_purchase` bigint NOT NULL,
	`user_id` int NOT NULL,
	CONSTRAINT `purchase_invoice_purchase_id` PRIMARY KEY(`purchase_id`)
);
--> statement-breakpoint
CREATE TABLE `purchase_item` (
	`puchase_item_id` int AUTO_INCREMENT NOT NULL,
	`purchase_id` int NOT NULL,
	`raw_material_id` int NOT NULL,
	`quantity` int NOT NULL,
	`unit_price` bigint NOT NULL,
	`total_price` bigint,
	CONSTRAINT `purchase_item_puchase_item_id` PRIMARY KEY(`puchase_item_id`)
);
--> statement-breakpoint
CREATE TABLE `sales_invoice` (
	`sales_id` int AUTO_INCREMENT NOT NULL,
	`sales_date` timestamp NOT NULL DEFAULT (now()),
	`amount_sold` bigint NOT NULL,
	`user_id` int NOT NULL,
	CONSTRAINT `sales_invoice_sales_id` PRIMARY KEY(`sales_id`)
);
--> statement-breakpoint
CREATE TABLE `sales_item` (
	`sales_item_id` int AUTO_INCREMENT NOT NULL,
	`sales_id` int NOT NULL,
	`product_id` int NOT NULL,
	`quantity` int NOT NULL,
	`unit_price` bigint NOT NULL,
	`total_price` bigint,
	CONSTRAINT `sales_item_sales_item_id` PRIMARY KEY(`sales_item_id`)
);
--> statement-breakpoint
CREATE TABLE `stock_material` (
	`stock_id` int AUTO_INCREMENT NOT NULL,
	`material_id` int,
	`initial_stock` int NOT NULL,
	`stock_sold` int NOT NULL,
	`remaining_stock` int NOT NULL,
	`date_mutated` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stock_material_stock_id` PRIMARY KEY(`stock_id`)
);
--> statement-breakpoint
CREATE TABLE `stock_product` (
	`stock_id` int AUTO_INCREMENT NOT NULL,
	`product_id` int,
	`initial_stock` int NOT NULL,
	`stock_sold` int NOT NULL,
	`remaining_stock` int NOT NULL,
	`date_mutated` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stock_product_stock_id` PRIMARY KEY(`stock_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `work_in_progress` (
	`wip_id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`raw_material_id` int NOT NULL,
	`quantity_used` int NOT NULL,
	`start_date` timestamp NOT NULL DEFAULT (now()),
	`end_date` timestamp,
	CONSTRAINT `work_in_progress_wip_id` PRIMARY KEY(`wip_id`)
);
--> statement-breakpoint
ALTER TABLE `purchase_invoice` ADD CONSTRAINT `purchase_invoice_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `purchase_item` ADD CONSTRAINT `purchase_item_purchase_id_purchase_invoice_purchase_id_fk` FOREIGN KEY (`purchase_id`) REFERENCES `purchase_invoice`(`purchase_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `purchase_item` ADD CONSTRAINT `purchase_item_raw_material_id_raw_material_raw_material_id_fk` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_material`(`raw_material_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_invoice` ADD CONSTRAINT `sales_invoice_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_item` ADD CONSTRAINT `sales_item_sales_id_sales_invoice_sales_id_fk` FOREIGN KEY (`sales_id`) REFERENCES `sales_invoice`(`sales_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_item` ADD CONSTRAINT `sales_item_product_id_products_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stock_material` ADD CONSTRAINT `stock_material_material_id_raw_material_raw_material_id_fk` FOREIGN KEY (`material_id`) REFERENCES `raw_material`(`raw_material_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stock_product` ADD CONSTRAINT `stock_product_product_id_products_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `work_in_progress` ADD CONSTRAINT `work_in_progress_product_id_products_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `work_in_progress` ADD CONSTRAINT `work_in_progress_raw_material_id_raw_material_raw_material_id_fk` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_material`(`raw_material_id`) ON DELETE no action ON UPDATE no action;