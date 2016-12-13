/**
 * Created by bjwsl-001 on 2016/12/6.
 */
angular.module('refreshApp',['ionic'])
  .config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('main');
    $stateProvider
      .state('main',{
          url:'/main',
          templateUrl:'tpl/main.html',
          controller:'mainCtrl'
      })
      .state('list',{
        url:'/list/:typeNum',
        templateUrl:'tpl/list.html',
        controller:'listCtrl'
      })
      .state('detail',{
        url:'/detail',
        templateUrl:'tpl/detail.html',
        controller:'detailCtrl'
      })
      .state('start',{
        url:'/start',
        templateUrl:'tpl/start.html',
        controller:'startCtrl'
      })
  })
  .controller('parentCtrl',function($scope,$ionicModal,$state){
    //定义弹框
    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    //实现弹出
    $scope.search = function(){
      $scope.modal.show();
    };

    //实现跳转的方法
    $scope.jump = function(pageUrl){
      $state.go(pageUrl);
    }
  })
  .controller('mainCtrl',function($scope,$http,$timeout){
    //定义轮播的图片
    $scope.imageArray = ['images/banner_01.jpg','images/banner_02.jpg','images/banner_03.jpg','images/banner_04.jpg'];

    $scope.hasMore = true;
    $scope.pageNum = 1;
    //获取初始的新闻数据
    $http.get('data/news.php?pageNum='+$scope.pageNum)
      .success(
        function(result){
          $scope.newsData = result.data;
          $scope.pageNum++;
        }
    );
    //加载更多
    $scope.loadMore =function(){
      $timeout(function(){
        $http.get('data/news.php?pageNum='+$scope.pageNum)
          .success(function(result){
            if(result.data.length < 5)
              $scope.hasMore = false
            $scope.newsData = $scope.newsData.concat(result.data);
            $scope.pageNum++;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
      },2000);
    };
  })
  .controller('listCtrl',function($scope,$http,$stateParams){
    //调用服务器，取到数据实现初始显示---注意获取路由中的参数
    $http.get('data/product_select.php?pageNum=1&type=' + $stateParams.typeNum)
      .success(function(result){
        $scope.productData = result.data;
      });
  })
  .controller('detailCtrl',function(){

  })
  .controller('startCtrl',function($scope,$timeout,$state,$interval){
      $scope.seconds = 5;
      $timeout(function(){
        $state.go('main');
      },5000);

      $interval(function(){
        if($scope.seconds > 0)
            $scope.seconds--;
      },1000);
  })
