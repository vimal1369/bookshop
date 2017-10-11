 'use strict';
 var bookApp = angular.module('bookApp', []); //['ui.bootstrap']
 bookApp.config(['$locationProvider', function($locationProvider) {
     $locationProvider.html5Mode({
         enabled: true,
         requireBase: false
     });

 }]);

bookApp.controller('bookcontroller', ['$scope', '$rootScope','$location', '$window','$filter','$timeout','bookContent', function($scope, $rootScope, $location, $window,$filter,$timeout,bookContent) {
$scope.librarObj = [];
$scope.booksObj  = [];
/*
* register library
*/     
$scope.regLibrary = function(data){
	
	var librarydata = {'libraryname':data.libraryname};
	bookContent.saveLibrary(librarydata).then(function(response){
		if(response){		
		bookContent.getAllLibraries().then(function(res){
			$scope.librarObj = res;
		});
		}
		else{
		console.log('some error occured');
		}
	});
}

$scope.saveBook = function(data){
	//console.log(data);
	var bookdata = {'bookname':data.bookname,'library':data.library};
	bookContent.savebook(bookdata).then(function(response){
		if(response){
		bookContent.getAllbooks().then(function(books){
			$scope.booksObj = books;
		});
		}
		else{
		console.log('some error occured');
		}
	});
}

$scope.regUser = function(data){
	
	var userdata = {'name':data.name,'email':data.email,'library':data.library,'password':data.password};
	bookContent.saveUser(userdata).then(function(response){
		alert('registered Successfully with Userid'+ response._id);
		console.log('Userdata'+ response);
	});
}


$scope.login = function(data){
	
	var userdata = {'email':data.email,'password':data.password};
	bookContent.loginUser(userdata).then(function(response){
	//	alert('registered Successfully with Userid'+ response._id);
		console.log( response);
	});
}

$scope.init = function(){
	bookContent.getAllLibraries().then(function(res){
			$scope.librarObj = res;
		}); 
		
		bookContent.getAllbooks().then(function(books){
			$scope.booksObj = books;
		});
	
}


 }]);
 
 bookApp.factory('bookContent', [
     '$q',
     '$http',
     '$location',
     function($q,
         $http,
         $location) {
         return {
             saveLibrary: function(params) {

                 var defer = $q.defer();

                 $http.post('/saveLibrary', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
         getAllLibraries: function(data){
             var defer = $q.defer();
             $http.post('/getAllLibraries',data).then(function(response) {
                 defer.resolve(response.data);
             }, function(error) {
                 defer.reject(error);
             }, function(process) {
                 defer.notify(process);
             });
             return defer.promise;

         },
		 getAllbooks: function(data){
             var defer = $q.defer();
             $http.post('/getAllbooks',data).then(function(response) {
                 defer.resolve(response.data);
             }, function(error) {
                 defer.reject(error);
             }, function(process) {
                 defer.notify(process);
             });
             return defer.promise;

         },
		  savebook: function(data){
             var defer = $q.defer();
             $http.post('/savebook',data).then(function(response) {
                 defer.resolve(response.data);
             }, function(error) {
                 defer.reject(error);
             }, function(process) {
                 defer.notify(process);
             });
             return defer.promise;

         }
		 ,
		  saveUser: function(data){
             var defer = $q.defer();
             $http.post('/saveUser',data).then(function(response) {
                 defer.resolve(response.data);
             }, function(error) {
                 defer.reject(error);
             }, function(process) {
                 defer.notify(process);
             });
             return defer.promise;

         },
		  loginUser: function(data){
             var defer = $q.defer();
             $http.post('/loginUser',data).then(function(response) {
                 defer.resolve(response.data);
             }, function(error) {
                 defer.reject(error);
             }, function(process) {
                 defer.notify(process);
             });
             return defer.promise;

         }
     };

         




     }
 ]);


 function alertBox(message, callback) {
     if ($.isEmptyObject(callback)) {
         var callback = checkOpenModal();
     }
     var title = GlobalObj.alert_title;
     var okBtn = GlobalObj.ok_btn;
     var data = bootbox.dialog({
         message: message,
         title: title,
         size: "small",
         buttons: {
             ok: {
                 label: okBtn,
                 className: "btn-default",
                 callback: callback
             }
         }
     });
 }


