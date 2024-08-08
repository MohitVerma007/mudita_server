CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    mobile VARCHAR(15),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    role VARCHAR(10) CHECK (role IN ('mentor', 'mentee', 'admin')),
    profile_img TEXT,
    address VARCHAR(255),
    created_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE password_resets (
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE mentors (
    mentor_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    experience VARCHAR(255),
    degree VARCHAR(255),
    medical_lic_num VARCHAR(255),
    pancard_img VARCHAR(255),
    adharcard_front_img VARCHAR(255),
    adharcard_back_img VARCHAR(255),
    doctor_reg_cert_img VARCHAR(255),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE mentees (
    mentee_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    dob DATE,
    occupation VARCHAR(255),
    current_score INT,
    fcm_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Quizz section

-- Quizzes Table
CREATE TABLE Quizzes (
    quiz_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    creator_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions Table
CREATE TABLE Questions (
    question_id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES Quizzes(quiz_id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    cover_img VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UserScores Table
CREATE TABLE UserScores (
    user_id INT PRIMARY KEY REFERENCES users(user_id),
    quiz_id INT REFERENCES Quizzes(quiz_id) ON DELETE CASCADE,
    score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UserAnswers Table
CREATE TABLE UserAnswers (
    answer_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    question_id INT REFERENCES Questions(question_id) ON DELETE CASCADE,
    answer_int INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE SOS (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    video VARCHAR(255),
    contact VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Banner (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    link VARCHAR(255),
    cover_img VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Blog (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    cover_img VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Technique (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    file VARCHAR(255),
    description TEXT,
    music VARCHAR(255),
    type VARCHAR(10) CHECK (type IN ('music', 'without music')),
    cover_img VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Social_Media (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_img VARCHAR(255),
    links VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE toolkit (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_img VARCHAR(255),
    technique_id INT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Performance (
    performance_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    curr_toolkit_id INT REFERENCES toolkit(id) ON DELETE CASCADE,
    completed_technique_ids INT[],
    percentage_completed DECIMAL(5,2),
    technique_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ToolkitReminders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    reminder_message TEXT,
    reminder_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE insta (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    img VARCHAR(255),
    video TEXT,
    fav INT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journal (
    id SERIAL PRIMARY KEY,
    current_score INT,
    month INT,
    previous_scores JSONB,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faq (
    faq_id SERIAL PRIMARY KEY,
    question TEXT,
    answer TEXT,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE time_slots (
    slot_id SERIAL PRIMARY KEY,
    slot_start TEXT NOT NULL,
    slot_end TEXT NOT NULL,
    day TEXT NOT NULL,
    mentor_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE slot_request (
    req_id SERIAL PRIMARY KEY,
    status VARCHAR(10) CHECK (status IN ('pending', 'rejected', 'approved')) NOT NULL DEFAULT 'pending',
    mentor_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    mentee_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session (
    session_id SERIAL PRIMARY KEY,
    mentee_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    mentor_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    status VARCHAR(10) CHECK (status IN ('pending', 'rejected', 'approved')) NOT NULL DEFAULT 'pending',
    meet_link VARCHAR(255),
    mentee_text TEXT,
    mentor_text TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    slot_id INT NOT NULL REFERENCES time_slots(slot_id) ON DELETE CASCADE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('pending', 'success', 'failed')) NOT NULL DEFAULT 'pending',
    mentee_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    slot_id INT NOT NULL REFERENCES time_slots(slot_id) ON DELETE CASCADE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    description TEXT,
    insta_id INT REFERENCES insta(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fees (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    mentor_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    points INT NOT NULL DEFAULT 0,
    redeem INT NOT NULL DEFAULT 0,
    earning_rupees DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE redeem_req (
    id SERIAL PRIMARY KEY,
    mentor_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    points INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    img TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    users_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
