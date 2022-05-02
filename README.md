# Cinemy
Cinemy allows users to share their opinion on hundreds of thousands of movies and view other users' thoughts as well.
<ul>
  <li>Hosted Project</li>
  <ul>
    <li>http://138.49.185.91:3000/</li>
    <li>Must be on UW-La Crosse network to access</li>
  </ul>
  <ul>
    <li>Running Project Locally</li>
    <ul>
      <li>Steps</li>
      <ul>
        <li>1. Run mongodb</li>
        <li>2. Run server</li>
        <li>3. Run angular</li>
      </ul>
      <li>Run database</li>
        <ul>
            <li>From root project directory use command: "mongod --dbpath="data/". You will need to create an empty
                directory called data if you haven't already. This will run the database, you will have to open a new
                terminal window to connect to the database.</li>
            <li>Use the command "mongo" in a different terminal window to connect to the data base and execute queries.
            </li>
        </ul>
      <li>Run Server</li>
      <ul>
        <li>From the server directory use command: "npm start". This will run the server.
          May need to run "npm install" to install dependencies if running in a new environment</li>
      </ul>
      <li>Angular</li>
        <ul>
            <li>From the "client" directory, use the command "ng serve --proxy-config proxy.conf.json" to run the app. It will be live on
                localhost:4200. If you are getting errors use "npm install" beforehand. </li>
        </ul>
      
