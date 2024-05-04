Joey's Survey App: This project for my CSC 4026 Secure Cloud Development class is a web based survey app that will eventually allow users to create, share, and see the results of surveys they create. 
The app is developed using replit as an IDE, express as a server framework, jquery and nodejs on the client and server side respectively, and a neon postgreSQL server. 

Current State: Currently, the project has a very basic survey creator that has little to no function. The main focus of the project so far has been learning how to create functionalities like logging in, signing up, and using things like https session storage
to allow users to create accounts. User data is encrypted and sent to a neon postgresql server. This project is my first time integrating a front end website with a server and a database so there has been a lot of trial and error involved.

Issues: 
Currently the app can’t be deployed on Replit, I’m not 100% sure on the reason for this but I believe it has something to do with the way replit handles SSL certificates. The problem is that the server can’t connect with the database, rendering all login functionalities useless. 
Most of the buttons on the homepage.html page don't do anything yet, the only two that function are the add button which allows the user to create a very basic survey question, and the delete button that allows a user to delete an added question. The saving functionality is currently under progress but disabled right now and the rest have not been started. 
A user's email address is not validated in the current build of the project, in the future a user will need to validate their email by entering a code sent to it before their information will be added to the database and they are allowed to access the full functionality of the application. 

Security: 

The client-side code and webpages on this project focus on security using mainly regular expressions to validate input. The only exception to this is the homePage.html.  This is because that page does not send or retrieve any data from the database and shouldn’t take any sensitive user information, so there’s little to no risk in having it be vulnerable. 

Index.html serves as the login page for the project, it takes two input fields, email address and password. The front-end code has built in protection to ensure that the first entry is an email address using a regular expression, and that the second matches my specified password requirements. The email regex should prevent any SQL injection and the password requirements should fulfill part of this role. Once sent server-side, the html is sanitized, preventing cross site scripting attacks. The input is then used to query the database and attempt to log the user in. Passwords in the database are encrypted using the pgcrytpo extension for PostgreSql, the password is decrypted by running the same algorithm and then comparing the results. If both the email and password match and entry in the database, the user’s email address is stored within HTTPs session storage to be quickly accessed. 

Signup.html also takes user input and uses it to query the database, so the same protections are applied. On the client side, the same two regex patterns are used to verify that the email address entered fits the format of an email address and that the password meets our expectations and both password entries match. After that the input is sent to the server to be added to the database. Before being added to the database the html is again sanitized to prevent XSS attacks.  

 When adding an entry to the users table in the database, a user id is created for the user automatically, the email address is sent to the server as is, but the password is encrypted using the Postgre extension pgcrypto, specifically the gen_salt algorithm to create a random value to use to encrypt the password. More information can be found here https://www.postgresql.org/docs/current/pgcrypto.html. Using this algorithm ensures that even if two users have the same password, their encrypted passwords will be different.  

After the user's information has been added to the database, they are redirected to the login screen to login using their new credentials. This is for two reasons, one is too ensure that their account has actually been created, and two is to ensure that session storage has been initialized and contains their email address. Session storage will later be used to create full account functionality, allowing users to save and share their surveys.

User Manual:

Replit Link: 

https://replit.com/@WorkJoseph/CSC-4026-Joeys-Survey-App  
Step 1: 
Navigate to the above replit link, create account or log into Replit services if needed, then click the green button labeled “Fork & Run”. 

Step 2: 
You will now be prompted to enter the name, description, and publication status of your replit, enter this information then click “Fork Repl” 

Step 3: 
Upon forking the repl, you will see a warning that says “Missing required secrets. Click here to add them”, this is because the project requires that you have a neon postgresql server connected to it for it to run.  

Step 4: 
Create your server at Neon — Serverless, Fault-Tolerant, Branchable Postgres, then navigate to the SQL editor tab 
Run the command “CREATE EXTENSION pgcrypto”, this is the extension used to encrypt passwords 

Step 5: 
Now navigate to your Neon dashboard and take note of your connection string, this will be used to connect your database to your project 

Step 6: 
Click on the  “missing secrets” warning in replit to open the secrets tab, inside you will see the secrets that are required. 

For DATABASEURL, copy your entire connection string 

For PGDATABASE, enter ‘neondb’ 

For PGPORT, enter ‘5423’ 

For PGUSER, enter ‘neondb_owner’ 

For PGPASSWORD, enter the sequence of characters in your connection string beginning after “neondb_owner:” and ending before “@”. Ex. “neondb_owner:************@”. 

For SERVER.CERT and SERVER.KEY, enter your ssl certifcation and key if you have one, or delete the secrets if you don’t. If you wish to create your own ssl key, you can do so using the shell
terminal in replit, here is a guide https://www.gridhooks.com/security-articles/ssl/how-to-generate-a-private-key-for-an-ssl-certificate 

For PGHOST, enter the url following “neondb_owner:************@” and ending at /neondb. This url should begin with ep- and end with neon.tech 

Ensure all of the above secrets have been added before proceeding 
 
Your project is now ready to run within replit!

 
