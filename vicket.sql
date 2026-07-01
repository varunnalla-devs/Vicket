CREATE DATABASE VICKET;
USE VICKET;

SHOW TABLES;

USE vicket;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    mobile VARCHAR(15) UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_photo VARCHAR(255),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    team_logo VARCHAR(255),
    captain_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (captain_id) REFERENCES users(user_id)
);

CREATE TABLE team_members (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    user_id INT,
    role VARCHAR(50),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE match_posts (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    match_date DATE,
    match_time TIME,
    overs INT,
    location VARCHAR(255),
    prize_money DECIMAL(10,2),
    contact_number VARCHAR(15),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE TABLE match_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT,
    requesting_team_id INT,
    status VARCHAR(20) DEFAULT 'PENDING',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES match_posts(match_id),
    FOREIGN KEY (requesting_team_id) REFERENCES teams(team_id)
);