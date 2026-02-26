CREATE DATABASE IF NOT EXISTS todolist_db;

USE todolist_db;

CREATE TABLE IF NOT EXISTS tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);

INSERT INTO tareas (title, completed) VALUES ('Revisar el proyecto de Web I', false);