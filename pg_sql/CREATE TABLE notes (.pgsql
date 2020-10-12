CREATE TABLE notes (
	id serial PRIMARY KEY,
	user_id INT NOT NULL,
	date_time TIMESTAMP NOT NULL
);