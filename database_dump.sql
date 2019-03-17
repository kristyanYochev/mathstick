-- MySQL dump 10.16  Distrib 10.2.14-MariaDB, for osx10.12 (x86_64)
--
-- Host: localhost    Database: sticks
-- ------------------------------------------------------
-- Server version	10.2.14-MariaDB

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

--
-- Table structure for table `bought_sticks`
--

DROP TABLE IF EXISTS `bought_sticks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bought_sticks` (
  `user_id` int(11) DEFAULT NULL,
  `stick_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bought_sticks`
--

LOCK TABLES `bought_sticks` WRITE;
/*!40000 ALTER TABLE `bought_sticks` DISABLE KEYS */;
/*!40000 ALTER TABLE `bought_sticks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `completed`
--

DROP TABLE IF EXISTS `completed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `completed` (
  `user_id` int(11) DEFAULT NULL,
  `equation_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `completed`
--

LOCK TABLES `completed` WRITE;
/*!40000 ALTER TABLE `completed` DISABLE KEYS */;
/*!40000 ALTER TABLE `completed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equations`
--

DROP TABLE IF EXISTS `equations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equation` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equations`
--

LOCK TABLES `equations` WRITE;
/*!40000 ALTER TABLE `equations` DISABLE KEYS */;
INSERT INTO `equations` VALUES (1,'55-6=40'),(2,'30-8=31'),(3,'83+0=89'),(4,'55-6=46'),(5,'59-0=50'),(6,'33-9=44'),(7,'30-9=31'),(8,'78+9=84'),(9,'57-6=31'),(10,'89-6=64'),(11,'98-0=82'),(12,'58-5=92'),(13,'68-9=39'),(14,'78-0=72'),(15,'96-6=99'),(16,'58-5=55'),(17,'5-2=8+1'),(18,'68-5=60'),(19,'68-8=90'),(20,'62-0=56'),(21,'99-9=95'),(22,'98+2=32'),(23,'66-3=61'),(24,'56-9=50'),(25,'30-8=39'),(26,'29-5=21'),(27,'58+8=98'),(28,'9-2=5'),(29,'99+8=91'),(30,'49+9=51'),(31,'53+0=59'),(32,'1+2=5'),(33,'78+8=89'),(34,'50+9=56'),(35,'48-6=43'),(36,'56-6=56'),(37,'60-8=66'),(38,'98-9=92'),(39,'59-5=34'),(40,'36+0=42'),(41,'53+6=50'),(42,'59+5=50'),(43,'50+6=42'),(44,'50-5=43'),(45,'9+6=16'),(46,'4+2=9'),(47,'8+3-4=9'),(48,'5+7=2'),(49,'0+3=2'),(50,'22+3=27'),(51,'58+6=94'),(52,'69+6=69'),(53,'60+6=96'),(54,'30+8=28'),(55,'98-8=60'),(56,'63+0=72'),(57,'98-5=95'),(58,'70-8=78'),(59,'98-8=38'),(60,'38-8=44');
/*!40000 ALTER TABLE `equations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `players` (
  `room_id` varchar(64) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `time_finished` decimal(10,0) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players`
--

LOCK TABLES `players` WRITE;
/*!40000 ALTER TABLE `players` DISABLE KEYS */;
/*!40000 ALTER TABLE `players` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rooms` (
  `room_id` varchar(64) DEFAULT NULL,
  `max_players` int(11) DEFAULT NULL,
  `time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sticks`
--

DROP TABLE IF EXISTS `sticks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sticks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stick` varchar(256) DEFAULT NULL,
  `url` varchar(256) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sticks`
--

LOCK TABLES `sticks` WRITE;
/*!40000 ALTER TABLE `sticks` DISABLE KEYS */;
INSERT INTO `sticks` VALUES (3,'/static/images/stick4.png','box_.png',50),(4,'/static/images/lazer.png','box_sw.png',50),(5,'/static/images/horn.png','unicorn_pink_box.png',50),(6,'/static/images/torch.png','creeper_box.png',50),(7,'/static/images/bone.png','skull_box_grey.png',50);
/*!40000 ALTER TABLE `sticks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(128) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `points` int(11) DEFAULT 0,
  `coins` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-17 15:27:59
