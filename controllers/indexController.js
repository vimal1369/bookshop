

exports.index = function(req, res, next) {
   res.render('index');
};

exports.saveLibrary = function(req,res,next){
	 let libraryname = req.body.libraryname;
	function saveLibrfary(libraryname) {
        //   console.log(userdata); 

        return new Promise(function(resolve, reject) {
             /**var librarySchema = new Schema({
									name  :  { type: String, default: '' }
								});
		var libraryModel = mongoose.model('Library', librarySchema);**/
	
		var savelibraryName = new modelLibrary({'name': libraryname,'time': Math.floor(Date.now() / 1000)})
		savelibraryName.save(function (err, result) {

			if (err) throw err;

		if(result) {
			resolve(result)
		}
			});
        });
    }
	saveLibrfary(libraryname).then(function(response){
		res.send(response);
		
	})
	
	
}

exports.getAllLibraries = function(req,res,next){
	
	function getallLibrfary() {
        //   console.log(userdata); 

        return new Promise(function(resolve, reject) {
			
             modelLibrary.find({}, function(err, lib){
        if(err) throw err;
        resolve(lib);
     });

        });
      
    }
	getallLibrfary().then(function(response){
		res.send(response);
		
	})
	
	
}

exports.addBook = function(req, res, next) {
   res.render('addbook');
};


exports.savebook = function(req,res,next){
	 let bookname = req.body.bookname;
	 let library = req.body.library;
	function saveBook(bookname,library) {
        //   console.log(userdata); 

        return new Promise(function(resolve, reject) {
             /**var librarySchema = new Schema({
									name  :  { type: String, default: '' }
								});
		var libraryModel = mongoose.model('Library', librarySchema);**/
	
		var saveBooks = new modelBooks({'bookname': bookname,'libraryId': library,'time': Math.floor(Date.now() / 1000)})
		saveBooks.save(function (err, result) {

			if (err) throw err;

		if(result) {
			resolve(result)
		}
			});
        });
    }
	saveBook(bookname,library).then(function(response){
		res.send(response);
		
	})
	
	
}

exports.getAllbooks = function(req,res,next){
	
	function getallbooks() {
        //   console.log(userdata); 

        return new Promise(function(resolve, reject) {
			
             modelBooks.find({}, function(err, lib){
        if(err) throw err;
        resolve(lib);
     });

        });
      
    }
	getallbooks().then(function(response){
		res.send(response);
		
	})
	
	
}


exports.user = function(req, res, next) {
   res.render('user');
};


exports.saveUser = function(req,res,next){
	 let name = req.body.name;
	 let library = req.body.library;
	 let email = req.body.email;
	 let pass = req.body.password;
	function saveUser(name,library,email,pass) {
        //   console.log(userdata); 

        return new Promise(function(resolve, reject) {
             /**var librarySchema = new Schema({
									name  :  { type: String, default: '' }
								});
		var libraryModel = mongoose.model('Library', librarySchema);**/
	
		var saveUsers = new modelUser({'name': name,'libraryId': library,'email':email,'password':pass,'time': Math.floor(Date.now() / 1000)})
		saveUsers.save(function (err, result) {

			if (err) throw err;

		if(result) {
			resolve(result)
		}
			});
        });
    }
	saveUser(name,library,email,pass).then(function(response){
		res.send(response);
		
	})
	
	
}


exports.loginUser = function(req,res,next){
	 let email = req.body.email;
	 let pass = req.body.password;
	function loginveruify(email,pass) {
        //   console.log(userdata); 

        return new Promise(function(resolve, reject) {
			
             modelUser.find({'email':email}, function(err, userinfo){
        if(err) throw err;
        resolve(userinfo);
     });

        });
      
    }
	loginveruify(email,pass).then(function(response){
		if(pass == response[0].password){
			req.session.uid = response[0]._id;
			req.session.name = response[0].name;
			req.session.libraryId = response[0].libraryId;
			
			res.send(true);
		}else{
			res.send(false);
		}
		
	})
	
	
}

exports.userArea = function(req, res, next) {
	if (req.session.uid) {
       res.render('userArea');
  }else{
     res.redirect('/');
     return;
  }

};

exports.getloggedinuserInfo = function(req, res, next) {
	function loginUserInfo() {
        //   console.log(userdata); 

        return new Promise(function(resolve, reject) {
			
             modelUser.find({'_id':req.session.uid}, function(err, userinfo){
        if(err) throw err;
        resolve(userinfo);
     });

        });
      
    }
	loginUserInfo().then(function(response){
		
		if(response){			
			res.send(response[0]);
		}else{
			res.send(false);
		}
		
	})

};

exports.logout = function(req,res,next){
	
	req.session.destroy(function() {
   console.log("user logged out.")
   res.send(true);
  });
  
	
};



exports.saveIssuedBooks = function(req,res,next){
	 let bookid = req.body.bookId;
	 let flag = req.body.flag;
	
	function UpdateBook(bookid) {
        //   console.log(userdata); 

        return new Promise(function(resolve, reject) {
                modelBooks.update({'_id':bookid}, 
    { $set: {'userIssuedToId': req.session.uid, 'isIssued': flag } }, function(err, result) { 

      if(err) { throw err; } 
      
     if(result) {
			resolve(result)
		}

    }); 
	
		
        });
    }
	UpdateBook(bookid).then(function(response){
		res.send(response);
		
	})
	
	
}
