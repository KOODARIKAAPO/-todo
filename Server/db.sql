
CREATE DATABASE todo25;

\c todo25


CREATE TABLE IF NOT EXISTS task (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL
);


INSERT INTO task (description) VALUES
('Complete the project documentation'),
('Plan team meeting agenda'),
('Buy groceries for the week'),
('Finish the React frontend'),
('Push code to GitHub repository'),
('Review project requirements'),
('Clean workspace'),
('Update Node.js dependencies');
