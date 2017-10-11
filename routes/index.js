var express = require('express');
var router = express.Router();
//var Author = require('../models/author');
var index_controller = require('../controllers/indexController');
/* GET home page. */
router.get('/',index_controller.index);
router.post('/saveLibrary',index_controller.saveLibrary);
router.post('/getAllLibraries',index_controller.getAllLibraries);
router.get('/addBook',index_controller.addBook); 
router.post('/savebook',index_controller.savebook); 
router.post('/getAllbooks',index_controller.getAllbooks);

module.exports = router;
