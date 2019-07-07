CREATE OR REPLACE FUNCTION check_blocks(id_1 INTEGER, id_2 INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    existing_block BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT id FROM blocks WHERE from_id = id_1 and to_id = id_2 UNION SELECT id FROM blocks WHERE from_id = id_2 and to_id = id_1) INTO existing_block;
    RETURN existing_block;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION flike_seed(id_1 INTEGER, id_2 INTEGER, like_time TIMESTAMP) 
RETURNS BOOLEAN AS $$
DECLARE
    match BOOLEAN;
    duplicate BOOLEAN;
BEGIN
    raise notice 'likef %s %s', id_1, id_2;
    SELECT EXISTS (SELECT id FROM likes WHERE from_id = id_1 and to_id = id_2) INTO duplicate;
    raise notice 'likef %s', duplicate;
    IF duplicate = True THEN 
                RETURN False;
	ELSE
        raise notice 'like';
        INSERT INTO likes(from_id, to_id, timestamp, type) VALUES(id_1, id_2, like_time, 1);
        PERFORM pop_score_like(id_2);
        SELECT EXISTS (SELECT id FROM likes WHERE from_id = id_2 and to_id = id_1) INTO match;
        IF match = True THEN 
            INSERT INTO matches(from_id, to_id, timestamp) VALUES(id_1, id_2, like_time);
             raise notice 'match';
	        INSERT INTO notifications(from_id, to_id, timestamp, type) VALUES(id_1, id_2, like_time, 'M');   
            RETURN True;
        ELSE
            INSERT INTO notifications(from_id, to_id, timestamp, type) VALUES(id_1, id_2, like_time, 'L');
            RETURN False;      
        END IF;
    END IF;
    RETURN True;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION flike(id_1 INTEGER, id_2 INTEGER, like_time TIMESTAMP) 
RETURNS BOOLEAN AS $$
DECLARE
    match BOOLEAN;
BEGIN
    INSERT INTO likes(from_id, to_id, timestamp, type) VALUES(id_1, id_2, like_time, 1);
    PERFORM pop_score_like(id_2);
    SELECT EXISTS (SELECT id FROM likes WHERE from_id = id_2 and to_id = id_1) INTO match;
    IF match = True THEN 
        INSERT INTO matches(from_id, to_id, timestamp) VALUES(id_1, id_2, like_time);
	    INSERT INTO notifications(from_id, to_id, timestamp, type) VALUES(id_1, id_2, like_time, 'M');   
        RETURN True;
    ELSE
        INSERT INTO notifications(from_id, to_id, timestamp, type) VALUES(id_1, id_2, like_time, 'L');      
    END IF;
    RETURN False;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fdislike(id_1 INTEGER, id_2 INTEGER, dislike_time TIMESTAMP) 
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO likes(from_id, to_id, timestamp, type) VALUES(id_1, id_2, dislike_time, 0);
	INSERT INTO notifications(from_id, to_id, timestamp, type) VALUES(id_1, id_2, dislike_time, 'D');     
    DELETE FROM matches WHERE (from_id = id_1 AND to_id = id_2) OR (from_id = id_2 AND to_id = id_1);
    RETURN True;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fview(id_1 INTEGER, id_2 INTEGER, view_time TIMESTAMP) 
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO views(from_id, to_id, timestamp) VALUES(id_1, id_2, view_time);
	INSERT INTO notifications(from_id, to_id, timestamp, type) VALUES(id_1, id_2, view_time, 'V');      
    RETURN True;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fblocks(id_1 INTEGER, id_2 INTEGER, block_time TIMESTAMP) 
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO likes(from_id, to_id, timestamp, type) VALUES(id_1, id_2, block_time, -1);
    INSERT INTO blocks(from_id, to_id, timestamp) VALUES(id_1, id_2, block_time);   
    PERFORM pop_score_block(id_2);
    DELETE FROM matches WHERE (from_id = id_1 AND to_id = id_2) OR (from_id = id_2 AND to_id = id_1); 
    RETURN True;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION msg(id_1 INTEGER, id_2 INTEGER, msg VARCHAR) 
RETURNS VOID AS $$
BEGIN
    INSERT INTO messages(from_id, to_id, timestamp, content) VALUES(id_1, id_2, now(), msg);
    PERFORM pop_score_msg_sent(id_1);
    PERFORM pop_score_msg_received(id_2);
END;
$$ LANGUAGE plpgsql;