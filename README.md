Joey's Survey App: This project for my CSC 4026 Secure Cloud Development class is a web based survey app that will eventually allow users to create, share, and see the results of surveys they create. 
The app is developed using replit as an IDE, express as a server framework, jquery and nodejs on the client and server side respectively, and a neon postgreSQL server. 

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
For SERVER.CERT and SERVER.KEY, enter your ssl certifcation and key if you have one, or delete the secrets if you don’t. 
For PGHOST, enter the url following “neondb_owner:************@” and ending at /neondb. This url should begin with ep- and end with neon.tech 
Ensure all of the above secrets have been added before proceeding 
 
Your project is now ready to run within replit!

 
