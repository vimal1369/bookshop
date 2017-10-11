 'use strict';
 var chatApp = angular.module('chatApp', ['ngSanitize', 'ngClipboard', "ui.calendar", "ui.bootstrap"]); //['ui.bootstrap']
 chatApp.config(['$locationProvider', function($locationProvider) {
     $locationProvider.html5Mode({
         enabled: true,
         requireBase: false
     });

 }]);


chatApp.run(function($rootScope, $timeout, $document,ChatContent) {  
 ChatContent.getUserInfo().then(function(response) {
    $rootScope.lockOutTime = response.lockOutTime;
    console.log('runnn0',$rootScope.lockOutTime);
    if($rootScope.lockOutTime != ''){
    if($rootScope.lockOutTime == 5){
        var TimeOutTimerValue = 300000; 
    }else if ($rootScope.lockOutTime == 10){
         var TimeOutTimerValue = 600000;
    }else if ($rootScope.lockOutTime == 15){
         var TimeOutTimerValue = 900000;
    }else if ($rootScope.lockOutTime == 20){
         var TimeOutTimerValue = 1200000;
    } 
        
    var TimeOut_Thread = $timeout(function(){ LogoutByTimer() } , TimeOutTimerValue);
    var bodyElement = angular.element($document);
    /// Keyboard Events
    bodyElement.bind('keydown', function (e) { TimeOut_Resetter(e) });  
    bodyElement.bind('keyup', function (e) { TimeOut_Resetter(e) });    

    /// Mouse Events    
    bodyElement.bind('click', function (e) { TimeOut_Resetter(e) });
    bodyElement.bind('mousemove', function (e) { TimeOut_Resetter(e) });    
    bodyElement.bind('DOMMouseScroll', function (e) { TimeOut_Resetter(e) });
    bodyElement.bind('mousewheel', function (e) { TimeOut_Resetter(e) });   
    bodyElement.bind('mousedown', function (e) { TimeOut_Resetter(e) });        

    /// Touch Events
    bodyElement.bind('touchstart', function (e) { TimeOut_Resetter(e) });       
    bodyElement.bind('touchmove', function (e) { TimeOut_Resetter(e) });        

    /// Common Events
    bodyElement.bind('scroll', function (e) { TimeOut_Resetter(e) });       
    bodyElement.bind('focus', function (e) { TimeOut_Resetter(e) });    

    function LogoutByTimer()
    {
        console.log('logout');
        window.location.href = '/logout';
    }

    function TimeOut_Resetter(e)
    {
        //console.log('' + e);
        /// Stop the pending timeout
        $timeout.cancel(TimeOut_Thread);
        /// Reset the timeout
        TimeOut_Thread = $timeout(function(){ LogoutByTimer() } , TimeOutTimerValue);
    }

}

         });

    // Timeout timer value
    // var TimeOutTimerValue = 50000;

    // Start a timeout
    

})


chatApp.controller('chatcontroller', ['$scope', '$rootScope', 'ChatContent', 'ngClipboard', '$sce', '$location', '$window','$filter','$timeout', function($scope, $rootScope, ChatContent, ngClipboard, $sce, $location, $window,$filter,$timeout) {
     $scope.chatData = [];
     $scope.CompanyUser = [];
     $scope.chatinfo = {};
     $scope.showchat = true;
     $scope.callstared = false;
     $scope.chatGroupData = [];
     $scope.mediaData = [];
     $scope.editExisting = false;
     $scope.addNew = false;
     $scope.group = {};
    $scope.notificationData ={};
     $scope.calldataReq = {
         'status': false,
         'chatid': ''
     };

     /** Setting tab variable */
     $scope.listSection = true;
     $scope.profileSection = false;
     $scope.statusSetting = false;
     $scope.showmsg = true;
     $scope.listSection = true;
     


     $scope.$watch('$viewContentLoaded', function() {
         var openaction = $window.sessionStorage.getItem('openaction');
         if (openaction) {
             $scope.listSection = false;
             $scope[openaction] = true;
             if ($(".toggle-rt").is(":visible")) {
                 console.log('visible');
             } else {
                 setTimeout(function() {
                     $('.toggle-rt').toggle('slide', {
                         direction: 'right'
                     });
                 }, 1000);
                 return 0;
             }
         } else {
             $('.toggle-rt').hide();
         }


     });
         $scope.playAudioReject = function(data) {
         var audio = new Audio('audio/bring-the-drama.mp3');
         if(data == 'accept'){
          
        audio.play();

         }else{
              audio.pause();

         }
        
    };
 
       $scope.getGroupData =function(){
           ChatContent.getGroupData().then(function(response) {
            $scope.chatgroupdata = response;
         });
     }

    $scope.getGroupData();

    $scope.getejs = function() {

         var chatid = $location.search().id;
         $scope.chatmedia = [];
         var data = {
             'chatid': chatid
         };
         ChatContent.getChatMediaData(data).then(function(response) {
             $scope.chatmedia.push(response);

         });
     }

    
    // Create a dataURL from an img element
// function getImageDataURL(img) {
// 	// Create an empty canvas element
// 	var canvas = document.createElement("canvas");

// 	// Copy the image contents to the canvas
// 	canvas.width = img.width;
// 	canvas.height = img.height;
// 	var ctx = canvas.getContext("2d");
// 	ctx.drawImage(img, 0, 0);

// 	return canvas.toDataURL("image/png");
// }
     $scope.closeOut = function(chatid) {
         var data = {
             'chatid': chatid
         };
         ChatContent.changecloseout(data).then(function(response) {
             $scope.hidechatBox(chatid);

         });

     };
     $scope.savegroupChat = function(formScope, companyName, contactName, userkey, showloader) {
         var chatroomid = formScope.chatObj.chatroomid;
         var type = validateText(formScope.textmsg);
         var data = {
             'textmsg': formScope.textmsg,
             'chatidmsg': formScope.chatidmsg,
             'type': type
         };
         ChatContent.addmessage(data).then(function(response) {
             $scope.openGroupchat(chatroomid, showloader);
             $scope.openchat(userkey, companyName, contactName,showloader);
         });

     };
    
    $scope.openchat = function(userkey, companyName, contactName,showloader) {
         if(showloader == true){
            showFullscreenLoader();
         }
         
         var data = {
             'userkey': userkey,
             'companyName': companyName,
             'contactName': contactName
         };
          
         ChatContent.postid(data).then(function(response) {
             var flag = false;
             var arr = [];
             angular.forEach($scope.chatData, function(value, key) {
                 if (value[0].chatkey == response[0].chatkey) {
                     console.log(value[0].chatkey + ' here' + response[0].chatkey);
                     console.log(key);
                     $scope.chatData.splice(key, 1);
                     $scope.chatData.splice(key, 0, response);
                     flag = true;
                 }
             });

             if (flag) {} else {
                 $scope.chatData.push(response);
             }
             hideFullscreenLoader();
         });
     }

    $scope.Transferchat = function(UserId,Chatkey,tranferUid){
         showFullscreenLoader();
        console.log('tranferUid',tranferUid);
        var data = {'UserId':UserId,'Chatkey':Chatkey,'tranferUid':tranferUid};
        $scope.hidechatBox(Chatkey);
          ChatContent.Transferchat(data).then(function(response) {
             console.log('response',response);
          $scope.getCompanyUser();
            
         });
       
    }


    $scope.openchatS = function(userkey, companyName, contactName,showloader) {
        if(showloader == true){
            showFullscreenLoader();
        }

        var data = {
            'userkey': userkey,
            'companyName': companyName,
            'contactName': contactName
        };
        $scope.getCompanyUser();
        
        ChatContent.postidS(data).then(function(response) {
            var flag = false;
            var arr = [];
            angular.forEach($scope.chatData, function(value, key) {
                if (value[0].chatkey == response[0].chatkey) {
                    console.log(value[0].chatkey + ' here' + response[0].chatkey);
                    console.log(key);
                    $scope.chatData.splice(key, 1);
                    $scope.chatData.splice(key, 0, response);
                    flag = true;
                }
            });

            if (flag) {} else {
                $scope.chatData.push(response);
            }

            
            
            hideFullscreenLoader();
        });
    }

        $scope.getchatinfo = function(userkey, companyName, contactName) {
         var data = {
             'userkey': userkey,
             'companyName': companyName,
             'contactName': contactName
         };
         ChatContent.postid(data).then(function(response) {
            angular.forEach($scope.CompanyUser, function (value, key) {
                if(value.userkey == response[0].reciverId){
                    value.chatkey = response[0].chatkey;
                }
            });

               $scope.calloutuser = $filter('filter')($scope.CompanyUser, {checked: true});
              
           
         });

     }

     $scope.updatePassword =function(){
         var data =  {'password':$scope.password};
           ChatContent.updatePassword(data).then(function(response) {
             console.log('res',response);
                 if(response.result == true){
                     $scope.password = '';
                     $scope.cpassword = '';
                     $scope.successmsg = response.msg;
                          $timeout(function(){
                    $scope.successmsg = '';
                }, 2000);
                 }
             
         });
     }

    $scope.userProfile = function(){
        showFullscreenLoader();
        var userId = $location.search().userId;
        var data = {'userId':userId};
        ChatContent.userProfileData(data).then(function(response) {
            $scope.user = response.data;
            hideFullscreenLoader();
        });

     }

     $scope.hidechatBox = function(chatid) {
         showFullscreenLoader();
        
         $scope.chatData.forEach(function(item, index, object) {
             if (item[0].chatkey == chatid) {
                 object.splice(index, 1);
                 var flag = index;
                 hideFullscreenLoader();
             }

         });
     };

     $scope.hidechatBox1 = function(chatid) {
         showFullscreenLoader();
         $scope.chatGroupData.forEach(function(item, index, object) {
             if (item.chatroomid == chatid) {
                 object.splice(index, 1);
                 var flag = index;
                 hideFullscreenLoader();
             }

         });
     };



     $(document).ready(function() {
         if (window.location.href.indexOf("code") > -1) {
             $scope.getNewToken();
         }
     });

     $scope.getNewToken = function() {
         var data = {
             'code': $location.search().code
         };
         ChatContent.getNewToken(data).then(function(response) {});
     }



     //**************Copy Message **************//
     $scope.toClipboard = ngClipboard.toClipboard;

     $scope.toClipboard1 = function(message) {

         var text = '<ul>';
         angular.forEach(message, function(value, key) {
             text = text + '<li>' + value.text + '</li>';
         })
         text = text + '</ul>';
         return text;

     }

     $scope.saveForm = function(formScope, companyName, contactName, userkey) {
         var type = validateText(formScope.textmsg);

         var data = {
             'textmsg': formScope.textmsg,
             'chatidmsg': formScope.chatidmsg,
             'type': type
         };
         ChatContent.addmessage(data).then(function(response) {
             $scope.openchat(userkey, companyName, contactName);
         });

     };



     function validateText(str) {
         var tarea = str;
         if (tarea.indexOf("http://") == 0 || tarea.indexOf("https://") == 0) {
             return 1;
         }
         return 0;
     }
    $scope.the_string = '';

     $scope.menuclick = function(action) {
         $scope.showchat = true;
         $scope.showGroupStatus = false;
         $scope.showmsg = false;
         if (action == 'logout') {
             $window.sessionStorage.clear();
             $window.location.href = '/logout';
         } else {

             $window.sessionStorage.setItem('openaction', action);
              if(action == 'adminUserSetting' || action == 'adminSetting'){
                $scope.getGroupData();
             }
             $scope.listSection = false;
             $scope.the_string = action;
             $scope[$scope.the_string] = true;
         }


     };

     $scope.showchatsec = function() {
         $scope.showchat = true;
        var openaction = $window.sessionStorage.getItem('openaction');
         $scope.listSection = true;
         if (openaction) {
             $scope[openaction] = false;
             $window.sessionStorage.clear();
         }

     };

    $scope.getPermission = function(chatkey){
        var data = {
             'chatkey': chatkey
         };
       
        ChatContent.getchatdata(data).then(function(response) {
            $scope.permissionData = response.groupsettings;
        });
    }

    $scope.getCRusers = function(){
        ChatContent.getCRusers().then(function(response) {
            console.log('response',response);
            $scope.getCRusers = response;
        });

    }

    $scope.getCRusers();

     $scope.getCompanyUser = function() {
         ChatContent.getCompanyUsers().then(function(response) {
             var msgData = response;
             console.log('msgDatamsgData',msgData);
             var j = 0;
             angular.forEach(response, function(value, key) {
                 var i = 0;
                 var lengthData = value.chatGData[0];

                 if(typeof lengthData != 'undefined' ){
                 angular.forEach(value.chatGData[0].chatValue.messages, function(val, key) {

                     if(val.read == 'true'){

                     }else if(value.userkey == val.ownerID){

                         i++;
                     }else{
                      
                     }

                 });
                  
                 value.chatGData[0].msgcount=i;
                 j = j+i;
                   }
             });
             response.totmsg = j;
             $scope.CompanyUser = response;
             console.log('$scope.CompanyUser',$scope.CompanyUser);

         });
     };

     $scope.baccktosetting = function() {
         var openaction = $window.sessionStorage.getItem('openaction');
         $scope.listSection = true;
         if (openaction) {
             $scope[openaction] = false;
             $window.sessionStorage.clear();
         }
     }

     $scope.triggerNotifications = function(chatid){
        var data = {'chatid':chatid};
       ChatContent.notificationInfoID(data).then(function(response) {
          
           if(response.queueNotify == true){
              $scope.playAudio();
           }

           if(response.videoNotify == true){
             $scope.playAudio();
            
           }

           if(response.replyNotify == true){
             $scope.playAudio();
           }

       });
        
     };
    
    $scope.playAudio = function() {
        var audio = new Audio('audio/isnt-it.mp3');
        audio.play();
    };

    

    $scope.acceptReq = function(reqUserId,chatroom_key){
        $scope.reqUserId = reqUserId;
        $scope.chatroom_key = chatroom_key;

        
        $( "#dialog_box" ).dialog({
                minHeight: 150,
                width: 350,
                draggable: true,
                resizable: false,
                modal: true,
        })
    }
    $scope.closeDialog = function(){
        $("#dialog_box").dialog("close");
    }

    $scope.updateReadMsg = function(chatkey){
        var data = {'chatkey':chatkey};
           ChatContent.updateReadMsg(data).then(function(response) {
                console.log('resonse',response);
             });

    }

    $scope.adduserReq = function(){
        //console.log('$scope.reqUserId',$scope.reqUserId);
        var data = {'reqUserId':$scope.reqUserId,'chatroom_key':$scope.chatroom_key};
          ChatContent.adduserReq(data).then(function(response) {
              console.log('res',response);
              $("#dialog_box").dialog("close");
              if(response.result){
               showFullscreenLoader();
               ChatContent.getRequestedUser().then(function(response) {
                 $scope.reqUser = response.result;
                 hideFullscreenLoader();
             });
          }else{
                  hideFullscreenLoader();
          }
                hideFullscreenLoader();
            
             });

    }

    setInterval(function() {
        ChatContent.getRequestedUser().then(function(response) {
            if(response.result.length > 0){
                $scope.reqUser = response.result;
            }
               
        });
      }, 20000);

    setInterval(function() {

        ChatContent.getNotifications().then(function(response) {
         $scope.notificationData = response;

        });
    }, 5000);

    $scope.Markread = function(notiId){
        var noticData = {'notiId':notiId};
        ChatContent.updateNotifications(noticData).then(function(response) {
           if(response.read) {
               ChatContent.getNotifications().then(function (response) {
                   $scope.notificationData = response;

               });
           }

        });
    }

    $scope.sendmsgDemo = function(msgdata){
          var msg = {'msg':msgdata.msg};
        ChatContent.sendmsgDemo(msg).then(function (response) {
            $scope.msg='';

        });

    }


     function dateDiffrence (timestamp1, timestamp2) {
       var timeStart = timestamp1;
        var timeEnd = timestamp2;
        var hourDiff = timeEnd - timeStart; //in ms
        var secDiff = hourDiff / 1000; //in s
        var minDiff = hourDiff / 60 / 1000; //in minutes
        var hDiff = hourDiff / 3600 / 1000; //in hours
        var humanReadable = {};
        humanReadable.hours = Math.floor(hDiff);
        humanReadable.minutes = minDiff - 60 * humanReadable.hours;
       return minDiff - 60 * humanReadable.hours; //{hours: 0, minutes: 30}
}


        $scope.active = 'showchat';
        $scope.opengroup = function(trigger) {
         showFullscreenLoader();
         $scope.active = $scope.active == trigger ? trigger : trigger;
         if(trigger == 'Queue'){
            ChatContent.getRequestedUser().then(function(response) {
                $scope.reqUser = response.result;
                hideFullscreenLoader();
             });
            
         }

         if (trigger == 'showchat') {
             $scope.getCompanyUser();
             hideFullscreenLoader();
         };
           if (trigger == 'ClosedOut') {
             $scope.getCompanyUser();
             hideFullscreenLoader();
         };
         if (trigger == 'setting') {
             ChatContent.getGroupListforChat().then(function(response) {
                 $scope.chatGroupList = response;
                 hideFullscreenLoader();
             });

         }

         if (trigger == 'datascreen') {
             ChatContent.getDataForScreen().then(function(response) {
                 $scope.DataOfUser = response;
                 var i = 0;
                 var j = 0;
                 var k = 0;
                 var sumOfminutestaken = 0;
                 var sumOfresponse = 0;
                 angular.forEach(response, function(value, key) {
                      var data = value.data;
                      var restime = '';
                      if(data.activeChat == true){
                          i++;
                        var message =   data.messages;
                        var ss = 0;
                         angular.forEach(message, function(value, key) {
                         
                         if(ss == 1){
                                   
                          restime =  value.time;
                         }

                           ss++ ;
                           });
                         if(restime != ''){
                         sumOfresponse = sumOfresponse + dateDiffrence(data.tsEnd,restime);
                           }
                      }

                      if(data.activeChat == false){
                          j++;
                         sumOfminutestaken = sumOfminutestaken + dateDiffrence(data.tsEnd,data.tsStart);
                      }
                    });
                 $scope.noOfClosedTicket = j;
                 $scope.noOfOpenTicket = i;
                 if(sumOfminutestaken != 0 ){
                 $scope.avgMinutes = sumOfminutestaken/j; 
                     }else{
                          $scope.avgMinutes = "No Data.";
                     }
                if(sumOfresponse != 0 ){
                 $scope.avgRestime = sumOfresponse/i;
                  }else{
                          $scope.avgRestime = "No Data.";
                     }

                 hideFullscreenLoader();
             });

         }

         if (trigger == 'chatscreen') {
             ChatContent.getGroupListforChat().then(function(response) {
                 $scope.chatGroupList = response;
                 hideFullscreenLoader();
             });

         }
         if (trigger == 'Calendar') {
             ChatContent.getCalenderApi().then(function(response) {
                 $scope.calenderdata = response;
                 if (response.events) {
                     var events = [];
                     angular.forEach($scope.calenderdata.events, function(value, key) {
                         this.push({
                             title: value.summary,
                             summary: value.description,
                             start: value.start.dateTime
                         });
                     }, events);
                     $('#calendar').fullCalendar({
                         events: events,
                         header: {
                             left: 'month,agendaWeek,agendaDay',
                             center: 'title',
                             right: 'prev,next today'
                         },
                         selectable: true,
                         eventRender: function(events, element) {
                             element.attr('href', 'javascript:void(0);');
                             element.click(function() {
                                 $("#startTime").html(moment(events.start).format('MMM Do h:mm A'));
                                 $("#eventInfo").html(events.summary);
                                 $("#eventContent").dialog({
                                     modal: true,
                                     title: events.title,
                                     width: 350,
                                     create: function(event, ui) {
                                         $(event.target).parent().css('position', 'fixed');
                                     }
                                 });
                             });
                         }

                     });

                     $('#calendar1').fullCalendar({
                         events: events,
                         header: {
                             left: 'month,agendaWeek,agendaDay',
                             center: 'title',
                             right: 'prev,next today'
                         },
                         selectable: true,
                         eventRender: function(events, element) {
                             element.attr('href', 'javascript:void(0);');
                             element.click(function() {
                                 $("#startTime").html(moment(events.start).format('MMM Do h:mm A'));
                                 $("#eventInfo").html(events.summary);
                                 $("#eventContent").dialog({
                                     modal: true,
                                     title: events.title,
                                     width: 350,
                                     create: function(event, ui) {
                                         $(event.target).parent().css('position', 'fixed');
                                     }
                                 });
                             });
                         }

                     });

                 }
                     hideFullscreenLoader();

             });
         }

         if (trigger == 'callout') {
             hideFullscreenLoader();

         }
         
        
     };

     $scope.$watch("checkemail", function(newValue, oldValue) {
         ChatContent.getUserCheck(newValue).then(function(response) {
             $scope.emailcheckStatus = response;
         });

     });

     $scope.CustomerProfile = function() {
         var chatid = {
             'chatid': $location.search().chatid
         };
         ChatContent.getMemberUid(chatid).then(function(response) {
             var userids = response;
             ChatContent.getCustomerProfile(userids, chatid).then(function(response) {
                 $scope.profileData = response.profileData;
             });

         });

     }
     $scope.deleteMemberuId = function(userkey, chatid) {
         var data = {
             'userkey': userkey,
             'chatid': chatid
         };
         ChatContent.deleteMemberUsersId(data).then(function(response) {
             $scope.CustomerProfile();
         });

     }

     $scope.deleteUser = function(userkey) {
         showFullscreenLoader();
         var data = {
             'userkey': userkey
         };
         ChatContent.deleteCompanyUsers(data).then(function(response) {
             if (response == true) {
                 hideFullscreenLoader();
                 $scope.getCompanyUser();

             }
             hideFullscreenLoader();
         });

     };

     $scope.getMedia = function() {

         chatContent.getMediaData().then(function(response) {
             $scope.mediaData.push(response);

         });
     };

     $scope.createGroupdata = function(groupData) {
         showFullscreenLoader();

         var formData = groupData.group;
         $scope.group = {};
         ChatContent.CreateGroupforChat(formData).then(function(response) {
             hideFullscreenLoader();
             $scope.grpmessage = response;
             $scope.opengroup('chatscreen');
             $timeout(function(){
                $scope.grpmessage = '';
                }, 2000);
         });
     };

     $scope.SendMessage = function(messagedata){
         if(typeof $scope.calloutuser == 'undefined' || $scope.calloutuser == ''){
             $scope.errormsg = 'please select the user.';
             return;
         }
         if(typeof messagedata.callout == 'undefined' || messagedata.callout.message == ''){
              $scope.errormsg = 'Message is Required.';
              return;
         }
        angular.forEach($scope.calloutuser,function(value,key){
        var data = {
             'textmsg': messagedata.callout.message,
             'chatidmsg': value.chatkey,
             'type': 0
         };
            ChatContent.addmessage(data).then(function(response) {
                $scope.openchat(value.userkey, value.userValue.companyName, value.userValue.contactName,true);
                  $scope.showcallmessage = true;
                  $scope.errormsg = '';
                        $timeout(function(){
                    $scope.showcallmessage = false;
                    $scope.chatData = [];
                }, 2000);
                 value.checked = false;
                 $scope.calloutuser = '';
                 messagedata.callout.message = '';

                 
                 
            });
            })
     }


     $scope.openGroupchat = function(chatkey) {
         showFullscreenLoader();
         var data = {
             'chatkey': chatkey
         };
         ChatContent.getchatdata(data).then(function(response) {
             var flag = false;
             var arr = [];

             angular.forEach($scope.chatGroupData, function(value, key) {
                 if (value.chatroomid == response.chatroomid) {
                     $scope.chatGroupData.splice(key, 1);
                     $scope.chatGroupData.splice(key, 0, response);
                     flag = true;
                 }

             });

             if (flag) {
                 hideFullscreenLoader();
             } else {
                 $scope.chatGroupData.push(response);
                 hideFullscreenLoader();
             }

         });
     };

     $scope.getUserMedia = function() {
         ChatContent.getMediaData().then(function(response) {
             $scope.mediaData.push(response);
         });

     };

    //  $scope.getchatdata = function() {
    //      ChatContent.GetChatMedia().then(function() {
    //      });

    //  }

     $scope.updateStatus = function() {
         showFullscreenLoader();
         var Status = {
             'pstatus': $scope.Profilestatus
         };

         ChatContent.updateUserStatus(Status).then(function(response) {

             console.log('DOne');
             hideFullscreenLoader();

         });
     };

     $scope.init = function() {
         $scope.getCompanyUser();
         $scope.getUserMedia();

         ChatContent.getUserInfo().then(function(response) {
             $scope.Profilestatus = response.PStatus;


         });
         ChatContent.getUserPaymentdata().then(function(response) {
             $scope.payemntHistoryData = response.data;
             // $scope.openchat(userkey, companyName, contactName);
         });

     };

     $scope.startCall = function(chatId) {

         var chatid = {
             'chatID': chatId
         };

         ChatContent.getChatCallerStatus(chatid).then(function(response) {
             var chatData = {
                 "memberUid": response.memberUid,
                 "ownerUid": response.ownerUid,
                 "chatid": response.chatid
             };
            
             ChatContent.IsUserBusy(chatData).then(function(statusFlag) {
                 if (statusFlag) {
                     $scope.callstared = true;
                     angular.element('#button-join').trigger('click');
                 }else{
                    $scope.callResponse = true;
                 }

             });

         });

     };

  


     $scope.EndCall = function(chatId) {
       
     var chatId = {'chatId':chatId,'status':3};

        ChatContent.UpdatechatStatus(chatId).then(function(response) {
             if (response) {
                 angular.element('#button-leave').trigger('click');
                 $scope.callstared = false;

             }

         });



     }

     $scope.getChatID = function() {
         var chatroomId = $location.search().chatid;
         var recive = $location.search().recive;
         $scope.chatroomId = chatroomId;
         if (recive && ($scope.chatroomId != '')) {
            $scope.callstared = true;
             setTimeout(function() {
                 angular.element('#button-join').trigger('click');
             }, 200)

         }
     };

   
 
     $scope.triggerCallReq = function(chatdata, chatreqid) {
      
         var data = {
             'chatdata': chatdata,
             'chatreqid': chatreqid
         };
         $scope.show_reject = true;

         ChatContent.chatReqtrigger(data).then(function(request) {
             var reData = request;
             if (request.status) {
                 $scope.calldataReq = reData;
                 $scope.playAudioReject('accept');
             }else{
                 $scope.show_reject = false;
                 $scope.playAudioReject('reject');
              
             }

         });
     };

     $scope.Callaccept = function(chatid) {
         clearInterval($scope.myVar);
         $scope.show_reject = false;
        var data = {'chatId':chatid,'status':4};
         ChatContent.UpdatechatStatus(data).then(function(response) {
             if (response) {
                $window.location.href = '/chatapi/videochat?chatid=' + chatid + '&recive=true';
             }

         });

        
     }
     
     $scope.rejectaccept = function(chatid, chatreqid) {
         $scope.playAudioReject('reject');
         var data = {
             'chatid': chatid,
             'chatreqid': chatreqid
         };
         ChatContent.updateRejectCall(data).then(function(response) {

             if (response) {
                 alert(response)
                 $scope.show_reject = false;

             }


         });

     };
     $scope.editExisting = true;
     $scope.addNew = false;
     $scope.active_grp = 'editExsting';
     $scope.groupSettings = function(trigger){
         $scope.active_grp = $scope.active_grp == trigger ? trigger : trigger;
         if( trigger == 'editExsting'){
             $scope.getGroupData();
             $scope.editExisting = true;
             $scope.addNew = false;
         }

         if( trigger == 'addGroup'){
             $scope.editExisting = false;
             $scope.addNew = true;
         }

     };

     $scope.triggerAlert = function(userchatId,roomName){
       var data = {'chatroomId':roomName,'userChatKey':userchatId}; // chatKey is generated from Twillio
        ChatContent.addUserkeytochat(data).then(function(response) {
         });

     };  

     $scope.removeUser = function(userchatId,roomName){
       var data = {'chatroomId':roomName,'userChatKey':userchatId}; // chatKey is generated from Twillio
        ChatContent.removeUserkeytochat(data).then(function(response) {

         });

     };

     $scope.saveFile = function(filesdata){
         //alert(filesdata);
         var uriContent = "data:application/octet-stream," + encodeURIComponent(filesdata);
         var newWindow = window.open(filesdata);
     }




 }]);
 chatApp.filter('html', function($sce) {
     return function(val) {
         return $sce.trustAsHtml(val);
     }
 });
chatApp.directive('validPasswordC', function() {
  return {
    require: 'ngModel',
    scope: {

      reference: '=validPasswordC'

    },
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue, $scope) {
        var noMatch = viewValue != scope.reference.$viewValue;
        ctrl.$setValidity('noMatch', !noMatch);
        return (noMatch)?noMatch:!noMatch;
      });

      scope.$watch("reference", function(value) {
        ctrl.$setValidity('noMatch', value === ctrl.$viewValue);

      });
    }
  }
});



 chatApp.directive("scrollChat", function() {
     return {
         restrict: "A",
         link: function(scope, element) {
             element.on("click", function() {
                 element.prev(".chats-box").animate({
                     scrollTop: element.prev(".chats-box").prop('scrollHeight')
                 });
             })
         }
     }
 });

 chatApp.directive("scrollTop", function() {
     return {
         restrict: "A",
         link: function(scope, element) {
             element.on("click", function() {
                 angular.element(".chats-box").animate({
                     scrollTop: 0
                 }, "slow");

             })
         }
     }
 });

 chatApp.filter('objLength', function() {
     return function(object) {
         var count = 0;
         for (var i in object) {
             count++;
         }
         return count;
     }
 });

 chatApp.directive('ngConfirmClick', [
     function() {
         return {
             link: function(scope, element, attr) {
                 var msg = attr.ngConfirmClick || "Are you sure?";
                 var clickAction = attr.confirmedClick;
                 element.bind('click', function(event) {
                     if (window.confirm(msg)) {
                         scope.$eval(clickAction)
                     }
                 });
             }
         };
     }
 ])




 chatApp.directive("schrollBottom", function() {
     return {
         scope: {
             schrollBottom: "="
         },
         link: function(e, a) {
             e.$watchCollection("schrollBottom", function(e) {
                 e && $(a).scrollTop($(a)[0].scrollHeight)
             })
         }
     }
 })

 chatApp.directive("scrollChatSend", function() {
     return {
         restrict: "A",
         link: function(scope, element) {
             element.on("click", function() {
                 setTimeout(function() {
                     var chatscroll = element.parent().parent().parent().prev().prev();
                     alert(chatscroll.attr('class'));
                     chatscroll.animate({
                         scrollTop: chatscroll.prop('scrollHeight')
                     });

                 }, 1000);

             })
         }
     }
 });

 chatApp.filter('cut', function() {
     return function(value, wordwise, max, tail) {
         if (!value) return '';

         max = parseInt(max, 10);
         if (!max) return value;
         if (value.length <= max) return value;

         value = value.substr(0, max);
         if (wordwise) {
             var lastspace = value.lastIndexOf(' ');
             if (lastspace !== -1) {
                 //Also remove . and , so its gives a cleaner result.
                 if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                     lastspace = lastspace - 1;
                 }
                 value = value.substr(0, lastspace);
             }
         }

         return value + (tail || ' …');
     };
 });


 chatApp.directive('updatelinks', function($timeout) {
     return {
         link: function(scope, element) {
             $timeout(function() {
                 element.find('a').prop('target', '_blank');
             });
         }
     };
 });

 chatApp.factory('ChatContent', [
     '$q',
     '$http',
     '$location',
     function($q,
         $http,
         $location) {
         return {
             postid: function(params) {

                 var defer = $q.defer();

                 $http.post('/chatapi/getchatinfo', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             postidS: function(params) {

                 var defer = $q.defer();

                 $http.post('/chatapi/getchatinfoS', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             getchatdata: function(params) {

                 var defer = $q.defer();

                 $http.post('/chatapi/getgroupchatinfo', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             getUserCheck: function(params) {

                 var defer = $q.defer();
                 var data = {
                     'email': params
                 }
                 $http.post('/chatapi/userCheck', data).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             addmessage: function(params) {

                 var defer = $q.defer();

                 $http.post('/chatapi/savemessage', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             getCompanyUsers: function(params) {

                 var defer = $q.defer();

                 $http.post('/chatapi/getCompanyUsers', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },

             getCRusers: function() {

                 var defer = $q.defer();

                 $http.post('/chatapi/getCRusers').then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },

             deleteCompanyUsers: function(params) {

                 var defer = $q.defer();

                 $http.post('/chatapi/deleteCompanyUsers', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             getMediaData: function(params) {

                 var defer = $q.defer();

                 $http.post('/chatapi/getMediaData', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             CreateGroupforChat: function(params) {

                 var defer = $q.defer();

                 $http.post('/chatapi/createGroup', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             getGroupListforChat: function(params) {

                 var defer = $q.defer();

                 $http.get('/chatapi/groupchatlist').then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             }, 
             getDataForScreen: function(params) {

                 var defer = $q.defer();

                 $http.get('/chatapi/getDataForScreen').then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             getChatMediaData: function(params) {

                 var defer = $q.defer();

                 $http.post('/mediafiles', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             changecloseout: function(params) {

                 var defer = $q.defer();

                 $http.post('/chatapi/closeout', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             getUserInfo: function(params) {
                 var defer = $q.defer();
                 $http.get('/chatapi/getUserInfo', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             updateUserStatus: function(params) {
                 var defer = $q.defer();
                 $http.post('/chatapi/UpdateUserStatus', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             getCustomerProfile: function(params, chatid) {
                 console.log('params', params);
                 var data = {
                     'ids': params,
                     'chatid': chatid
                 };

                 var defer = $q.defer();

                 $http.post('/custProfile', data).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             deleteMemberUsersId: function(params) {
                 var defer = $q.defer();
                 $http.post('/chatapi/deletememberuid', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             getMemberUid: function(data) {
                 var defer = $q.defer();
                 $http.post('/chatapi/getmemberuid', data).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
             },
             getChatCallerStatus: function(params) {
                 var defer = $q.defer();
                 $http.post('/chatapi/getchatStatus', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             },
             IsUserBusy: function(params) {
                 var defer = $q.defer();
                 $http.post('/chatapi/IsUserBusy', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             },
             initiateChat: function(params) {

                 var defer = $q.defer();
                 $http.post('/chatapi/initiateChat', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             },
             chatReqtrigger: function(params) {

                 var defer = $q.defer();
                 $http.post('/chatapi/chatReqtrigger', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             },
             UpdatechatStatus: function(params) {
                 var defer = $q.defer();
                 $http.post('/chatapi/UpdatechatStatus', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             },
             addUserkeytochat: function(params) {
                 var defer = $q.defer();
                 $http.post('/chatapi/addUserkeytochat', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             },
             removeUserkeytochat: function(params) {
                 var defer = $q.defer();
                 $http.post('/chatapi/removeUserkeytochat', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             },
             updateRejectCall: function(params) {
                 var defer = $q.defer();
                 $http.post('/chatapi/updateRejectCall', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             },
             getCalenderApi: function(params) {
                 var defer = $q.defer();
                 $http.get('/calenderApi', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             },
             getNewToken: function(params) {
                 var defer = $q.defer();
                 $http.post('/getNewToken', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             },
            
              SendMessages: function(params) {
                 var defer = $q.defer();
                 $http.post('/chatapi/SendMessages', params).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             },
                getGroupData: function() {
                 var defer = $q.defer();
                 $http.get('/getGroupData').then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             },

             updatePassword: function(data){
                var defer = $q.defer();
                 $http.post('/users/updatePassword',data).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             }, 
              notificationInfoID: function(data){
                var defer = $q.defer();
                 $http.post('/chatapi/getNotificationForUser',data).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;

             },
             getRequestedUser: function(){
                var defer = $q.defer();
                 $http.post('/users/getRequestedUser').then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });

                 return defer.promise;
                 
             },

             getUserPaymentdata: function(){
             var defer = $q.defer();
             $http.get('/users/paymentList').then(function(response) {
                 defer.resolve(response.data);
             }, function(error) {
                 defer.reject(error);
             }, function(process) {
                 defer.notify(process);
             });

             return defer.promise;

         },
             adduserReq:function(data){
                 var defer = $q.defer();
                 $http.post('/users/adduserReq',data).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });
                 return defer.promise;

             },
            
            userProfileData:function(data){
                var defer = $q.defer();
                 $http.post('/users/userProfileData',data).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });
                 return defer.promise;
             },

            Transferchat:function(data){
                var defer = $q.defer();
                 $http.post('/chatapi/Transferchat',data).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });
                 return defer.promise;
             },
             updateReadMsg: function(data){
                 var defer = $q.defer();
                 $http.post('/chatapi/updateReadMsg',data).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });
                 return defer.promise;

             },
             getNotifications: function(data){
             var defer = $q.defer();
             $http.post('/chatapi/getNotifications').then(function(response) {
                 defer.resolve(response.data);
             }, function(error) {
                 defer.reject(error);
             }, function(process) {
                 defer.notify(process);
             });
             return defer.promise;

         },
         updateNotifications: function(data){
                 var defer = $q.defer();
                 $http.post('/chatapi/updateNotifications',data).then(function(response) {
                     defer.resolve(response.data);
                 }, function(error) {
                     defer.reject(error);
                 }, function(process) {
                     defer.notify(process);
                 });
                 return defer.promise;

         },
         sendmsgDemo: function(data){
             var defer = $q.defer();
             $http.post('/chatapi/sendmsgDemo',data).then(function(response) {
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

 chatApp.controller('adminSettingcontroller', ['$scope', '$rootScope', 'ChatContent', 'ngClipboard', '$sce', '$location', '$window', function($scope, $rootScope, ChatContent, ngClipboard, $sce, $location, $window) {
     $scope.$watch("checkemail", function(newValue, oldValue) {
         ChatContent.getUserCheck(newValue).then(function(response) {
             $scope.emailcheckStatus = response;
         });

     });
 }]);

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


