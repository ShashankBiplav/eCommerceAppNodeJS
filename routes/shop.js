const path = require('path');

const express = require('express');

const router = express.Router();

const rootDir = require('../util/path.js');

router.get('/',(req, res, next)=>{
    console.log('In default middleware');
    //TODO: Send response
    res.sendFile(path.join(rootDir,'views','shop.html'));
});

module.exports = router;