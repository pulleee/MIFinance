var dbClient = require('./databaseModule');
const bcrypt = require("bcryptjs");

async function createUser(name, password, callback){
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    dbClient.query("INSERT INTO MIFINANCE_USERS (name, password) VALUES ($1, $2)", [name, hash], function (dbError, dbResponse) {
        let success = true;
        if(dbError != undefined){
            success = false;
            console.log(dbError);
        }
        if(typeof callback == "function") callback(success);
    });
}

async function loginUser(name, password, callback){
    dbClient.query("SELECT * FROM MIFINANCE_USERS WHERE name=$1", [name], async (dbError, dbResponse) => {
        let success = true;
        let data = [];
        if(dbError == undefined){
            if(dbResponse.rows.length == 0){
                if(typeof callback == "function") callback(false, data);
            }else{
                const hashedPassword = dbResponse.rows[0].password;
                var validPw = await bcrypt.compare(password, hashedPassword);
                if(!validPw){
                    success = false;
                }else{
                    data = dbResponse.rows[0];
                    delete data.password;
                }
                if(typeof callback == "function") callback(success, data);
            }
        }else{
            if(typeof callback == "function") callback(false, data);
        }
    });
}

function updateUserCredit(id, credit, callback){
    dbClient.query("UPDATE MIFINANCE_USERS SET credit = $1 WHERE id=$2", [credit, id], function(dbError, dbResponse){
        let success = true;
        if(dbError != undefined){
            success = false;
            console.log(dbError);
        }
        if(typeof callback == "function") callback(success);
    });
}

async function updateUserPassword(id, password, callback){
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    dbClient.query("UPDATE MIFINANCE_USERS SET password = $1 WHERE id=$2", [hash, id], function(dbError, dbResponse){
        let success = true;
        if(dbError != undefined){
            success = false;
            console.log(dbError);
        }
        if(typeof callback == "function") callback(success);
    });
}

module.exports = {
    createUser: createUser,
    loginUser: loginUser,
    updateUserCredit: updateUserCredit,
    updateUserPassword: updateUserPassword
  }