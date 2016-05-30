angular.module('conFusion.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {

    $scope.registration = {};
    
    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
    
    
    $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
         $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });

            $scope.registerform.show();

        };
        
        var imagePickerOptions = {
           maximumImagesCount: 1,
           width: 100,
           height: 100,
           quality: 50
        };

        $scope.openGallery = function() {
            $cordovaImagePicker.getPictures(imagePickerOptions).then(function (results) {
                if(results.length > 0)
                    $scope.registration.imgSrc = results[0];
            }, function(error) {
                console.log(err);
            });

            $scope.registerform.show();
        }
        
    });
    
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.reservation = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo',$scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
    
    // Create the reservation modal
    $ionicModal.fromTemplateUrl('templates/reserve.html', { scope: $scope })
        .then(function(modal) {
        $scope.reserveform = modal;
    });
    
    // Closses the reservation modal
    $scope.closeReserve = function() {
        $scope.reserveform.hide();
    };
    
    // Open the reservation modal
    $scope.reserve = function() {
        $scope.reserveform.show();
    };
    
    //Perform the reservation action when the user submits the reservation form
    $scope.doReserve = function() {
        console.log('Doing Reservation', $scope.reservation);
        
        //simulate a server delay. remove before production
        $timeout(function() {
            $scope.closeReserve();
        }, 1000);
        };    
    
})

    .controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
            
            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            
            $scope.dishes = dishes;

                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
     
            
            $scope.addFavorite = function (index) {
                console.log("index is " + index);
                favoriteFactory.addToFavorites(index);
                $ionicListDelegate.closeOptionButtons();
                
                $ionicPlatform.ready(function () {
                    $cordovaLocalNotification.schedule({
                        id: 1,
                        title: "Added Favorite",
                        text: $scope.dishes[index].name
                    }).then(function () {
                        console.log('Added Favorite '+$scope.dishes[index].name);
                    },
                    function () {
                        console.log('Failed to add Notification ');
                    });

                    $cordovaToast
                      .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
                      .then(function (success) {
                          // success
                      }, function (error) {
                          // error
                  });
        });
                
                
            }
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            }; 
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
            
            $scope.baseURL = baseURL;
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message="Loading ...";
            
            
            $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
                scope: $scope
            }).then(function(popover) {
                $scope.dishDetailPopover = popover;
            });
            
            $scope.dish = dish;

                        
            $scope.addFavorite = function (index) {
                console.log("index is " + index);
                favoriteFactory.addToFavorites(index);
                $scope.dishDetailPopover.hide();
                
                $ionicPlatform.ready(function () {
                    $cordovaLocalNotification.schedule({
                        id: 1,
                        title: "Added Favorite",
                        text: $scope.dish.name
                    }).then(function () {
                        console.log('Added Favorite '+$scope.dish.name);
                    },
                    function () {
                        console.log('Failed to add Notification ');
            });

            $cordovaToast
              .show('Added Favorite '+$scope.dish.name, 'long', 'bottom')
              .then(function (success) {
                  // success
              }, function (error) {
                  // error
              });
        });
                
            };
            
              // Form data for the comment modal
              $scope.commentData = {};

              // Create the comment modal
              $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
                scope: $scope
              }).then(function(modal) {
                $scope.commentModal = modal;
              });

              // Triggered in the comment modal to close it
              $scope.closeCommentModal = function() {
                $scope.commentModal.hide();
              };

              // Open the login modal
              $scope.openCommentModal = function() {
                $scope.dishDetailPopover.hide();
                $scope.commentModal.show();
              };

              // Perform the login action when the user submits the login form
              $scope.doComment = function() {
                
                 
                $scope.commentData.date = new Date().toISOString();  
                console.log('Doing Comment', $scope.commentData);
                
                $scope.dish.comments.push($scope.commentData);
                  menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                //$scope.commentForm.$setPristine();
                
                //$scope.mycomment = {rating:5, comment:"", author:"", date:""};

                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                $timeout(function() {
                  $scope.closeCommentModal();
                }, 1000);
              };
            
                 
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.dish.comments.push($scope.mycomment);
        menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                
                $scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])

        // implement the IndexController and About Controller here

        .controller('IndexController', ['$scope', 'baseURL', 'dish', 'promotion', 'leader', function($scope, baseURL, dish, promotion, leader) {
                        
                        $scope.baseURL = baseURL;         
                        $scope.leader =leader;
                        $scope.showDish = false;
                        $scope.message="Loading ...";
                        $scope.dish = dish;

                        $scope.promotion =promotion;
            
                    }])

        .controller('AboutController', ['$scope', 'leaders', 'baseURL', function($scope, leaders, baseURL) {
            
                    $scope.baseURL = baseURL;
                    $scope.leaders = leaders;
                    console.log($scope.leaders);
            
                    }])

        .controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicPlatform', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$cordovaVibration', '$timeout', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicPlatform, $ionicListDelegate, $ionicPopup, $ionicLoading, $cordovaVibration, $timeout) {
            
            $scope.baseURL = baseURL;
            $scope.shouldShowDelete = false;

            $scope.favorites = favorites;
            $scope.dishes = dishes;
    
            console.log($scope.dishes, $scope.favorites);

            $scope.toggleDelete = function () {
                $scope.shouldShowDelete = !$scope.shouldShowDelete;
                console.log($scope.shouldShowDelete);
            }

            $scope.deleteFavorite = function (index) {
                
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirm Delete',
                    template: 'Are you sure you want to delete this favorite?'
                });
                
                confirmPopup.then(function(res) {
                    if (res) {
                        console.log('OK TO DELETE');
                        favoriteFactory.deleteFromFavorites(index);
                        $ionicPlatform.ready(function() {
                            $cordovaVibration.vibrate(100);
                        });
                    }
                })
                $scope.shouldShowDelete = false;
            }
        }])

        .filter('favoriteFilter', function () {
             return function (dishes, favorites) {
                var out = [];
                for (var i = 0; i < favorites.length; i++) {
                    for (var j = 0; j < dishes.length; j++) {
                        if (dishes[j].id === favorites[i].id)
                            out.push(dishes[j]);
                    }
                }
                return out;

    }});
