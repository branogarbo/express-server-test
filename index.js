const express = require('express');
const db = require('nedb');
const app = express();
const port = 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`))
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

let entries = new db('entries.db');
entries.loadDatabase();

app.get('/drop', (req,res)=>{
  console.log('got a get request');

  entries.find({},(err,data)=>{
    res.json(data);
  });
});

app.post('/drop', (req,res)=>{
  console.log('recieved post request');
  
  const data = req.body;

  entries.insert(data);
  res.end();
});