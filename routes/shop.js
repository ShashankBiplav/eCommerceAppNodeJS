const express = require('express');

const router = express.Router();

router.get('/',(req, res, next)=>{
    console.log('In default middleware');
    //TODO: Send response
    res.send('<h1> Hello from NodeJS via express</h1>');
});

module.exports = router;