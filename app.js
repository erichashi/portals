const express = require('express');

//npm install nedb
//import Datastore
const Datastore = require('nedb');

const app = express();
app.listen(3000, () => console.log('ready'));

app.use(express.static('public'));
app.use(express.json());

// //create database
const database = new Datastore('database.db');
// //load database if exist. create if does not
database.loadDatabase();


//when receive a post resquest in this url, do something (return response)
app.post('/api/scores', async (request, response)=>{

    let data = request.body;

    console.log('receive data!');
    console.log(data);

    //insert into db
    database.insert(data);

    database.find({}).sort({score:-1}).exec( (err, data) => {
        try{

            let minscore = data[5].score;
            
            database.remove({score: {$lte: minscore}}, {multi: true}, (err, num) => {
                console.log(`Deleted ${num} items`);        
            });

        } catch(e){}
    });

    //return response to client
    response.json(data)
});

app.get('/api/scores', async (request, response) => {
    
    database.find({}).sort({score:-1}).exec( (err, data) => {
        if(err){
            response.end();
            return;
        };
        response.json(data);
    });
    
});

app.get('/api/scores/:place', (request, response) => {
    // console.log(request.params);

    database.find({}).sort({score:-1}).exec( (err, data) => {
        
        if(err){
            response.end();
            return;
        };
        
        let item = data[request.params.place];
        response.json(item);

    });

});
