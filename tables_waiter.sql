DROP TABLE if EXISTS waiter_names, days_booked;
CREATE TABLE week_days(
    id serial not null PRIMARY key,
    day text not null
);
CREATE TABLE waiter_names(
    id serial not null PRIMARY key,
    names text not null
);
CREATE TABLE days_booked(
    id serial not null PRIMARY key,
    names_id int, 
    FOREIGN KEY (names_id) REFERENCES waiter_names(id), 
    week_days_id int, 
    FOREIGN KEY (week_days_id) REFERENCES week_days(id)
);
INSERT into week_days(day) VALUES('Sunday');
INSERT into week_days(day) VALUES('Monday');
INSERT into week_days(day) VALUES('Tuesday');
INSERT into week_days(day) VALUES('Wednesday');
INSERT into week_days(day) VALUES('Thursday');
INSERT into week_days(day) VALUES('Friday');
INSERT into week_days(day) VALUES('Saturday');