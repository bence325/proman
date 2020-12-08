ALTER TABLE boards ADD COLUMN user_id int;

ALTER TABLE boards
ADD
FOREIGN KEY (user_id) REFERENCES users(id);