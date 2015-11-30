# ImageEditor

Technologies:

  - **Server side:** Node.js (Express)
  - **Client side:** Bootstrap, Angular, Gulp, Browserify
  - **Database:** MongoDB

### Requires

  - Node.js, NPM
  - Bower
  - MongoDB

### Configuration
  - MongoDB connection url: configs\database.js file
  - Session configaration: configs\session.js file

### Run

  - Fetch server-side dependencies:
        npm install

  - Fetch client-side dependencies:
        bower install

  - Run gulp for generating client-side files:
        gulp prod (gulp dev)

  - Launch MongoDB

  If you'd like to change connection url for Mongodb, you should change it in configs\database.js file

  - Launch server:
        node bin\www

  Now open this URL in your browser:
    http://localhost:3000/

