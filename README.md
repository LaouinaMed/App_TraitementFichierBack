FULL STACK APPLICATION – SPRING BOOT, ANGULAR & KEYCLOAK

Overview:
This is a full-stack application built with:
- Backend: Spring Boot
- Frontend: Angular
- Authentication & Role Management: Keycloak

Main Features:

1. User Management:
   - Create, edit, delete, and view users
   - Assign roles via Keycloak

2. Product & Order Management:
   - Full CRUD operations on products
   - Create and manage customer orders

3. CMD File Import and Processing:
   - Automatically process CMD files using Spring Batch
   - Save processed data into the database
   - Display error logs for invalid or failed imports

Keycloak Setup:

1. Download and install Keycloak version 25.0.1
2. Create a realm named: appDemo
3. Create a client with the following:
   - Client ID: clientAppDemo
4. Backend Configuration:
   - Go to the class: KeycloakConfig.java (inside the 'config' package)
   - Update the `username` and `password` variables with your Keycloak admin credentials

Spring Batch File Processing Configuration:

In the `DirectoryWatcher` class (inside the 'batch' package), update the file paths according to your local environment:

   - CMD input directory:
     C:/Users/simed/Desktop/ReaderBatch

   - Valid files directory (successfully processed):
     C:/Users/simed/Desktop/FichierValide

   - Invalid files directory (files with errors):
     C:/Users/simed/Desktop/FichierInvalide

⚠️ Make sure these folders exist and are accessible by the application.

Database Configuration (application.properties):

To connect the backend to your database, edit the `application.properties` file with your configuration. Example for MySQL:


Replace the database name, username, and password with your own credentials.

Frontend Tests (Angular):

Unit tests are implemented for the `ProduitComponent`:
   - Test file: `produit.component.spec.ts`
   - To run tests, open a terminal at the frontend root and type:

     ng test

Running the Application:

1. Backend:
   - Navigate to the `backend` folder
   - Run the app with:
     mvn spring-boot:run

2. Frontend:
   - Navigate to the `frontend` folder
   - Install dependencies and launch the app:
     npm install
     ng serve

