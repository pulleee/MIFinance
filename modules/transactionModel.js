var dbClient = require('./databaseModule');

function createTransaction(name, symbol, amount, price, user_id, callback){
    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + ' ' + cTime;
    dbClient.query("INSERT INTO MIFINANCE_TRANSACTIONS (name, symbol, amount, price, buy_date, user_id) VALUES ($1, $2, $3, $4, $5, $6)", [name, symbol, amount, price, dateTime, user_id], function (dbError, dbResponse) {
        let success = true;
        if(dbError != undefined){
            success = false;
            console.log(dbError);
        }
        if(typeof callback == "function") callback(success);
    });
}

function getTransactionByUserId(user_id, callback){
    dbClient.query("SELECT * FROM MIFINANCE_TRANSACTIONS WHERE user_id = $1 ORDER BY id desc", [user_id], function(dbError, dbResponse){
        let success = true;
        let data = [];     
        if(dbError == undefined){
            data = dbResponse.rows;
        }else{
            success = false;
            console.log(dbError);
        }
        if(typeof callback == "function") callback(success, data);     
    });
}

function getSharesByUserId(user_id, callback){
    dbClient.query("SELECT name, symbol, SUM(amount) as totalamount FROM mifinance_transactions WHERE user_id = $1 GROUP BY symbol, name HAVING SUM(amount) > 0", [user_id], function(dbError, dbResponse){
        let success = true;
        let data = [];     
        if(dbError == undefined){
            data = dbResponse.rows;
        }else{
            success = false;
            console.log(dbError);
        }
        if(typeof callback == "function") callback(success, data);     
    });
}

function getSymbolsByUserId(user_id, callback){
    dbClient.query("SELECT symbol FROM mifinance_transactions WHERE user_id = $1 GROUP BY symbol HAVING SUM(amount) > 0", [user_id], function(dbError, dbResponse){
        let success = true;
        let data = [];     
        if(dbError == undefined){
            data = dbResponse.rows;
        }else{
            success = false;
            console.log(dbError);
        }
        if(typeof callback == "function") callback(success, data);     
    });
}

function getSymbolAmountByUserId(user_id, symbol, callback){
    dbClient.query("SELECT SUM(amount) as amount FROM mifinance_transactions WHERE user_id = $1 and symbol = $2 HAVING SUM(amount) > 0", [user_id, symbol], function(dbError, dbResponse){
        let success = true;
        let data = [];     
        if(dbError == undefined){
            data = dbResponse.rows[0];
        }else{
            success = false;
            console.log(dbError);
        }
        if(typeof callback == "function") callback(success, data);     
    });
}

module.exports = {
    createTransaction: createTransaction,
    getTransactionByUserId: getTransactionByUserId,
    getSharesByUserId: getSharesByUserId,
    getSymbolsByUserId: getSymbolsByUserId,
    getSymbolAmountByUserId: getSymbolAmountByUserId
}
