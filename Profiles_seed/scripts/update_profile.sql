CREATE OR REPLACE FUNCTION set_complete(ptm_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    picture BOOLEAN;
    tag BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT id from pictures WHERE profile_pic = true AND user_id = ptm_id) INTO picture;
    SELECT EXISTS (SELECT id from users_tags WHERE user_id = ptm_id) INTO tag;
    IF picture IS FALSE OR tag IS FALSE THEN RETURN false; END IF;
    UPDATE users SET complete = true WHERE id = ptm_id AND short_desc <> '' AND long_desc <> '' AND name <> '' AND first_name <> '' AND gender <> '' AND birth_date IS NOT NULL
        AND geoloc_city <> '' AND profession <> '';
    UPDATE users SET complete = false WHERE id = ptm_id AND short_desc = '' OR long_desc = '' OR name = '' OR first_name = '' OR gender = '' OR birth_date IS NULL
        OR geoloc_city = '' OR profession = '';
    RETURN true;

END
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION edit_profile(id1 INTEGER, field VARCHAR, new VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
   UPDATE users SET
       short_desc = CASE
          WHEN field = 'short_desc' THEN new ELSE short_desc END,
       long_desc = CASE
          WHEN field = 'long_desc' THEN new ELSE long_desc END,
       name = CASE
          WHEN field = 'name' THEN new ELSE name END,
       first_name = CASE
          WHEN field = 'first_name' THEN new ELSE first_name END,
       mail = CASE
          WHEN field = 'mail' THEN new ELSE mail END,
       sex_orientation = CASE
          WHEN field = 'sex_orientation' THEN new ELSE sex_orientation END,
       gender = CASE
          WHEN field = 'gender' THEN new ELSE gender END,
       birth_date = CASE
          WHEN field = 'birth_date' THEN CAST(new AS DATE) ELSE birth_date END,
       geoloc_city = CASE
          WHEN field = 'geoloc_city' THEN new ELSE geoloc_city END,
       profession = CASE
          WHEN field = 'profession' THEN new ELSE profession END,
       geoloc_lat = CASE
          WHEN field = 'geoloc_lat' THEN CAST(new AS REAL) ELSE geoloc_lat END,
       geoloc_long = CASE
          WHEN field = 'geoloc_long' THEN CAST(new AS REAL) ELSE geoloc_long END,
       geoloc_postal_code = CASE
          WHEN field = 'geoloc_postal_code' THEN CAST(new AS REAL) ELSE geoloc_postal_code END
    WHERE id = id1;
    PERFORM set_complete(id1);
    RETURN TRUE;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION edit_tags(id2 INTEGER, arr INTEGER[])
RETURNS BOOLEAN AS $$
DECLARE
    tag INTEGER;
BEGIN
    DELETE FROM users_tags WHERE user_id = id2;
    FOREACH tag IN ARRAY arr
    LOOP
        INSERT INTO users_tags(user_id, tag_id) VALUES(id2, tag);
    END LOOP;
    PERFORM set_complete(id2);
    RETURN TRUE;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pop_score_like(id1 INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    num INTEGER;
    denum INTEGER;
BEGIN
    SELECT COUNT(DISTINCT from_id) INTO num FROM likes WHERE to_id = id1;
    IF num % 5 = 0 THEN
        SELECT COUNT(DISTINCT to_id) INTO denum FROM likes WHERE from_id = id1;
        IF denum >= 1 AND num / denum > 1 THEN
            UPDATE users SET score = least(score + 1, 10) WHERE id = id1;
            RETURN TRUE;
        END IF;
    END IF;
RETURN FALSE;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pop_score_msg_received(id1 INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    num INTEGER;
    denum INTEGER;
BEGIN
    SELECT COUNT(DISTINCT from_id) INTO num FROM messages WHERE to_id = id1;
    IF num % 10 = 0 THEN
        SELECT COUNT(DISTINCT to_id) INTO denum FROM messages WHERE from_id = id1;
        IF denum >= 1 AND num / denum > 1 THEN
            UPDATE users SET score = least(score + 1, 10) WHERE id = id1;
            RETURN TRUE;
        END IF;
    END IF;
RETURN FALSE;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pop_score_msg_sent(id1 INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    num INTEGER;
    denum INTEGER;
BEGIN
    SELECT COUNT(DISTINCT to_id) INTO num FROM messages WHERE from_id = id1;
    IF num % 10 = 0 THEN
        SELECT COUNT(DISTINCT from_id) INTO denum FROM messages WHERE to_id = id1;
        IF denum >= 1 AND num / denum > 1 THEN
            UPDATE users SET score = greatest(score - 1, 0) WHERE id = id1;
            RETURN TRUE;
        END IF;
    END IF;
    RETURN FALSE;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pop_score_block(id1 INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    blocks_occ INTEGER;
BEGIN
    SELECT COUNT(DISTINCT from_id) INTO blocks_occ FROM blocks WHERE to_id = id1;
    IF blocks_occ > 0 and blocks_occ % 5 = 0 THEN
        UPDATE users SET score = greatest(score - 1, 0) WHERE id = id1;
            RETURN TRUE;
    END IF;
RETURN FALSE;
END
$$ LANGUAGE plpgsql;