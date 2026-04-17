# NexusBank — Loan Application Intake & Status Tracker

A full-stack loan management system that lets users apply for Home, Personal, or Business loans and track application status in real time.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?logo=springboot&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![Database](https://img.shields.io/badge/H2_|_MySQL-Database-003B57?logo=mysql&logoColor=white)

---

## Table of Contents

1. [About](#about)
2. [Demo](#demo)
3. [Features](#features)
4. [System Architecture](#system-architecture)
5. [Tech Stack](#tech-stack)
6. [ER Diagram](#er-diagram)
7. [Application Flow Diagram](#application-flow-diagram)
8. [Request-Response Flow](#request-response-flow)
9. [Project Structure](#project-structure)
10. [Getting Started](#getting-started)
11. [Application Workflow (UI Steps)](#application-workflow-ui-steps)
12. [API Documentation](#api-documentation)
13. [Validation Rules](#validation-rules)
14. [Database Schema](#database-schema)
15. [Email Notification System](#email-notification-system)
16. [Error Handling Strategy](#error-handling-strategy)
17. [Configuration Guide](#configuration-guide)
18. [Known Limitations](#known-limitations)
19. [Future Enhancements](#future-enhancements)
20. [Contributing](#contributing)
21. [License](#license)

---

## About

NexusBank is a loan origination and tracking platform built to simulate real-world banking software. It allows customers to:

- Apply for Home, Personal, or Business loans through a multi-step guided form
- Receive a unique reference number and email confirmation on submission
- Track application status in real time using the reference number

The system implements dual-layer validation (client + server), duplicate application detection, and automated email notifications.

---

## Demo

Watch the full walkthrough: [Google Drive Link](https://drive.google.com/file/d/13Pea8CchCBPj6tWkPWIOgGAAbeg3fFL8/view?usp=drive_link)

The demo covers: selecting loan type, filling the form, reviewing details, submitting, receiving reference number, email delivery, and tracking status.

---

## Features

- Apply for 3 loan types: Home Loan, Personal Loan, Business Loan
- Dynamic form fields that change based on selected loan type
- Real-time application status tracking with color-coded status badges
- Missing document alerts for Business Loan applications
- Client-side validation (React) + Server-side validation (Spring Boot)
- Duplicate prevention — same mobile number cannot submit again
- Automated email notification on successful submission
- Premium dark theme UI with glassmorphism design and smooth animations
- Fully responsive — works on desktop, tablet, and mobile

---

## System Architecture

```
+------------------------------------------------------------------+
|                                                                    |
|                     CLIENT BROWSER                                 |
|                                                                    |
|   +------------+    +----------------+    +------------------+     |
|   |            |    |                |    |                  |     |
|   |  Home Page |    |  Apply Form    |    |  Status Tracker  |     |
|   |  (Home.tsx)|    |  (Apply.tsx)   |    |  (Track.tsx)     |     |
|   |            |    |                |    |                  |     |
|   +------------+    +-------+--------+    +--------+---------+     |
|                             |                      |               |
|   React 19 + TypeScript + Tailwind CSS + Framer Motion             |
|                             |                      |               |
+-----------------------------+----------------------+---------------+
                              |                      |
                    POST /loan/apply       GET /loan/status/{ref}
                              |                      |
                              v                      v
+------------------------------------------------------------------+
|                                                                    |
|                     BACKEND SERVER (Port 8080)                     |
|                                                                    |
|   Option A: Spring Boot 3.2 (Java 17)                              |
|   +--------------+   +---------------+   +---------------------+   |
|   | Loan         |   | Loan          |   | Notification        |   |
|   | Controller   |-->| Service       |-->| Service             |   |
|   | (REST API)   |   | (Validation   |   | (JavaMailSender)    |   |
|   |              |   |  + Business   |   |                     |   |
|   +--------------+   |  Logic)       |   +---------------------+   |
|                      +-------+-------+                             |
|                              |                                     |
|                      +-------v-------+                             |
|                      | Loan App      |                             |
|                      | Repository    |                             |
|                      | (JPA Queries) |                             |
|                      +-------+-------+                             |
|                              |                                     |
|   Option B: Node.js Express Mock Server                            |
|   +------------------------------------------------------+        |
|   | In-memory array store + Nodemailer                    |        |
|   +------------------------------------------------------+        |
|                                                                    |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                                                                    |
|                     DATABASE LAYER                                 |
|                                                                    |
|   Development: H2 File-based Database (./data/loan-db)             |
|   Production:  MySQL 8.x                                           |
|                                                                    |
|   Table: loan_application                                          |
|   Schema auto-managed by Hibernate (ddl-auto=update)               |
|                                                                    |
+------------------------------------------------------------------+
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI component framework |
| TypeScript | 5.x | Type-safe JavaScript |
| Vite | 8.x | Dev server and build tool |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| Framer Motion | 12.x | Page transitions and animations |
| React Router | 7.x | Client-side routing |
| Axios | 1.x | HTTP client for API calls |
| Lucide React | 1.x | Icon library |

### Backend (Spring Boot)

| Technology | Version | Purpose |
|---|---|---|
| Spring Boot | 3.2.4 | Application framework |
| Spring Data JPA | 3.2.x | ORM and database access |
| Hibernate | 6.x | JPA implementation |
| Jakarta Validation | 3.0 | Bean validation annotations |
| JavaMailSender | — | SMTP email dispatch |
| H2 Database | — | Embedded development database |
| MySQL Connector/J | — | Production database driver |
| Maven | 3.9.6 | Build and dependency management |

### Backend (Mock Server)

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express | 5.x | REST API framework |
| Nodemailer | 8.x | SMTP email dispatch |

---

## ER Diagram

The system has a single entity — `LoanApplication`. Below is the Entity-Relationship diagram:

```
+-----------------------------------------------+
|              loan_application                  |
+-----------------------------------------------+
| PK  id                  BIGINT   AUTO_INCREMENT|
|     reference_number    VARCHAR  UNIQUE, NOT NULL|
|     loan_type           VARCHAR  NOT NULL       |
|     full_name           VARCHAR  NOT NULL       |
|     email               VARCHAR  NOT NULL       |
|     mobile_number       VARCHAR  NOT NULL       |
|     date_of_birth       VARCHAR  NOT NULL       |
|     loan_amount         DOUBLE   NOT NULL       |
|     property_value      DOUBLE   NULLABLE       |
|     employment_type     VARCHAR  NULLABLE       |
|     salary              DOUBLE   NULLABLE       |
|     loan_purpose        VARCHAR  NULLABLE       |
|     company_name        VARCHAR  NULLABLE       |
|     registration_number VARCHAR  NULLABLE       |
|     annual_turnover     DOUBLE   NULLABLE       |
|     status              VARCHAR  NOT NULL       |
|     created_at          TIMESTAMP AUTO           |
+-----------------------------------------------+

Field Usage by Loan Type:
+---------------------+------------+---------------+--------------+
| Field               | Home Loan  | Personal Loan | Business Loan|
+---------------------+------------+---------------+--------------+
| property_value      |  REQUIRED  |      —        |      —       |
| employment_type     |  REQUIRED  |      —        |      —       |
| salary              |     —      |  REQUIRED     |      —       |
| loan_purpose        |     —      |  REQUIRED     |      —       |
| company_name        |     —      |      —        |  REQUIRED    |
| registration_number |     —      |      —        |  REQUIRED    |
| annual_turnover     |     —      |      —        |  REQUIRED    |
+---------------------+------------+---------------+--------------+

Reference Number Format:
+-------------+--------+----------+
| Loan Type   | Prefix | Example  |
+-------------+--------+----------+
| Home Loan   | HL     | HL202604 |
| Personal    | PL     | PL202604 |
| Business    | BL     | BL202604 |
+-------------+--------+----------+
Format: {Prefix}{YYYYMM}{4-digit random}
Example: HL2026040842
```

---

## Application Flow Diagram

### Complete User Journey (End to End)

```
  USER                           FRONTEND (React)                    BACKEND (Spring Boot)               DATABASE
   |                                  |                                    |                                |
   |  1. Opens website                |                                    |                                |
   |--------------------------------->|                                    |                                |
   |                                  |                                    |                                |
   |  2. Clicks "Apply Now"           |                                    |                                |
   |--------------------------------->|                                    |                                |
   |                                  |                                    |                                |
   |  3. Selects Loan Type            |                                    |                                |
   |  (Home/Personal/Business)        |                                    |                                |
   |--------------------------------->|                                    |                                |
   |                                  |                                    |                                |
   |                                  | 4. Shows dynamic form fields       |                                |
   |                                  |    based on selected loan type     |                                |
   |<---------------------------------|                                    |                                |
   |                                  |                                    |                                |
   |  5. Fills in all details         |                                    |                                |
   |--------------------------------->|                                    |                                |
   |                                  |                                    |                                |
   |                                  | 6. Client-side validation          |                                |
   |                                  |    - Name (first + last)           |                                |
   |                                  |    - Phone (+91 + 10 digits)       |                                |
   |                                  |    - Email (regex)                 |                                |
   |                                  |    - DOB (DD-MM-YYYY, age >= 18)   |                                |
   |                                  |    - Loan amount (> 0)             |                                |
   |                                  |    - Loan-type-specific fields     |                                |
   |                                  |                                    |                                |
   |  7. If validation fails:         |                                    |                                |
   |     Shows error message          |                                    |                                |
   |<---------------------------------|                                    |                                |
   |                                  |                                    |                                |
   |  8. Clicks "Review Details"      |                                    |                                |
   |--------------------------------->|                                    |                                |
   |                                  |                                    |                                |
   |                                  | 9. Shows summary card              |                                |
   |<---------------------------------|    with all entered data           |                                |
   |                                  |                                    |                                |
   | 10. Clicks "Confirm & Submit"    |                                    |                                |
   |--------------------------------->|                                    |                                |
   |                                  |                                    |                                |
   |                                  | 11. POST /loan/apply               |                                |
   |                                  |----------------------------------->|                                |
   |                                  |                                    |                                |
   |                                  |                                    | 12. Server-side validation     |
   |                                  |                                    |     @NotBlank, @Email,         |
   |                                  |                                    |     @Pattern, @Positive        |
   |                                  |                                    |     + age check                |
   |                                  |                                    |     + conditional fields       |
   |                                  |                                    |                                |
   |                                  |                                    | 13. Duplicate check            |
   |                                  |                                    |     existsByMobileNumber()     |
   |                                  |                                    |                                |
   |                                  |                                    | 14. Generate reference number  |
   |                                  |                                    |     e.g. HL2026040842          |
   |                                  |                                    |                                |
   |                                  |                                    | 15. Save to database           |
   |                                  |                                    |---------------------------->   |
   |                                  |                                    |                            |   |
   |                                  |                                    |    INSERT INTO              |   |
   |                                  |                                    |    loan_application(...)    |   |
   |                                  |                                    |                            |   |
   |                                  |                                    | <------- OK ---------------|   |
   |                                  |                                    |                                |
   |                                  |                                    | 16. Send email notification    |
   |                                  |                                    |     via JavaMailSender/SMTP    |
   |                                  |                                    |                                |
   |                                  |  17. Response: 201 Created         |                                |
   |                                  |      { referenceNumber: "HL..." }  |                                |
   |                                  |<-----------------------------------|                                |
   |                                  |                                    |                                |
   | 18. Shows success screen         |                                    |                                |
   |     with reference number        |                                    |                                |
   |<---------------------------------|                                    |                                |
   |                                  |                                    |                                |
   |                                  |                                    |                                |
   |  === STATUS TRACKING FLOW ===    |                                    |                                |
   |                                  |                                    |                                |
   | 19. Clicks "Track Status"        |                                    |                                |
   |--------------------------------->|                                    |                                |
   |                                  |                                    |                                |
   | 20. Enters reference number      |                                    |                                |
   |     e.g. HL2026040842            |                                    |                                |
   |--------------------------------->|                                    |                                |
   |                                  |                                    |                                |
   |                                  | 21. GET /loan/status/HL2026040842  |                                |
   |                                  |----------------------------------->|                                |
   |                                  |                                    |                                |
   |                                  |                                    | 22. findByReferenceNumber()    |
   |                                  |                                    |---------------------------->   |
   |                                  |                                    | <--- LoanApplication ------    |
   |                                  |                                    |                                |
   |                                  |                                    | 23. Map status:                |
   |                                  |                                    |     RECEIVED + Home = Under Review
   |                                  |                                    |     RECEIVED + Biz  = Docs Required
   |                                  |                                    |     RECEIVED + else = Received |
   |                                  |                                    |                                |
   |                                  |  24. Response: 200 OK              |                                |
   |                                  |      { status, fullName, ...}      |                                |
   |                                  |<-----------------------------------|                                |
   |                                  |                                    |                                |
   | 25. Shows status dashboard       |                                    |                                |
   |     with color-coded badge       |                                    |                                |
   |     + missing docs if any        |                                    |                                |
   |<---------------------------------|                                    |                                |
```

### Status State Machine

```
                    +------------------+
                    |                  |
  (on submission)-->|    RECEIVED      |
                    |                  |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
              v              v              v
     +--------+---+  +------+------+  +----+----------+
     |            |  |             |  |               |
     |   UNDER    |  | ADDITIONAL  |  |   RECEIVED    |
     |   REVIEW   |  | DOCUMENTS   |  |   (as-is)     |
     | (Home/Pers)|  | REQUIRED    |  | (other types) |
     |            |  | (Business)  |  |               |
     +------+-----+  +------+------+  +-------+-------+
            |               |                 |
            v               v                 v
     +------+-----+  +------+------+  +-------+-------+
     |            |  |             |  |               |
     |  APPROVED  |  |  APPROVED   |  |  APPROVED     |
     |            |  |             |  |               |
     +------------+  +-------------+  +---------------+
            or              or                or
     +------------+  +-------------+  +---------------+
     |  REJECTED  |  |  REJECTED   |  |  REJECTED     |
     +------------+  +-------------+  +---------------+
```

---

## Request-Response Flow

### Backend Layer Interaction (Spring Boot)

```
  HTTP Request
       |
       v
+------+------+       +--------+--------+       +--------+--------+
|             |       |                 |       |                 |
|   Loan      | ----> |   Loan          | ----> |  LoanApplication|
|   Controller|       |   Service       |       |  Repository     |
|             |       |                 |       |  (JPA)          |
+------+------+       +--------+--------+       +--------+--------+
       |                       |                          |
       |                       |                          |
       |                       v                          v
       |               +-------+--------+         +------+------+
       |               |                |         |             |
       |               | Notification   |         |  H2 / MySQL |
       |               | Service        |         |  Database   |
       |               | (Email SMTP)   |         |             |
       |               +----------------+         +-------------+
       |
       v
  HTTP Response (JSON)


  Exception Flow:
  
  Any Exception thrown at any layer
       |
       v
+------+--------------------+
|                           |
|  GlobalExceptionHandler   |
|  (@ControllerAdvice)      |
|                           |
|  - MethodArgumentNotValid |---> 400 { status: FAILED, message: "..." }
|  - IllegalArgument        |---> 400 { status: FAILED, message: "..." }
|  - DataIntegrityViolation |---> 400 { status: FAILED, message: "..." }
|  - HttpMessageNotReadable |---> 400 { status: FAILED, message: "..." }
|  - Exception (catch-all)  |---> 500 { status: FAILED, message: "..." }
|                           |
+---------------------------+
```

---

## Project Structure

```
loanTrackerStatus/
|
|-- src/                                        [FRONTEND SOURCE CODE]
|   |-- main.tsx                                  React DOM entry point
|   |-- App.tsx                                   Root component + React Router setup
|   |-- App.css                                   App-level styles
|   |-- index.css                                 Tailwind directives + custom components
|   |                                              - .glass-card (glassmorphism card)
|   |                                              - .premium-input (styled input)
|   |                                              - .btn-primary (gradient button)
|   |
|   |-- components/
|   |   |-- Navbar.tsx                            Sticky nav bar with glassmorphism
|   |                                              - NexusBank logo (gradient text)
|   |                                              - "Track Status" link
|   |                                              - "Apply Now" button
|   |
|   |-- pages/
|   |   |-- Home.tsx                              Landing page
|   |   |                                          - Hero section with gradient headline
|   |   |                                          - "Start Application" CTA button
|   |   |                                          - "Check Status" secondary button
|   |   |                                          - 3 feature cards (Digital Intake,
|   |   |                                            Live Tracking, Secure & Validated)
|   |   |
|   |   |-- Apply.tsx                             Loan application form (4-step wizard)
|   |   |                                          - Step 1: Select loan type
|   |   |                                          - Step 2: Fill details (dynamic fields)
|   |   |                                          - Step 3: Review summary card
|   |   |                                          - Step 4: Success + reference number
|   |   |                                          - Client-side validation logic
|   |   |                                          - POST /loan/apply via Axios
|   |   |
|   |   |-- Track.tsx                             Application status tracker
|   |   |                                          - Reference number input
|   |   |                                          - GET /loan/status/{ref} via Axios
|   |   |                                          - Color-coded status badges
|   |   |                                          - Missing documents alert section
|   |   |                                          - Status-specific messages
|   |
|   |-- assets/                                   Static imports (images, fonts)
|
|-- loan-management-backend/                    [SPRING BOOT BACKEND]
|   |-- pom.xml                                   Maven project descriptor
|   |                                              - Spring Boot 3.2.4
|   |                                              - spring-boot-starter-web
|   |                                              - spring-boot-starter-data-jpa
|   |                                              - spring-boot-starter-validation
|   |                                              - spring-boot-starter-mail
|   |                                              - h2 database (runtime)
|   |                                              - mysql-connector-j (runtime)
|   |
|   |-- Postman_Collection.json                   Importable API test collection
|   |
|   |-- src/main/java/com/bank/loan/
|   |   |
|   |   |-- LoanManagementApplication.java       Spring Boot entry point (@SpringBootApplication)
|   |   |
|   |   |-- controller/
|   |   |   |-- LoanController.java              REST API controller
|   |   |                                          - POST /loan/apply -> LoanService.apply()
|   |   |                                          - GET /loan/status/{ref} -> TrackingService
|   |   |                                          - @CrossOrigin for localhost:5173, 5174
|   |   |
|   |   |-- service/
|   |   |   |-- LoanService.java                 Core business logic
|   |   |   |                                      - validateRequest() — all validation rules
|   |   |   |                                      - apply() — save + send notification
|   |   |   |                                      - Duplicate check via repository
|   |   |   |                                      - Reference number generation
|   |   |   |
|   |   |   |-- NotificationService.java         Email notification service
|   |   |   |                                      - sendNotifications() via JavaMailSender
|   |   |   |                                      - Sends loan type, ref no, next steps
|   |   |   |                                      - Console log for SMS (mock)
|   |   |   |
|   |   |   |-- TrackingService.java             Application lookup service
|   |   |   |                                      - trackApplication() by reference number
|   |   |   |
|   |   |   |-- DocumentService.java             Missing document list service
|   |   |                                          - getPendingDocuments() for Business Loans
|   |   |
|   |   |-- repository/
|   |   |   |-- LoanApplicationRepository.java   JPA Repository interface
|   |   |                                          - existsByMobileNumber(String)
|   |   |                                          - findByReferenceNumber(String)
|   |   |
|   |   |-- entity/
|   |   |   |-- LoanApplication.java             JPA Entity (17 fields)
|   |   |                                          - Maps to "loan_application" table
|   |   |                                          - @CreationTimestamp for created_at
|   |   |
|   |   |-- dto/
|   |   |   |-- LoanRequest.java                 Inbound DTO with validation annotations
|   |   |   |                                      - @NotBlank, @Email, @Pattern, @Positive
|   |   |   |-- LoanResponse.java                Outbound DTO (status, referenceNumber,
|   |   |   |                                      message, nextSteps)
|   |   |   |-- ErrorResponse.java               Error DTO (status, message)
|   |   |   |-- DocumentResponse.java            Document list DTO
|   |   |
|   |   |-- exception/
|   |       |-- GlobalExceptionHandler.java      @ControllerAdvice — catches all exceptions
|   |                                              - MethodArgumentNotValidException -> 400
|   |                                              - IllegalArgumentException -> 400
|   |                                              - DataIntegrityViolationException -> 400
|   |                                              - HttpMessageNotReadableException -> 400
|   |                                              - Exception (catch-all) -> 500
|   |
|   |-- src/main/resources/
|       |-- application.properties                Spring Boot configuration
|                                                  - server.port=8080
|                                                  - H2 file database config
|                                                  - Hibernate ddl-auto=update
|                                                  - CORS allowed origins
|                                                  - Gmail SMTP config
|
|-- server/                                      [NODE.JS MOCK SERVER]
|   |-- index.ts                                  Express server (TypeScript version)
|
|-- server.cjs                                    Express server (CommonJS version)
|                                                  - In-memory array store
|                                                  - Nodemailer email dispatch
|                                                  - Simulated status progression
|                                                  - Duplicate check by mobile number
|
|-- public/
|   |-- favicon.svg                               App icon
|   |-- icons.svg                                 SVG icon sprite
|
|-- index.html                                    HTML entry point
|-- vite.config.ts                                Vite configuration
|-- tailwind.config.js                            Tailwind custom theme
|                                                  - Colors: background, surface, primary,
|                                                    secondary, accent, error
|                                                  - Font: Outfit (Google Fonts)
|                                                  - Animations: fadeIn, slideUp, glow
|-- postcss.config.js                             PostCSS plugins
|-- tsconfig.json                                 TypeScript config
|-- eslint.config.js                              ESLint config
|-- package.json                                  Frontend dependencies and scripts
|-- .gitignore                                    Git ignore rules
|-- README.md                                     This documentation file
```

---

## Getting Started

### Prerequisites

| Tool | Version | Needed For | Download |
|---|---|---|---|
| Node.js | v18+ | Frontend + Mock server | https://nodejs.org/ |
| npm | v9+ | Package management | Comes with Node.js |
| Java JDK | 17 | Spring Boot backend | https://adoptium.net/ |
| Maven | 3.8+ | Backend build | https://maven.apache.org/ |
| MySQL | 8.x (optional) | Production database | https://dev.mysql.com/ |

Quick start note: If you only want to try the app, you need just Node.js. Use the Mock Server option below.

### Step 1 — Clone the Repository

```
git clone https://github.com/OmkarNaik07/loanTrackerStatus.git
cd loanTrackerStatus
```

### Step 2 — Install and Start Frontend

```
npm install
npm run dev
```

Frontend starts at: http://localhost:5173

### Step 3 — Start Backend (choose one option)

Option A — Spring Boot (full backend with H2 database):

```
cd loan-management-backend
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```

On Windows use `mvnw.cmd` instead of `./mvnw`.

- API runs at: http://localhost:8080
- H2 Database Console: http://localhost:8080/h2-console
  - JDBC URL: jdbc:h2:file:./data/loan-db
  - Username: sa
  - Password: (leave empty)

Option B — Mock Server (quick start, no Java needed):

```
node server.cjs
```

- API runs at: http://localhost:8080

Important: Both backends use port 8080. Run only one at a time.

---

## Application Workflow (UI Steps)

### Step 1 — Select Loan Type

User sees three buttons: Home Loan, Personal Loan, Business Loan.
Selected type gets highlighted with a blue glow effect.
Click "Continue" to proceed.

### Step 2 — Fill Applicant Details

Common fields shown for all loan types:
- Full Name (text input)
- Mobile Number with country code, e.g. +919876543210
- Email address
- Date of Birth (DD-MM-YYYY format)
- Loan Amount (number)

Additional fields shown based on loan type:

For Home Loan:
- Property Value (number)
- Employment Type (dropdown: Salaried, Self-Employed, Business, Student, Other)

For Personal Loan:
- Monthly Salary (number)
- Loan Purpose (dropdown: Education, Medical, Marriage, Home Renovation, Travel, Business, Other)

For Business Loan:
- Company Name (text)
- Registration Number (text)
- Annual Turnover (number)

Click "Review Details" to proceed. If any validation fails, error message appears.

### Step 3 — Review and Submit

All entered details are shown in a summary card with a blue left border.
User can click "Edit" to go back and make changes.
Click "Confirm & Submit" to send the application to the backend.
A loading spinner appears during submission.

### Step 4 — Success

A green checkmark animation appears.
User sees the message: "Application Received!"
The unique reference number is displayed in a gradient-styled card (e.g., HL2026040842).
Message: "Please save this reference number to track your application status."
An email notification is sent to the applicant automatically.

### Tracking Status

User navigates to "Track Status" page.
Enters the reference number in the search box.
Clicks "Track" button.
The status dashboard appears showing:
- Applicant name
- Loan type, amount, submission date
- Color-coded status badge (blue/purple/amber/green/red)
- If status is "Additional Documents Required": a list of missing documents with an "Upload Documents" button

---

## API Documentation

Base URL: http://localhost:8080

### Endpoint 1: Submit Loan Application

```
POST /loan/apply
Content-Type: application/json
```

Request body — Home Loan example:

```
{
  "loanType": "Home Loan",
  "fullName": "Omkar Naik",
  "email": "omkar@example.com",
  "mobileNumber": "9876543210",
  "dateOfBirth": "15-01-2000",
  "loanAmount": 2500000,
  "propertyValue": 5000000,
  "employmentType": "Salaried"
}
```

Request body — Personal Loan example:

```
{
  "loanType": "Personal Loan",
  "fullName": "Omkar Naik",
  "email": "omkar@example.com",
  "mobileNumber": "9876543210",
  "dateOfBirth": "15-01-2000",
  "loanAmount": 500000,
  "salary": 80000,
  "loanPurpose": "EDUCATION"
}
```

Request body — Business Loan example:

```
{
  "loanType": "Business Loan",
  "fullName": "Omkar Naik",
  "email": "omkar@example.com",
  "mobileNumber": "9876543210",
  "dateOfBirth": "15-01-2000",
  "loanAmount": 1000000,
  "companyName": "TechCorp Pvt Ltd",
  "registrationNumber": "U74999MH2020PTC123456",
  "annualTurnover": 5000000
}
```

Success response (201 Created):

```
{
  "status": "SUCCESS",
  "referenceNumber": "HL2026040842",
  "message": "Loan application submitted successfully",
  "nextSteps": "Our team will review your application and contact you shortly."
}
```

Error responses (400 Bad Request):

```
{ "status": "FAILED", "message": "Applicant must be at least 18 years old." }
{ "status": "FAILED", "message": "An active application already exists for this contact number." }
{ "status": "FAILED", "message": "Property value is required for Home Loan." }
{ "status": "FAILED", "message": "Contact number must be exactly 10 digits" }
```

### Endpoint 2: Track Application Status

```
GET /loan/status/{referenceNumber}
```

Example: GET /loan/status/HL2026040842

Success response (200 OK):

```
{
  "referenceNumber": "HL2026040842",
  "fullName": "Omkar Naik",
  "loanType": "Home Loan",
  "loanAmount": 2500000,
  "status": "Under Review",
  "submissionDate": "2026-04-14T10:40:00"
}
```

Business Loan with missing documents (200 OK):

```
{
  "referenceNumber": "BL2026040912",
  "fullName": "Omkar Naik",
  "loanType": "Business Loan",
  "loanAmount": 1000000,
  "status": "Additional Documents Required",
  "submissionDate": "2026-04-14T11:00:00",
  "missingDocuments": [
    "Company Registration Certificate",
    "Last 6 months Bank Statement"
  ]
}
```

Error response (404 Not Found):

```
{ "message": "Could not fetch status. Please check your Reference Number." }
```

Postman Collection: Import `loan-management-backend/Postman_Collection.json` into Postman for ready-to-use API tests.

---

## Validation Rules

### Common Fields (Required for All Loan Types)

| Field | Frontend Validation | Backend Validation |
|---|---|---|
| fullName | Must have first + last name (space-separated) | @NotBlank |
| mobileNumber | Must match +{countryCode}{10digits} | @Pattern("^\\d{10}$") — 10 digits only |
| email | Regex: ^[^\s@]+@[^\s@]+\.[^\s@]+$ | @Email + @NotBlank |
| dateOfBirth | DD-MM-YYYY format, calculated age >= 18 | @Pattern + service-layer age calculation |
| loanAmount | Must be a positive number > 0 | @NotNull + @Positive |

### Conditional Fields (Depends on Loan Type)

| Loan Type | Field | Rule |
|---|---|---|
| Home Loan | propertyValue | Required, must be > 0 |
| Home Loan | employmentType | Required (Salaried / Self-Employed / Business / Student / Other) |
| Personal Loan | salary | Required, must be > 0 |
| Personal Loan | loanPurpose | Required (Education / Medical / Marriage / Home Renovation / Travel / Business / Other) |
| Business Loan | companyName | Required, non-blank |
| Business Loan | registrationNumber | Required, non-blank |
| Business Loan | annualTurnover | Required, must be > 0 |

### Duplicate Detection

| Backend | How it Works |
|---|---|
| Spring Boot | Calls `repository.existsByMobileNumber(mobileNumber)` — rejects if any existing application has the same mobile number |
| Mock Server | Searches in-memory array by mobileNumber — rejects if found |

---

## Database Schema

Table name: loan_application (auto-created by Hibernate with ddl-auto=update)

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT | PRIMARY KEY, AUTO INCREMENT | Internal ID |
| reference_number | VARCHAR | UNIQUE, NOT NULL | Application reference (e.g. HL2026040842) |
| loan_type | VARCHAR | NOT NULL | Home Loan / Personal Loan / Business Loan |
| full_name | VARCHAR | NOT NULL | Applicant full name |
| email | VARCHAR | NOT NULL | Applicant email |
| mobile_number | VARCHAR | NOT NULL | 10-digit mobile number |
| date_of_birth | VARCHAR | NOT NULL | DOB in DD-MM-YYYY format |
| loan_amount | DOUBLE | NOT NULL | Requested loan amount |
| property_value | DOUBLE | NULLABLE | Home Loan — property value |
| employment_type | VARCHAR | NULLABLE | Home Loan — employment category |
| salary | DOUBLE | NULLABLE | Personal Loan — monthly salary |
| loan_purpose | VARCHAR | NULLABLE | Personal Loan — purpose |
| company_name | VARCHAR | NULLABLE | Business Loan — company name |
| registration_number | VARCHAR | NULLABLE | Business Loan — CIN/registration |
| annual_turnover | DOUBLE | NULLABLE | Business Loan — annual turnover |
| status | VARCHAR | NOT NULL | Application status |
| created_at | TIMESTAMP | NOT NULL, AUTO | Submission timestamp |

H2 Console Access:
- URL: http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:file:./data/loan-db
- Username: sa
- Password: (leave empty)

---

## Email Notification System

When a loan application is submitted successfully, the system automatically sends an email to the applicant:

Email content:

```
Subject: Loan Application Received

Dear Customer,

Your Home Loan application has been received successfully.
Reference Number: HL2026040842
Next Steps: Our team will review your application and contact you shortly.

Thank you for choosing our bank.
```

| Backend | Technology | SMTP Configuration |
|---|---|---|
| Spring Boot | JavaMailSender + SimpleMailMessage | smtp.gmail.com, port 587, TLS |
| Mock Server (server.cjs) | Nodemailer | smtp.gmail.com, port 587, TLS |

Security note: For production, store email credentials in environment variables. Never commit passwords to version control.

---

## Error Handling Strategy

The Spring Boot backend uses a global exception handler (`@ControllerAdvice`) that catches all errors and returns structured JSON responses:

| Exception Type | HTTP Code | When it Happens | Example Message |
|---|---|---|---|
| MethodArgumentNotValidException | 400 | Bean validation fails | "Contact number must be exactly 10 digits" |
| IllegalArgumentException | 400 | Business rule violated | "Applicant must be at least 18 years old." |
| DataIntegrityViolationException | 400 | Database constraint violated | "Duplicate application detected." |
| HttpMessageNotReadableException | 400 | Malformed JSON body | "Invalid request body or field types." |
| Exception (catch-all) | 500 | Any unexpected error | "Something went wrong. Please try again later." |

All error responses follow this format:

```
{
  "status": "FAILED",
  "message": "Human-readable error description"
}
```

On the frontend, errors are displayed in a styled red alert banner with "Retry Submission" and "Contact Branch" action buttons.

---

## Configuration Guide

### Spring Boot Configuration (application.properties)

| Property | Default Value | Description |
|---|---|---|
| server.port | 8080 | Backend server port |
| spring.datasource.url | jdbc:h2:file:./data/loan-db | Database connection URL |
| spring.datasource.username | sa | Database username |
| spring.datasource.password | (empty) | Database password |
| spring.jpa.hibernate.ddl-auto | update | Auto create/update tables |
| spring.jpa.show-sql | true | Log SQL queries in console |
| spring.h2.console.enabled | true | Enable H2 web console |
| spring.h2.console.path | /h2-console | H2 console URL path |
| spring.mail.host | smtp.gmail.com | SMTP server |
| spring.mail.port | 587 | SMTP port |
| spring.mail.properties.mail.smtp.auth | true | SMTP authentication |
| spring.mail.properties.mail.smtp.starttls.enable | true | Enable TLS |

### Switching to MySQL (for Production)

Replace database properties in application.properties:

```
spring.datasource.url=jdbc:mysql://localhost:3306/nexusbank?useSSL=false&serverTimezone=UTC
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.h2.console.enabled=false
```

Then create the MySQL database:

```
CREATE DATABASE nexusbank;
```

Hibernate will auto-create the loan_application table on first startup.

### Frontend Configuration

The API base URL is currently hardcoded in Apply.tsx and Track.tsx as http://localhost:8080. For production deployment, create a .env file:

```
VITE_API_BASE_URL=http://your-production-server.com
```

---

## Known Limitations

| Limitation | Details |
|---|---|
| Duplicate check scope | Checks by mobile number only — same person cannot apply for multiple loan types |
| No authentication | No user login, registration, or session management |
| Mock server data | In-memory store — all data lost when the server restarts |
| SMTP dependency | Email sending requires valid Gmail SMTP credentials and is subject to daily limits |
| File upload placeholder | "Upload Documents" button exists in the UI but has no backend handler yet |
| Reference number uniqueness | Uses random 4-digit suffix — in production, use a database sequence |

---

## Future Enhancements

- [ ] JWT-based authentication and role management (Admin / Customer)
- [ ] Admin dashboard — view all applications, approve/reject, add notes
- [ ] Document upload functionality (KYC, income proof, property documents)
- [ ] Real-time status push notifications via WebSocket
- [ ] PDF loan agreement generation
- [ ] EMI calculator on the frontend
- [ ] Comprehensive test suite — JUnit 5 (backend) + React Testing Library (frontend)
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Docker Compose for one-command deployment
- [ ] Rate limiting and API key authentication

---

## Contributing

1. Fork this repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature description"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request with a clear description

---

## License

This project is licensed under the MIT License.

---

Built with care by **Omkar Rajiv Naik**
