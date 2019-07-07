DO $$ 
BEGIN

    raise notice 'DROP OLD TABLES'; 
    DROP TABLE IF EXISTS pictures, users_tags, notifications, blocks, messages, views, reports, likes, matches, searchs, nogos;
    DROP TABLE IF EXISTS users, legal_tags;
    
    raise notice 'CREATE TABLES users, pictures, messages, notifications, likes, matches, views, blocks, reports, legal_tags, users_tags';
    CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY NOT NULL, clearpwd VARCHAR(60), name VARCHAR(60) NOT NULL, first_name VARCHAR(60) NOT NULL, username VARCHAR(60) NOT NULL, online BOOLEAN, mail VARCHAR(100) NOT NULL, timestamp TIMESTAMP NOT NULL, last_connection TIMESTAMP, password VARCHAR(65) NOT NULL, active BOOLEAN  DEFAULT false, gender VARCHAR(2), sex_orientation VARCHAR(2), birth_date DATE, geoloc_empty BOOLEAN, geoloc_lat REAL, geoloc_long REAL, geoloc_city VARCHAR(201), geoloc_show BOOLEAN, geoloc_postal_code INTEGER, complete BOOLEAN, profession VARCHAR(60), short_desc VARCHAR(150), long_desc VARCHAR(1000), score INT DEFAULT 6);
    CREATE TABLE IF NOT EXISTS pictures (id SERIAL PRIMARY KEY NOT NULL, user_id INT REFERENCES users, profile_pic BOOLEAN, img bytea);
    CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, from_id INT REFERENCES users, to_id  INT REFERENCES users, timestamp TIMESTAMP, content VARCHAR(1000), seen BOOLEAN DEFAULT False);
    CREATE TABLE IF NOT EXISTS notifications (id SERIAL PRIMARY KEY, from_id INT REFERENCES users, to_id  INT REFERENCES users, timestamp TIMESTAMP, type VARCHAR, seen BOOLEAN DEFAULT False);
    CREATE TABLE IF NOT EXISTS likes (id SERIAL PRIMARY KEY, from_id INT REFERENCES users, to_id  INT REFERENCES users, timestamp TIMESTAMP, type INT);
    CREATE TABLE IF NOT EXISTS views (id SERIAL PRIMARY KEY, from_id INT REFERENCES users, to_id  INT REFERENCES users, timestamp TIMESTAMP);
    CREATE TABLE IF NOT EXISTS matches (id SERIAL PRIMARY KEY, from_id INT REFERENCES users, to_id  INT REFERENCES users, timestamp TIMESTAMP);
    CREATE TABLE IF NOT EXISTS blocks (id SERIAL PRIMARY KEY, from_id INT REFERENCES users, to_id  INT REFERENCES users, timestamp TIMESTAMP);
    CREATE TABLE IF NOT EXISTS reports (id SERIAL PRIMARY KEY, from_id INT REFERENCES users, to_id  INT REFERENCES users, timestamp TIMESTAMP, fakeProfile BOOLEAN, behaviour BOOLEAN, scam BOOLEAN, other BOOLEAN, comment VARCHAR(200));
    CREATE TABLE IF NOT EXISTS legal_tags (id SERIAL PRIMARY KEY NOT NULL,  tag VARCHAR(25) UNIQUE NOT NULL);
    CREATE TABLE IF NOT EXISTS users_tags (id SERIAL PRIMARY KEY NOT NULL, user_id INT REFERENCES users,  tag_id INT REFERENCES legal_tags);
    CREATE TABLE IF NOT EXISTS searchs (id SERIAL PRIMARY KEY NOT NULL, user_id INT REFERENCES users, criteria JSON, timestamp timestamp);
    CREATE TABLE IF NOT EXISTS nogos (id SERIAL PRIMARY KEY, from_id INT REFERENCES users, to_id  INT REFERENCES users, timestamp TIMESTAMP);

    raise notice 'CREATE FUNCTIONS distance_score, haversine, tag_score';
    CREATE OR REPLACE FUNCTION distance_score(max_dist double precision, dist double precision)
    RETURNS double precision AS 
    $BODY$ 
        SELECT 100 * (max_dist - dist) / max_dist AS distance_score
    $BODY$ 
    LANGUAGE sql;

    CREATE OR REPLACE FUNCTION haversine(lat1 numeric(10,6),long1 numeric(10,6), lat2 numeric(10,6), long2 numeric(10,6)) 
    RETURNS double precision AS 
    $BODY$ 
        SELECT 12749.223168 * asin(sqrt((sin(radians((lat2 - lat1) / 2))) ^ 2 + cos(radians(lat1)) * cos(radians(lat2)) * (sin(radians((long2 - long1) / 2))) ^ 2)) AS distance;
    $BODY$ 
    LANGUAGE sql;

    CREATE OR REPLACE FUNCTION tag_score(ptm_id INT, ptm_tags_nb INT)
    RETURNS TABLE (id INT, score BIGINT) AS
    $func$ 
        BEGIN   
        RETURN 
            QUERY SELECT user_id, count(DISTINCT tag_id) * 100/ ptm_tags_nb AS score FROM users_tags WHERE tag_id IN
            (SELECT tag_id FROM users_tags WHERE user_id = ptm_id ) GROUP BY user_id;
        END 
    $func$  
    LANGUAGE plpgsql;

END$$;

