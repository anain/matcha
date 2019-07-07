CREATE OR REPLACE FUNCTION total_score(dist_score numeric, dist_weight integer, tags_score numeric, tags_weight integer, popularity_score integer, popularity_weight numeric, gender_score integer, gender_weight integer)
RETURNS NUMERIC AS
$BODY$ 
SELECT (dist_score * dist_weight + tags_score *  tags_weight + popularity_score * popularity_weight + gender_score * gender_weight) / (dist_weight + tags_weight + popularity_weight + gender_weight) AS score
$BODY$ 
LANGUAGE sql;

CREATE OR REPLACE FUNCTION get_hidden(ptm_id INTEGER)
RETURNS TABLE (id INTEGER) AS $$
    BEGIN
        RETURN QUERY 
            SELECT from_id AS id 
            FROM blocks
            WHERE to_id = ptm_id
            UNION
            SELECT to_id AS id
            FROM blocks
            WHERE from_id = ptm_id
            UNION SELECT ptm_id AS id;
    END;
$$LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_matches(ptm_id INTEGER, nb_limit INTEGER, offest INTEGER)
RETURNS TABLE (
    id INTEGER, 
    username VARCHAR,
    distance DOUBLE PRECISION,
    age DOUBLE PRECISION,
    age_diff DOUBLE PRECISION,
    short_desc VARCHAR,
    popularity_score INT,
    gender VARCHAR,
    sex_orientation VARCHAR,
    distance_score DOUBLE PRECISION,
    tag_score NUMERIC,
    popularity_mark INTEGER,
    img TEXT,
    total_score NUMERIC
    ) 
AS $$
BEGIN
 RETURN QUERY 
 WITH ptm AS (SELECT * FROM users WHERE users.id = ptm_id), popularity_score AS (SELECT users.id, 100 * (score / (SELECT coalesce(score, 1) FROM users WHERE users.id = ptm_id)) - 100 AS score FROM users), tags_score AS (SELECT * FROM tag_score(ptm_id, CAST((SELECT count(users_tags.id) FROM users_tags WHERE user_id = ptm_id) AS INTEGER))),
     dist AS (SELECT users.id, haversine((SELECT CAST(geoloc_lat AS NUMERIC) FROM users WHERE users.id = ptm_id),(SELECT CAST(geoloc_long AS NUMERIC) FROM users WHERE users.id = ptm_id), CAST(users.geoloc_lat AS NUMERIC), CAST(users.geoloc_long AS NUMERIC)) AS km FROM users WHERE active = True),
     dist_score AS (SELECT users.id, distance_score(200, dist.km) FROM users RIGHT JOIN dist ON users.id = dist.id
     WHERE position(users.gender IN (SELECT users.sex_orientation FROM users WHERE users.id = ptm_id)) > 0 AND position((SELECT users.gender FROM users WHERE users.id = ptm_id) IN users.sex_orientation) > 0),
     age AS (SELECT users.id, EXTRACT(YEAR FROM age(birth_date)) as years FROM users)
     SELECT 
        dist_score.id AS id, 
        users.username, 
        dist.km AS distance, 
        age.years AS age,
        abs(age.years - (SELECT EXTRACT(YEAR FROM age(users.birth_date)) FROM users WHERE users.id = ptm_id)) AS age_diff,
        users.short_desc, 
        popularity_score.score AS popularity_score, 
        users.gender, users.sex_orientation, 
        dist_score.distance_score AS distance_score, 
        coalesce(CAST(tags_score.score AS NUMERIC), 0) AS tag_score,
        users.score AS popularity_mark,
        encode(pictures.img, 'base64') AS img,
        total_score(CAST(dist_score.distance_score AS NUMERIC), 400, coalesce(CAST(tags_score.score AS NUMERIC), 0), 200, 100, CAST(popularity_score.score AS NUMERIC) * -1, 1, 1)
     FROM 
        tags_score 
        FULL JOIN dist_score ON tags_score.id = dist_score.id 
        INNER JOIN popularity_score ON popularity_score.id = dist_score.id 
        LEFT JOIN users ON users.id = dist_score.id 
        LEFT JOIN dist ON dist.id = dist_score.id 
        LEFT JOIN age ON age.id = dist_score.id
        LEFT JOIN pictures ON pictures.user_id = dist_score.id
     WHERE 
        profile_pic = True
        AND NOT (users.id IN (SELECT hidden_ids.id FROM get_hidden(ptm_id) AS hidden_ids))
        AND NOT (users.id IN (SELECT to_id FROM nogos WHERE from_id = ptm_id))
     ORDER BY total_score DESC 
     LIMIT nb_limit;
END;
$$LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_ordered_matches(ptm_id INTEGER, nb_limit INTEGER, offest INTEGER, order_crit INTEGER)
RETURNS TABLE (
    id INTEGER, 
    username VARCHAR,
    img TEXT,
    distance DOUBLE PRECISION,
    age DOUBLE PRECISION,
    age_diff DOUBLE PRECISION,
    short_desc VARCHAR,
    popularity_score INT,
    gender VARCHAR,
    sex_orientation VARCHAR,
    distance_score DOUBLE PRECISION,
    tag_score NUMERIC,
    total_score NUMERIC
    ) 
AS $$
BEGIN
 raise notice 'Valuedenum : % ', order_crit + 1;
 RETURN QUERY 
 SELECT match_list.id, match_list.username, match_list.img, match_list.distance, match_list.age, match_list.age_diff, match_list.short_desc, match_list.popularity_score, match_list.gender, match_list.sex_orientation, match_list.distance_score, match_list.tag_score, match_list.total_score FROM get_matches(ptm_id, nb_limit, offest) AS match_list 
 ORDER BY 
    CASE WHEN order_crit=4 THEN  match_list.age END DESC,
    CASE WHEN order_crit=5 THEN match_list.age END,
    CASE WHEN order_crit=2 THEN match_list.age_diff END, 
    CASE WHEN order_crit=1 THEN  match_list.distance END,
    CASE WHEN order_crit=6 THEN  match_list.popularity_score END DESC, 
    CASE WHEN order_crit=3 THEN  match_list.tag_score END, total_score DESC;
END;
$$LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION search(ptm_id INTEGER, age_max INTEGER, age_min INTEGER, lat REAL, long REAL, search_gender VARCHAR, ptm_gender VARCHAR, max_dis INTEGER, min_score INTEGER, max_score INTEGER, tags_arr INTEGER[], nb_limit INTEGER, offs INTEGER, order_crit INTEGER)
RETURNS TABLE (
    id INTEGER,
    username VARCHAR,
    distance TEXT,
    age TEXT,
    age_diff DOUBLE PRECISION,
    short_desc VARCHAR,
    popularity_score INT,
    gender VARCHAR,
    tag_score NUMERIC,
    img TEXT
    ) 
AS $$
BEGIN
RETURN QUERY
    WITH age AS (SELECT users.id, EXTRACT(YEAR FROM age(birth_date)) as years FROM users),
        distance AS (SELECT users.id, haversine(CAST(lat AS NUMERIC), CAST(long AS NUMERIC), CAST(geoloc_lat AS NUMERIC), CAST(geoloc_long AS NUMERIC)) AS dis FROM users),
        tags AS (SELECT users.id, array_agg(tag_id) AS tags_list FROM users LEFT JOIN users_tags ON users_tags.user_id = users.id GROUP BY users.id),
        tags_score AS (SELECT * FROM tag_score(ptm_id, CAST((SELECT count(users_tags.id) FROM users_tags WHERE user_id = ptm_id) AS INTEGER)))
     SELECT 
        users.id AS id,
        users.username, 
        'A ' || round(cast(distance.dis as decimal), 0) ||' km' AS distance,
        age.years ||' ans' AS age,
        abs(age.years - (SELECT EXTRACT(YEAR FROM age(users.birth_date)) FROM users WHERE users.id = ptm_id)) AS age_diff,
        users.short_desc, 
        users.score AS popularity_score, 
        users.gender,
        coalesce(CAST(tags_score.score AS NUMERIC), 0) AS tag_score,
        encode(pictures.img, 'base64') AS img
     FROM users
        LEFT JOIN age ON age.id = users.id
        LEFT JOIN tags_score ON tags_score.id = users.id
        LEFT JOIN distance ON distance.id = users.id
        LEFT JOIN pictures ON pictures.user_id = users.id
        LEFT JOIN tags ON tags.id = users.id
     WHERE 
        active = True
        AND profile_pic = True
        AND age.years < age_max AND age.years > age_min 
        AND position(users.gender IN search_gender) > 0 AND position(ptm_gender IN users.sex_orientation) > 0 
        AND distance.dis < max_dis
        AND users.score >= min_score AND users.score <= max_score
        AND tags.tags_list::int[] @> tags_arr
        AND users.id NOT IN (SELECT hidden_ids.id FROM get_hidden(ptm_id) AS hidden_ids)
 ORDER BY 
        CASE WHEN order_crit=4 THEN age.years END DESC,
        CASE WHEN order_crit=5 THEN age.years END,
        CASE WHEN order_crit=2 THEN age_diff END, 
        CASE WHEN order_crit=1 THEN distance.dis END,
        CASE WHEN order_crit=6 THEN users.score END DESC, 
        CASE WHEN order_crit=3 THEN tag_score END
     OFFSET offs
     LIMIT nb_limit;
END;
$$LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_in_matches(ptm_id INTEGER, age_max INTEGER, age_min INTEGER, lat REAL, long REAL, search_gender VARCHAR, ptm_gender VARCHAR, max_dis INTEGER, min_score INTEGER, max_score INTEGER, tags_arr INTEGER[], nb_limit INTEGER, offs INTEGER, order_crit INTEGER, matches INTEGER[])
RETURNS TABLE (
    id INTEGER,
    username VARCHAR,
    distance TEXT,
    age TEXT,
    age_diff DOUBLE PRECISION,
    short_desc VARCHAR,
    popularity_score INT,
    gender VARCHAR,
    tag_score NUMERIC,
    img TEXT
    ) 
AS $$
BEGIN
RETURN QUERY
    WITH matches AS (SELECT * FROM users WHERE users.id = ANY(matches)),
        age AS (SELECT matches.id, EXTRACT(YEAR FROM age(birth_date)) as years FROM matches),
        distance AS (SELECT matches.id, haversine(CAST(lat AS NUMERIC), CAST(long AS NUMERIC), CAST(geoloc_lat AS NUMERIC), CAST(geoloc_long AS NUMERIC)) AS dis FROM matches),
        tags AS (SELECT matches.id, array_agg(tag_id) AS tags_list FROM matches LEFT JOIN users_tags ON users_tags.user_id = matches.id GROUP BY matches.id),
        tags_score AS (SELECT * FROM tag_score(ptm_id, CAST((SELECT count(users_tags.id) FROM users_tags WHERE user_id = ptm_id) AS INTEGER)))
     SELECT 
        matches.id AS id,
        matches.username, 
        'A ' || round(cast(distance.dis as decimal), 0) ||' km' AS distance,
        age.years ||' ans' AS age,
        abs(age.years - (SELECT EXTRACT(YEAR FROM age(matches.birth_date)) FROM matches WHERE matches.id = ptm_id)) AS age_diff,
        matches.short_desc, 
        matches.score AS popularity_score, 
        matches.gender,
        coalesce(CAST(tags_score.score AS NUMERIC), 0) AS tag_score,
        encode(pictures.img, 'base64') AS img
     FROM matches
        LEFT JOIN age ON age.id = matches.id
        LEFT JOIN tags_score ON tags_score.id = matches.id
        LEFT JOIN distance ON distance.id = matches.id
        LEFT JOIN pictures ON pictures.user_id = matches.id
        LEFT JOIN tags ON tags.id = matches.id
     WHERE 
        active = True
        AND profile_pic = True
        AND age.years < age_max AND age.years > age_min 
        AND position(matches.gender IN search_gender) > 0 AND position(ptm_gender IN matches.sex_orientation) > 0 
        AND distance.dis < max_dis
        AND matches.score >= min_score AND matches.score <= max_score
        AND tags.tags_list::int[] @> tags_arr
        AND matches.id NOT IN (SELECT hidden_ids.id FROM get_hidden(ptm_id) AS hidden_ids)
 ORDER BY 
        CASE WHEN order_crit=4 THEN age.years END DESC,
        CASE WHEN order_crit=5 THEN age.years END,
        CASE WHEN order_crit=2 THEN age_diff END, 
        CASE WHEN order_crit=1 THEN distance.dis END,
        CASE WHEN order_crit=6 THEN matches.score END DESC, 
        CASE WHEN order_crit=3 THEN tag_score END
     OFFSET offs
     LIMIT nb_limit;
END;
$$LANGUAGE plpgsql;