SELECT id, title, price FROM properties;
DROP TABLE if exists properties cascade;

SELECT COUNT(*) FROM properties;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'properties';
SELECT * FROM properties LIMIT 3;
SELECT current_database();

SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'properties';