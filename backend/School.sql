
/*create database schoolss_db;

use schoolss_db;

CREATE TABLE Students (
    id INT NOT NULL AUTO_INCREMENT,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    gender VARCHAR(10),
    number VARCHAR(15),
    PRIMARY KEY (id)
);



INSERT INTO Students (firstname, lastname, email, gender, number)
VALUES
  ('Maryan', 'Dahir', 'maryansalad7@outlook.dk', 'Female', '60798662'),
  ('Naima', 'Farhan', 'naima3108@hotmail.com', 'Female', '42405039'),
  ('Najma', 'Olad', 'Najma-abdullahi@hotmail.com', 'Female', '27523796'),
  ('Muna', 'Said', 'munaabukar68@hotmail.com', 'Female', '42306057'),
 ('Zain', 'Mahammed', 'Zainmahamed21@hotmail.com', 'Male', '41512877'),
  ('Omar', 'Mahammed', 'omar2001@hotmail.com', 'Male', '42422271'),
   ('Hafid', 'Dahir', 'hafid.abdullahi@hotmail.com', 'Male', '50568721'),
    ('Hanif', 'Dahir', 'hanif99@hotmail.com', 'Male', '41908181'),
     ('abdifatah', 'Farhan', 'abdufatah.jama22@hotmail.com', 'Male', '21409911'),
      ('Abdirauf', 'Farhan', 'abdirauf16@hotmail.com', 'Male', '60798623');


CREATE TABLE Courses (
    id INT NOT NULL AUTO_INCREMENT,
    course_name VARCHAR(255),
       PRIMARY KEY (id)
);

INSERT INTO Courses (course_name) VALUES
('Hifdh'),
('Ijaazah'),
('Tajweed');

CREATE TABLE Teachers (
  id INT NOT NULL AUTO_INCREMENT,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    number VARCHAR(15),
     PRIMARY KEY (id)
);
INSERT INTO Teachers (firstname, lastname, email, number)
VALUES
  ('Sheikh Asran', 'Jabri', 'asran.jabri@hotmail.com', '51621178');



CREATE TABLE Classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES Courses(id)
);

-- Inserting a class
INSERT INTO Classes (course_id) VALUES (1); -- Assuming 'Hifdh' course has course_id = 1

-- ikk kørt igennem
CREATE TABLE Student_Classes (
    student_id INT,
    class_id INT,
    FOREIGN KEY (student_id) REFERENCES Students(id),
    FOREIGN KEY (class_id) REFERENCES Classes(class_id),
    PRIMARY KEY (student_id, class_id)
);

-- Clear the Student_Classes table before re-insertion
TRUNCATE TABLE Student_Classes;

-- Re-inserting students into classes
INSERT INTO Student_Classes (student_id, class_id)
VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1);



-- Table for Quran chapters progress with qualitative grades
CREATE TABLE QuranProgress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    students_id INT,
    chapter_number INT,
    is_completed BOOLEAN,
    completion_date DATE,
    grade VARCHAR(20),
    FOREIGN KEY (students_id) REFERENCES Students(id)
);

INSERT INTO QuranProgress (students_id, chapter_number, is_completed, completion_date, grade)
VALUES (1, 28, false, CURDATE(), 'good'),
       (2, 33, false, CURDATE(), 'good'),
       (3, 67, false, CURDATE(), 'good'),
       (4, 84, false, CURDATE(), 'good'),
       (5, 98, false, CURDATE(), 'good'),
       (6, 16, false, CURDATE(), 'good'),
        (7, 12, false, CURDATE(), 'good'),
        (8, 38, false, CURDATE(), 'good'),
        (9, 41, false, CURDATE(), 'good'),
        (10, 44, false, CURDATE(), 'good');


-- Table for homework assignments
CREATE TABLE Homework (
    homework_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    students_id INT,
    assignment_name VARCHAR(100),
    description TEXT,
    due_date DATE,
    FOREIGN KEY (course_id) REFERENCES Courses(id),
    FOREIGN KEY (students_id) REFERENCES Students(id)
);


-- Inserting a homework assignment
INSERT INTO Homework (course_id, students_id, assignment_name, description, due_date)
VALUES (1, 1, 'Al-Qasas', 'Side 388 til slut.', '2023-12-07'),
       (1, 2, 'Al-Ahzab', 'Side 424 til slut.', '2023-12-07'),
       (1, 3, 'Alhaqqa, Al-Qalam, Al-Mulk', 'Side 567-563 til slut.', '2023-12-07'),
       (1, 4, 'Al-Inshiqaq', 'Hele surah.', '2023-12-07'),
        (1, 5, 'Yusuf', 'side 235-240.', '2023-12-07'),
        (1, 6, 'Sad', 'Hele surah.', '2023-12-07'),
        (1, 7, 'Fussilat', 'side 477-479.', '2023-12-07'),
        (1, 8, 'Ad-Dukhan', 'Hele surah.', '2023-12-07'),
        (1, 9, 'Al-inshiqaq', 'Hele surah.', '2023-12-07'),
        (1, 10, 'Al-inshiqaq', 'Hele surah.', '2023-12-07');

CREATE TABLE Students_Homework (
    students_id INT,
    homework_id INT,
    FOREIGN KEY (students_id) REFERENCES Students(id),
    FOREIGN KEY (homework_id) REFERENCES Homework(homework_id),
    PRIMARY KEY (students_id, homework_id)
);

INSERT INTO Students_Homework (students_id, homework_id)
VALUES (1, 1),
       (2, 2),
       (3, 3),
       (4, 4),
        (5, 5),
        (6, 6),
        (7, 7),
        (8, 8),
        (9, 9),
        (10, 10);



CREATE TABLE Attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    students_id INT,
    class_id INT,
    attendance_date DATE,
    is_present BOOLEAN,
    FOREIGN KEY (students_id) REFERENCES  Students(id),
    FOREIGN KEY (class_id) REFERENCES Classes(class_id)
);

-- Inserting attendance records
INSERT INTO Attendance (students_id, class_id, attendance_date, is_present)
VALUES
    (1, 1, '2023-12-06', true), -- Assuming student_id = 1, class_id = 1
    (2, 1, '2023-12-06', true), -- Assuming student_id = 2, class_id = 1
    (3, 1, '2023-12-06', true),
    (4, 1, '2023-12-06', true),-- Assuming student_id = 3, class_id = 1
    (5, 1, '2023-12-06', true),-- Assuming student_id = 3, class_id = 1
    (6, 1, '2023-12-06', true),-- Assuming student_id = 3, class_id = 1
    (7, 1, '2023-12-06', true),-- Assuming student_id = 3, class_id = 1
    (8, 1, '2023-12-06', false),-- Assuming student_id = 3, class_id = 1
    (9, 1, '2023-12-06', false),-- Assuming student_id = 3, class_id = 1
    (10, 1, '2023-12-06', false);-- Assuming student_id = 3, class_id = 1

