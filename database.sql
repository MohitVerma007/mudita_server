-- users table 
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    mobile VARCHAR(15),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    role VARCHAR(10) CHECK (role IN ('mentor', 'mentee','admin')),
    address VARCHAR(255),
    created_at DATE DEFAULT CURRENT_DATE
);

-- Mentors Table
CREATE TABLE mentors (
    mentor_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE,
    experience VARCHAR(255),
    degree VARCHAR(255),
    medical_lic_num VARCHAR(255),
    pancard_img VARCHAR(255),
    adharcard_front_img VARCHAR(255),
    adharcard_back_img VARCHAR(255),
    doctor_reg_cert_img VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Mentees Table
CREATE TABLE mentees (
    mentee_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE,
    dob DATE,
    occupation VARCHAR(255),
    fcm_token VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


-- Quizze Section

CREATE TABLE Quizzes (
    quiz_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    creator_id INT REFERENCES users(user_id),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Questions (
    question_id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES Quizzes(quiz_id),
    question_text TEXT NOT NULL,
    cover_img VARCHAR(255)

);


CREATE TABLE UserScores (
    user_id INT PRIMARY KEY REFERENCES users(user_id),
    quiz_id INT REFERENCES Quizzes(quiz_id),
    score INT DEFAULT 0 -- Initial score is 0
);


CREATE TABLE UserAnswers (
    answer_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    question_id INT REFERENCES Questions(question_id),
    answer_int INTEGER
);

CREATE TABLE SOS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    video VARCHAR(255),
    contact VARCHAR(255)
);


CREATE TABLE Banner (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    link VARCHAR(255),
    cover_img VARCHAR(255)
);


CREATE TABLE Blog (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    cover_img VARCHAR(255),
    description TEXT
);


CREATE TABLE Technique (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    file VARCHAR(255),
    description TEXT,
    music VARCHAR(255),
    type VARCHAR(10) CHECK (type IN ('music', 'without music'));
    cover_img VARCHAR(255)

);


CREATE TABLE Social_Media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_img VARCHAR(255),
    links VARCHAR(255)
);

CREATE TABLE toolkit (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_img VARCHAR(255),
    technique_id INT[],
    FOREIGN KEY (technique_id) REFERENCES Technique(id) -- Assuming Technique is another table
);

CREATE TABLE Performance (
    performance_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id),
    curr_toolkit_id INT REFERENCES Toolkit(id),
    completed_technique_ids INT[],
    percentage_completed DECIMAL(5,2),
    technique_id INT
);


CREATE TABLE ToolkitReminders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id),
    reminder_message TEXT,
    reminder_time TIME
);


CREATE TABLE insta (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    img VARCHAR(255),
    video TEXT
);

CREATE TABLE journal (
    id SERIAL PRIMARY KEY,
    current_score INT,
    month INT,
    previous_scores JSONB,
    user_id INT REFERENCES users(user_id)
);


CREATE TABLE faq (
    faq_id SERIAL PRIMARY KEY,
    question TEXT,
    answer TEXT,
    user_id INT REFERENCES users(user_id)
);