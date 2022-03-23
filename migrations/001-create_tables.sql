CREATE TABLE IF NOT EXISTS `raspga_links` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name`  VARCHAR(64) UNIQUE NOT NULL,
    `url` TEXT NOT NULL,
    `ip_address` VARCHAR(64) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `raspga_url_blacklist` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `hostname`  VARCHAR(64) NOT NULL UNIQUE,
    PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `raspga_links_access` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `link_id`  INT NOT NULL,
    `ip_address` VARCHAR(64) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY(`id`)
);