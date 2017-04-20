DROP USER 'ct101'@'localhost';
CREATE USER 'ct101'@'localhost' IDENTIFIED BY 'goal101++';
DROP DATABASE IF EXISTS ct101;
CREATE DATABASE ct101 DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
GRANT ALL PRIVILEGES ON ct101.* to 'ct101'@'localhost' WITH GRANT OPTION;
USE ct101;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES ('2014_10_12_000000_create_users_table',1),('2014_10_12_100000_create_password_resets_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  KEY `password_resets_email_index` (`email`),
  KEY `password_resets_token_index` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `ct_component`
--
DROP TABLE IF EXISTS `ct_component`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `ct_component` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL DEFAULT "",
  `description` varchar(1000),
  `location_x` int(11) NOT NULL DEFAULT 0,
  `location_y` int(11) NOT NULL DEFAULT 0,
  `ratio` int(11) NOT NULL DEFAULT 1,
  `due` datetime,
  `creator_id` int(11) NOT NULL,
  `background_class` varchar(50) DEFAULT '',
  `component_picture_url` varchar(1000) NOT NULL DEFAULT "",
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `privacy_id` int(11) NOT NULL,
  `order` int(11) NOT NULL DEFAULT '1',
  `status` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `component_creator_id` (`creator_id`),
  KEY `component_type_id` (`type_id`),
  KEY `component_privacy_id` (`privacy_id`),
  CONSTRAINT `component_creator_id` FOREIGN KEY (`creator_id`) REFERENCES `ct_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `component_type_id` FOREIGN KEY (`type_id`) REFERENCES `ct_level` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `component_privacy_id` FOREIGN KEY (`privacy_id`) REFERENCES `ct_level` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `ct_level`
--
DROP TABLE IF EXISTS `ct_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ct_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_level_id` int(11),
  `title` varchar(50) NOT NULL,
  `code` varchar(150),
  `description` varchar(150),
  `long_description` varchar(500),
  `icon` varchar(50) NOT NULL,
  `background_color` varchar(50) DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `level_parent_level_id` (`parent_level_id`),
  CONSTRAINT `level_parent_level_id` FOREIGN KEY (`parent_level_id`) REFERENCES `ct_level` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `ct_user`
--
DROP TABLE IF EXISTS `ct_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ct_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) NOT NULL,
  `password` varchar(128) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `lastname` varchar(100) NOT NULL DEFAULT '',
  `firstname` varchar(100) NOT NULL DEFAULT '',
  `avatar_url` varchar(200) NOT NULL DEFAULT 'ct-avatar.jpg',
  `theme_color` varchar(200) NOT NULL DEFAULT 'md-blue-400-bg',
  `gender` varchar(1) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL DEFAULT '',
  `address` varchar(255) NOT NULL DEFAULT '',
  `superuser` int(1) NOT NULL DEFAULT '0',
  `status` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ct_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------- LEVEL ---------------
load data local infile 'C:/xampp/htdocs/cats101/database/data/initializers/level.txt'
    into table ct101.ct_level
    fields terminated by '\t'
    enclosed by '"'
    escaped by '\\'
    lines terminated by '\r\n'
    ignore 1 LINES
    (`id`, `parent_level_id`,`title`, `code`, `description`, `long_description`, `icon`, `background_color`);

-- ----------- COMPONENT ---------------
load data local infile 'C:/xampp/htdocs/cats101/database/data/initializers/component.txt'
    into table ct101.ct_component
    fields terminated by '\t'
    enclosed by '"'
    escaped by '\\'
    lines terminated by '\r\n'
    ignore 1 LINES
 (`id`,	`type_id`,	`title`,	`description`,	`location_x`,	`location_y`,	`ratio`, `due`,	`creator_id`,	`background_class`, `component_picture_url`,	`created_at`,	`updated_at`,	`privacy_id`,	`order`,	`status`);


-- ------------------ USER ------------------
load data local infile 'C:/xampp/htdocs/cats101/database/data/initializers/user.txt'
    into table ct101.ct_user
    fields terminated by '\t'
    enclosed by '"'
    escaped by '\\'
    lines terminated by '\r\n'
    ignore 1 LINES
    (`id`, `email`, `password`, `remember_token`, `lastname`, `firstname`, `avatar_url`, `theme_color`, `gender`, `birthdate`, `phone_number`, `address`, `superuser`, `status`);
