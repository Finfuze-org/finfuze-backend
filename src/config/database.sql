CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE finfuze;

-- Account Creation
CREATE TABLE person (
    -- user_id SERIAL PRIMARY KEY,
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50)  NOT NULL,
    last_name  VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    user_email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    user_password VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    otp TEXT,
    birth_date Date,
    otp_time TIMESTAMP,
    google_id VARCHAR(255),
    facebook_id VARCHAR(255),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);


