CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

DROP TABLE IF EXISTS projects;

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  tags VARCHAR(255),
  featured TINYINT DEFAULT 0
);

INSERT INTO projects (title, description, tags, featured) VALUES
('AreaFix BD',
 'Citizens report local problems with photos and map pins. It has role-based verification, live analytics with heatmaps, notifications and English/Bangla category suggestions.',
 'React, Node.js, Express, MongoDB, Tailwind CSS, Leaflet', 1),
('CourseMate BD',
 'Peer tutoring platform with real-time chat, tutor booking, resource sharing and a student marketplace.',
 'MERN', 0),
('BUA.COM',
 'Hiring system for verified household workers with three roles: Customer, Agent and Admin.',
 'PHP, MySQL, Bootstrap', 0),
('Real-Time Chat App',
 '1-to-1 messaging app with login, live message sync, user search and recent chats.',
 'Flutter, Firebase', 0),
('LifeDrop',
 'Blood donation platform that connects donors and seekers, with emergency requests and an admin dashboard.',
 'PHP, MySQL, Chart.js', 0),
('Electricity Bill Calculator',
 'Bangla/English desktop app that estimates DESCO and Palli Bidyut bills and compares the two providers.',
 'Python, Tkinter', 1);

DROP TABLE IF EXISTS skills;

CREATE TABLE skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(50) NOT NULL
);

INSERT INTO skills (category, name) VALUES
('Languages', 'Python'),
('Languages', 'Java'),
('Languages', 'SQL'),
('Languages', 'JavaScript'),
('Languages', 'PHP'),
('Front-end', 'HTML'),
('Front-end', 'CSS'),
('Front-end', 'JavaScript'),
('Front-end', 'React'),
('Front-end', 'Tailwind CSS'),
('Front-end', 'Bootstrap'),
('Back-end', 'Node.js'),
('Back-end', 'MySQL'),
('Back-end', 'MongoDB'),
('Back-end', 'Firebase'),
('Mobile', 'Flutter'),
('Mobile', 'Provider'),
('Networking', 'IPv4'),
('Networking', 'IPv6'),
('Networking', 'Subnetting'),
('Tools', 'Git'),
('Tools', 'GitHub'),
('Tools', 'VS Code'),
('Tools', 'IntelliJ IDEA'),
('Tools', 'Google Colab'),
('Tools', 'Canva');

DROP TABLE IF EXISTS certifications;

CREATE TABLE certifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL
);

INSERT INTO certifications (name) VALUES
('Oracle Certified Foundations Associate: Agentic AI'),
('CCNA: Introduction to Networks (Cisco)'),
('Introduction to Cybersecurity (Cisco)'),
('AI & Machine Learning Fundamentals (Grameenphone Academy)'),
('Basics of Python (UniAthena)');


DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);

INSERT INTO users (username, password) VALUES
('admin', 'admin123');
