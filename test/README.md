# SOFTWARE REQUIREMENTS

## TABLE OF CONTENTS
1. [SYSTEM ARCHITECTURE](#system-architecture)
2. [SYSTEM REQUREMENTS SPECIFICATION](#system-requirements-specification)
3. [REFERENCES](#references)

testing398


## SYSTEM ARCHITECTURE
### WEB STACK

A `web stack` refers to the combination of tools and technologies used to create a website or web application. The web stack that will be used for creating the application is the `MERN stack` which is web stack is a popular open source, `JavaScript-based` stack which is developer-friendly, highly customisable, and cost-effective, its popularity is due to `Reacts` ability to simplify the creation and management of an application’s `user interface (UI)` and `improve overall site performance`.

React.js allows you to write code use it an unlimited number of times therefore allowing you to write more modular code therefore making it easier to read and less complicated making it highly efficient for building dynamic and interactive web pages. Further, `(CRA)` can be generated in the `command line interface` using only one command which therefore saves time.

Therefore, `MongoDB` will handle the database, `Express.js` will provide the web application framework to develop the server-side, `React.js`, (create-react-app) will be used to create the front-end, user-interface and `Node.js` will be used as the `JavaScript` runtime environment.

### STYLING

External `Cascading Styling Sheets (CSS)` will be used because although this may take longer than other styling methods such as inline CSS styling in the React.js component(s) can make the React.js code longer, more complicated and therefore difficult to read.

### FILE STRUCTURE

The `root-directory` which is the main folder that contains all the files and folders for the application. The file structure of the root-directory consists of the two different folders, the front-end `client` folder and the back-end `server` folder and this `README markdown file` containing information about the application. The back-end and front-end folders are in separate folders to ensure that there clear separation between the back-end and front-end code.
The front-end will contain the code relating to React.js files, and the CSS styling code. The back end will contain the Express.js code and the code that using `Mongoose` third party middleware to connect to the `MongoDB` database.

### DEPLOYMENT
There are several platforms which can be used for deploying an application, such as, `Heroku, Vercel and Netlify`, inter alia. However, although Heroku is a `platform as a service (PaaS)` that simplifies deployment and management and supports multiple programming languages and frameworks, deploying an application on Heroku requires additional costs, `Vercel` is a platform used to host static sites and serverless functions and is optimised for `Next.js` applications and offers features like automatic `SSL (Secure Sockets Layer)`, edge caching, and serverless deployment.

The application will, however, be deployed using `Netlify` since it is a cost-free and therefore cost-effective platform and provides serverless functions allowing developers to run backend code without having to manage the server which can be used to create API’s and handle form submissions, which is fundamental to the application. Further, it also provides,  security features such as `user authentication` and global `CDN (Content Delivery Network)` for fast scalable deployment, therefore ensuring high performance deployment.


## SYSTEM REQUIREMENTS SPECIFICATION

The proposed application is a quiz game application that allows users to  answer questions from certain question categories  from questions provided by admin users and data from third party APIs (application programming interface). The target users who will benefit from the application are individuals that enjoy quiz games. However, certain question categories will have an age restriction. The application also provides admin users with user authorization for specific rights and permissions.
The back-end package.json uses `nodemon` third party middleware to allow the application to run in the front-end and back-end code using `npm start`, the front-end `client` and back-end `server` folders must, however, be run separately using `npm start` in the terminal/command line interface.

### SIMILAR SOFTWARE
Examples of similar applications/software are `Kahoot`, and `Trivia Crack`. However, there are several differences significant differences between these applications and the intended application/software.

#### KAHOOT
The intenden application/software is different in that Kahoot is used for educational and recreational purposes and the proposed application is only used for recreational purposes. Further, Kahoot provides real-time online live-hosted quizzes, the proposed application does not.

#### TRIVIA CRACK
Trivia Crack is also an application used for recreational purposes, however, although the proposed application/software allows users to add questions, Trivia Crack allows users to add video questions.

### USER STORIES
#### ALL USERS

-	As a user of the application, I want the application to be able to provide a friendly user interface (UI) to ensure a positive user experience (UX)
-	As a user of the application, I want the application to provide secure user login to protect details on my account.
-	As a user of the application, I want the application to provide a user interface that is user friendly to allow a positive user experience.
-	As a user of the application, I want the application to be able to store my user account details after registration.
-	As a user of the application, I want to be able to view the results after answering questions.
-	As a user of the application, I want the application to be able to edit my account details.
-	As a user of the application, I want the application to allow me add new questions and save them to the database.

#### ADMINISTRATIVE USERS

-	As a user of the application who handles administration functions, I want to be able to store data in the database, and retrieve the from the database after logging in.
- As an admin
-	As a user who handles administrative functions, I want the application to include a list of rules to avoid any suspicious or inappropriate behaviour by users.
-	As a user who handles administrative functions, I want to be able to delete any questions submitted by users which are inappropriate or do not comply with the rules regulating the application to avoid any suspicious user activity.


### FUNCTIONAL REQUIREMENTS

Functional requirements are the activities required of the program. These requirements are related to the functionality of the application and `specifies what the application must do` and are dependent on the type of software being developed. These are essentially the requirements that the end user expects the web application (software product) to offer and have an impact on how the user interacts with the system and are therefore user focused.


***The functional requirements of the application include:***

- User authentication upon user registration and user login.
- A navigation bar to allow users to navigate between the different pages after the user has logged in and includes a navigation bar to allow users to navigate between the login and registration pages.
- A form which allows users can select a quiz and have the option to add a timer and the form allows to add a timer if they want to. The form, however, does not allow users to play/answer questions from a quiz they created. The select quiz form provides a toggle button to display the chosen quiz. The quiz allows users to move to the next question in the quiz or restart the quiz they have selected.
- Users are able to view their results/score after a quiz, which is then saved to the database which users can then access later.
- The application provides a toggle button which provides a form which includes middleware to allow authorisation for admin users to add, edit and delete questions/or the entire quiz, and save it to the database. Normal users are also authorized to add a new quiz, edit a quiz or delete a quiz if they created it.
- The a toggle button on the USER ACCOUNT page (PAGE 4)  that displays a form that allows the user to edit their user account/details.
- Users are able to logout on each page and the application stores the data securely after user logout.

Functional requirements also include the `CRUD` (Create (POST), Read (GET), Update (PUT) and, Delete) operations which are requests made to the database to either add(POST), retrieve(GET), update(PUT), or delete(DELETE) documents from the database.

**CRUD operations in the application include:**

`CREATE (POST)`:

- Login,
- Register,
- Add Quiz, and
- Add Score

`READ (GET)`:

- Get/fetch the users name and display it on the homepage in the welcome message,
- Get/fetch the details for a single user,
- Get/fetch all user details if the user is an admin user for administrative purposes, and
- Get/fetch a quiz or questions and Get/fetch user scores

`UPDATE (PUT)`:

- Update user details, and
- Update a quiz or questions.

`DELETE`:

- Delete or remove a user for administrative purposes, and
- delete or remove a quiz/question by a normal user or an admin for administrative purposes.

### NON-FUNCTIONAL REQUIREMENTS
Non-functional requirements are the characteristics of the web application/software product, including its constraints. They are often more critical than individual functional requirements. Non-functional requirements are not related to the functionality of the application but rather defines `how the web application/software should perform`. Non-functional requirements are related to factors regarding the application's `usability`, `reliability`, `performance`, and `security` and are therefore essential for ensuring that the web application meets the required standards of these factors.

***The non-functional requirements of the application include:***

-	User satisfaction to ensuring a positive user-experience.
-	Compatibility with different devices and browsers for broader accessibility.
-	Thorough testing, to ensure system reliability.
-	The ability to store an increased user load and data volume.
-	Performance optimization for efficient data retrieval and processing.
-	Security measures to protect user data using middleware for user authentication and to protect data from unauthorized access or breaches.
-	Regulatory requirements for user data handling and user privacy.


## REFERENCES
- https://www.nobledesktop.com/classes-near-me/blog/
- https://www.geeksforgeeks.org/nextjs-vs-reactjs-which-one-to-choose/#is-next-better-than-react
- https://www.geeksforgeeks.org/folder-structure-for-a-node-js-project/
- https://www.geeksforgeeks.org/what-is-package-json-in-node-js/?ref=ml_lbp
- https://www.geeksforgeeks.org/what-are-functional-requirements-in-system-design-examples-definition/
- https://www.geeksforgeeks.org/what-are-non-functional-requirements-in-system-design-examples-definition/?ref=next_article
- https://www.geeksforgeeks.org/software-engineering-classification-of-software-requirements/
- https://vercel.com/docs/cli/domains#usage
- https://docs.netlify.com/
- https://devcenter.heroku.com/categories/reference
