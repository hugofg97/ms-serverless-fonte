"use strict"

const serverless = require("serverless-http"); 

const express = require("express") 

const bodyParser = require("body-parser"); 

const app = express() 

const AWS = require("aws-sdk"); 

app.use(bodyParser.json({ strict: false })); 

app.get('/oi', async (req,res) => {
    console.log(oi)
})
module.exports.app = app;