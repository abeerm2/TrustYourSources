const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', (req,res) => {
    res.send({message: "hi"});
});

//Start your server on a specified port
app.listen(3100, ()=>{
    console.log(`Server is runing on port ${3100}`)
});