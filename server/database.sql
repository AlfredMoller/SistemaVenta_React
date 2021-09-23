 CREATE DATABASE logintutorial;
-- para crear una extension en la base de datos ->  create extension if not exists "uui-ossp"
/*l UUID es un código identificador estándar empleado en el proceso de construcción de software. 
Es utilizado para crear identificadores únicos universales que permitan reconocer e distinguir un objeto dentro de un sistema,
 o el mismo objeto en diferentes contextos*/


 CREATE TABLE users(
     id_users uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     username VARCHAR(255) NOT NULL,
     user_mail VARCHAR(255) NOT NULL,
     password VARCHAR(255) NOT NULL
 );