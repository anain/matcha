DO $$ 
DECLARE 
    id_1 INTEGER;
    id_2 INTEGER;
    register_time_id_1 TIMESTAMP;
    register_time_id_2 TIMESTAMP;
    gender_id_1 VARCHAR;
    sex_orientation_id_1 VARCHAR;
    like_random INTEGER;
    matcha_creation TIMESTAMP := '2018-08-01 2:59:21';
    now_now TIMESTAMP;
    past_views INTEGER := 0 ; 
    nb_match INTEGER := 0;
    match BOOLEAN := False;


BEGIN
PERFORM setseed(.123);
SELECT matcha_creation INTO now_now;

LOOP 
    EXIT WHEN past_views = 10 ; 
    past_views := past_views + 1;
    SELECT id, timestamp, gender, sex_orientation INTO id_1, register_time_id_1, gender_id_1, sex_orientation_id_1 FROM users WHERE active = True OFFSET floor(random()* (SELECT count(id) FROM users WHERE active = True)) LIMIT 1;
    WITH compatible AS (SELECT id, timestamp FROM users WHERE active = True AND id != id_1 AND position(gender_id_1 IN sex_orientation) > 0 AND position(gender IN sex_orientation_id_1) > 0)
    SELECT id, timestamp INTO id_2, register_time_id_2 FROM compatible OFFSET floor(random()* (SELECT count(id) FROM compatible)) LIMIT 1;
    PERFORM pg_sleep(1);
    raise notice 'Value: % - %', id_2, past_views;
    IF (id_2 IS NOT NULL AND id_1 IS NOT NULL) THEN
        IF register_time_id_1 > now_now THEN UPDATE users SET timestamp = now_now WHERE id = id_1; register_time_id_1 = now_now; END IF;
        SELECT (now_now + interval '5 minutes') INTO now_now;
        IF register_time_id_2 > now_now THEN UPDATE users SET timestamp = now_now WHERE id = id_2; register_time_id_2 = now_now; END IF;
        PERFORM view(id_1, id_2, now_now);
        UPDATE users SET last_connection = now_now WHERE id = id_1;
        SELECT (CAST(random() * 3 AS INTEGER)) INTO like_random;
        IF like_random = 1 THEN SELECT flike_seed(id_1, id_2, now_now::timestamp) INTO match; raise notice 'like'; END IF;
        IF match = True THEN SELECT nb_match + 1 INTO nb_match; END IF;
        SELECT False INTO match;
        SELECT (CAST(random() * 2 AS INTEGER)) INTO like_random;
        SELECT (now_now + interval '15 minutes') INTO now_now;
        IF like_random = 1 THEN PERFORM view(id_2, id_1, now_now); UPDATE notifications SET seen = True WHERE to_id = id_2; SELECT flike_seed(id_2, id_1, now_now::timestamp) INTO match; UPDATE users SET last_connection = now_now WHERE id = id_2; raise notice 'likematch'; END IF;
        IF match = True THEN SELECT nb_match + 1 INTO nb_match; END IF;
        SELECT False INTO match;
    END IF;
END LOOP; 
END$$;