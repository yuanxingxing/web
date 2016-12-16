var app = angular.module('refreshApp', ['ionic']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('start');
    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: 'tpl/main.html',
            controller: 'mainCtrl'
        })
        .state('list', {
            url: '/list/:typeNum',
            templateUrl: 'tpl/list.html',
            controller: 'listCtrl'
        })
        .state('detail', {
            url: '/detail',
            templateUrl: 'tpl/detail.html',
            controller: 'detailCtrl'
        })
        .state('start', {
            url: '/start',
            templateUrl: 'tpl/start.html',
            controller: 'startCtrl'
        })
        .state('search', {
            url: '/search',
            templateUrl: 'tpl/search.html',
            controller: 'searchCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'tpl/login.html',
            controller: 'loginCtrl'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'tpl/register.html',
            controller: 'registerCtrl'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'tpl/about.html',
            controller: 'aboutCtrl'
        })
})
//控制器
app.controller('parentCtrl', ['$scope', '$ionicModal', '$state', function ($scope, $ionicModal, $state) {
    //定义弹框
    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-right'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    //实现弹出
    //$scope.search = function(){
    //  $scope.modal.show();
    //};
    //实现跳转的方法
    $scope.jump = function (pageUrl) {
        $state.go(pageUrl);
    }
    $scope.goHistory = function (page) {
        history.go(page);
    }
}]);
app.controller('mainCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    //定义轮播的图片
    $scope.imageArray = ['images/banner_01.jpg', 'images/banner_02.jpg', 'images/banner_03.jpg', 'images/banner_04.jpg'];

    $scope.hasMore = true;
    $scope.pageNum = 1;
    //获取初始的新闻数据
    $http.get('data/news.php?pageNum=' + $scope.pageNum)
        .success(
        function (result) {
            $scope.newsData = result.data;
            $scope.pageNum++;
        }
    );
    //加载更多
    $scope.loadMore = function () {
        $timeout(function () {
            $http.get('data/news.php?pageNum=' + $scope.pageNum)
                .success(function (result) {
                    if (result.data.length < 5)
                        $scope.hasMore = false;
                    $scope.newsData = $scope.newsData.concat(result.data);
                    $scope.pageNum++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }, 2000);
    };
}]);
app.controller('listCtrl', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
    //调用服务器，取到数据实现初始显示---注意获取路由中的参数
    $http.get('data/product_select.php?pageNum=1&type=' + $stateParams.typeNum)
        .success(function (result) {
            $scope.productData = result.data;
        });
}]);
app.controller('detailCtrl', function () {

})
app.controller('searchCtrl', function () {

})
app.controller('loginCtrl', function () {

})
app.controller('registerCtrl', ['$scope', '$http', '$httpParamSerializerJQLike', function ($scope, $http, $httpParamSerializerJQLike) {

    $scope.inputTxt = {};
    $scope.isExist = '';
    $scope.isLogin = '';
    var data = $httpParamSerializerJQLike($scope.inputTxt);
    //单击注册时的验证
    $scope.regist = function () {
        var uname = $scope.nameCheck();
        var phone = $scope.phoneCheck();
        console.log(uname);
        console.log(phone);
        if (uname && phone) {
            $http.get('data/user_register.php?' + data).success(function (res) {
                if (res.code == 1) {
                    sessionStorage.uid = res.uid;
                    $scope.isLogin = true;
                }
                else {
                    alert('注册失败，请重新注册')
                }
            });
        }
    };

    //input失去焦点验证
    $scope.testName = function () {
        $scope.nameCheck();
    };
    $scope.testPhone = function () {
        $scope.phoneCheck();
    }
    //用户名验证
    $scope.nameCheck=function(){
        var dark='';
        $http.get('data/user_check_uname.php?uname=' + $scope.inputTxt.uname)
            .success(function (res) {
                if (res.msg == 'exist') {
                    $scope.isExist = true;
                    $scope.isLogin = false;
                    dark= false;
                } else if (res.msg == 'non-exist') {
                    $scope.isExist = false;
                    console.log(res.msg);
                    dark=true;
                }
            });
        return dark;
    };
    //手机号验证
    $scope.phoneCheck = function () {
        var dark='';
        //验证手机号格式是否正确
        var regPhone = /^(13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
        var result = regPhone.test($scope.inputTxt.phone);
        if (result) {
            //格式正确，判断是否存在
            $http.get('data/user_check_phone.php?phone=' + $scope.inputTxt.phone)
                .success(function (res) {
                    console.log(res);
                    if (res.msg == 'exist') {
                        $scope.isExist = true;
                        $scope.isLogin = false;
                        dark= false;
                    } else if (res.msg == 'non-exist') {
                        $scope.isExist = false;
                        dark=true;
                    }

                })
            return dark;
        } else {
            //格式不正确，提示格式不正确
            alert('手机号格式不正确')
        }
    }


}]);


app.controller('aboutCtrl', function () {

})

    .controller('startCtrl', function ($scope, $timeout, $state, $interval) {
        $scope.seconds = 5;
        $timeout(function () {
            $state.go('main');
        }, 10000);

        $interval(function () {
            if ($scope.seconds > 0)
                $scope.seconds--;
        }, 1000);
        /**/

    })

