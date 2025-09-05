📚 Minimal LMS System

A full-stack Learning Management System (LMS) built with Next.js + TypeScript (frontend) and Node.js + Express + MongoDB (backend).
This project provides separate panels for Admins and Users, enabling complete course management, content delivery and progress tracking.

🚀 Features
</br>
</br>
🔑 Authentication

* Secure login system for Admin and Users.

* Role-based redirection:

  Admin → /admin/courses

  User → /user/courses
  

🛠️ Admin Dashboard (Authentication Required)
</br>
🎓 Course Management

* Upload Courses

  * Fields: Thumbnail (image), Title, Price, Description.

* View Courses

  * Grid of cards with thumbnail, title, price, and description.

* CRUD Operations

  * Edit/Delete courses.

  * Dynamic Routing: Clicking a course navigates to its Module & Lecture Management page.

</br>
📂 Module & Lecture Management

* Modules

   * Add modules with Title and Module Number (auto-increment).

* Lectures

  * Add lectures under modules with:

      * Title

      * YouTube URL 

      * PDF notes

  * CRUD: Edit/Delete modules and lectures.

* Lecture List View

  * Table display of all lectures with filters by Course and Module.
<br>
🎓 User Panel
<br>
<br>
📘 Course Details Page

* Dynamic rendering of course details (thumbnail, title, price, description) from Admin uploads.

* Additional static sections (e.g., Reviews, Instructor Info).

<br>
🎥 Lecture Page

* Modules & Lectures

  * Numbered modules with expandable lecture lists.

  * Search bar to filter lectures by title.

* Content Delivery

  * Locked lectures (sequential unlocking).

  * Embedded video player (YouTube support).

  * Downloadable/viewable multiple PDF notes.

* Progress Tracking

  * Progress bar and checkmarks for completed lectures.

<br>
<br>
🏗️ Tech Stack
<br>
<br>

**Frontend**

* Next.js 14 (App Router)

* TypeScript

* TailwindCSS

* ShadCN/UI Components

* React Hooks
<br>

**Backend**


* Node.js

* Express.js

* MongoDB + Mongoose

<br>

Others

* JWT Authentication

* LocalStorage for user-side progress tracking

* Vercel for frontend deployment

* Render/Heroku for backend deployment
