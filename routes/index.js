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
router.post('/getAllLibraries',index_controller.getAllLibraries);
router.get('/user',index_controller.user); 
router.post('/saveUser',index_controller.saveUser); 
router.post('/loginUser',index_controller.loginUser);

module.exports = router;
