

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

