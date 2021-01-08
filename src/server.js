const express = require('express');

//npm install nedb
const Datastore = require('nedb');


const create = async () => {
    
    // //create database
    const database = new Datastore('src/database.db');
    // //load database if exist. create if does not
    await database.loadDatabase();

    const app = express();
    app.use(express.static('public'));
    app.use(express.json());

    
    app.get('/api/scores', async (request, response) => {
        try{
            //pegar             
            database.find({}).sort({score:-1}).exec( (err, data) => {
                    if(err){
                        response.end();
                        return;
                    };
                response.json(data);
            });

        } catch(e) {
            console.log(e)
            response.end();
            return;
        }
    });

    //when receive a post resquest in this url, do something (return response)
    app.post('/api/scores', async (request, response)=>{
        // console.log('-------------');
    
        let data = request.body;

        // console.log('receive data!');
        // console.log(data);
    
        //insert into db
        database.insert(data);
    
        database.find({}).sort({score:-1}).exec( (err, data) => {
            try{
    
                let minscore = data[5].score;
                
                database.remove({score: {$lte: minscore}}, {multi: true}, (err, num) => {
                    console.log(`Removed ${num} items`);        
                });
    
            } catch(e){}
        });
    
        //return response to client
        response.json(data)
    

    });

    return app;
}

module.exports = {
    create
};
