const express = require("express");
const path = require("path");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3")
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "userdetails.db");

let db = null
const initializeDbServer = async() => {
    try {
        db = await open({
           filename:dbPath,
           driver:sqlite3.Database
        });
        app.listen(3007, () => {
            console.log("server running ....")
            });

    }catch(error){
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDbServer();


app.get("/user/", async(request, response) => {
    const getUserQuery = `
    select
    *
    from 
    userdetails
    where
    username = 'Raj sekar';`;
      try{const userArray = await db.all(getUserQuery);
        response.send(userArray);
    }catch(error){
        console.error(error.message)
        response.status(500).send("Internal Server Error")
    }
        

    }
    
);

app.post("/userdetails/", async(request,response) => {
  const {username, name, password, gender,location} = request.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `
  select
  *
  from
  userdetails
  where
  username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);

  if(dbUser === undefined){
    //create new user

    const createUser = `
    insert into
    userdetails(username,name,password,gender,location)
    values
    '${username}',
    '${name}',
    '${hashedPassword}',
    '${gender}',
    '${location}'
    `;

    await db.run(createUser);
    response.send("Created Successfully")
  }else{
    //user exist
    response.status(400).send("User Already exist")
  }
  
});
