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
    contact_info VARCHAR(50),
    contact_address VARCHAR(255),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE transaction_status AS ENUM ('Pending','Confirmed','Failed');
CREATE TYPE transaction_type AS ENUM ('income','expense');
CREATE TYPE transaction_method AS ENUM ('credit card','bank transfer');
-------update transact date----
CREATE OR REPLACE FUNCTION update_transact_date()
RETURN TRIGGER AS $$
BEGIN
    NEW.transact_date = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

----trigger befor insertion------
CREATE TRIGGER before_insert_transaction
BEFORE INSERT ON transaction_history
FOR EACH ROW
EXECUTE FUNCTION update_transact_date();


CREATE TABLE transaction_history (
    transact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES person(user_id),
    amount NUMERIC (9,4),
    transact_status transaction_status,
    transact_type transact_type,
    payment_method transaction_method,
    receiver_id INTEGER NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    transact_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE account(
    account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES person(user_id),
    account_no INTEGER NOT NULL,
    account_type VARCHAR(50) DEFAULT 'finfuze',
    balance NUMERIC(9,4) DEFAULT 0.0000
)

CREATE TABLE CARDS (
    card_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id REFERENCES person(user_id),
    account_name VARCHAR (255) NOT NULL,
    account_no INTEGER NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
)
