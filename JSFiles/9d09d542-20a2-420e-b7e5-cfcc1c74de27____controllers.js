(function() {
    'use strict';
    angular.module('bbs.controllers', [])
        .controller('mainController', ['$scope', '$location', '$route', '$window', 'userManager', 'user', function($scope, $location, $route, $window, userManager, user) {
            $scope.showHeader = false;
            $scope.user = user;
            $scope.currentPath = '';
            $scope.$on('$routeChangeSuccess', function(e) {
                $scope.currentPath = $location.path();
            })
            $scope.setHighlight = function(paths) {
                var pathArr = paths.split(',');
                var currentPath = $location.path();
                var isHighlight;
                pathArr.forEach(function(val, index, arr) {
                    if (currentPath.indexOf(arr[index]) != -1) {
                        isHighlight = true;
                    }
                });
                return isHighlight;
            };
            $window.document.title = '论坛';
        }])
        .controller('bbsIndexController', ['$scope', '$timeout', '$location', '$window', 'globalPagination', 'globalFunction', 'modalExtension', 'articleApi',
            function($scope, $timeout, $location, $window, globalPagination, globalFunction, modalExtension, articleApi) {

                // article list
                $timeout(function() {
                    $scope.$parent.showHeader = true;
                }, 0);

                //初始化列表數據
                $scope.pagination = globalPagination.create();
                $scope.pagination.resource = articleApi;
                $scope.pagination.sort = 'is_top,sort DESC';
                $scope.select = function(page) {
                    $scope.pagination.select(page, {}, { coteries: {}, user: {} }).$promise.then(function(data) {
                        $scope.bbsArticleList = _.union($scope.bbsArticleList, data);
                    });
                };
                $scope.search = function() {
                    $scope.bbsArticleList = [];
                    $scope.select(1);
                }

                $scope.setStatus = function(status) {
                    $scope.condition.status = status;
                    $scope.search();
                }

                $scope.bottomReached = globalFunction.debounce(function() {
                    if (!$scope.pagination.isLast()) {
                        $scope.select($scope.pagination.page + 1);
                    } else {
                        modalExtension.tips('没有更多内容');
                    }
                }, 20);
                $scope.search();

                // search
                $scope.isShow = false;
                $scope.init = function() {
                    $scope.isShow = false;
                    $('#searchFiled').val($scope.defaultKeyword);
                };
                $scope.searchFn = function(keyword) {
                    if (!keyword) {
                        modalExtension.tips('请输入搜索的内容');
                        $('#searchFiled').focus();
                    } else {
                        $location.path('/search-result/' + keyword);
                    }
                };

                $window.document.title = '论坛';
            }
        ])
        .controller('personalCenterController', ['$scope', '$window', 'personalCenterApi', 'scoreTotalApi', function($scope, $window, personalCenterApi, scoreTotalApi) {
            personalCenterApi.get().$promise.then(function(data) {
                $scope.userData = data;
            });

            // score total
            scoreTotalApi.get().$promise.then(function(data) {
                $scope.scoreTotal = data;
                console.log(data);
            });

            $window.document.title = '个人中心';
        }])
        .controller('scoreDetailController', ['$scope', '$window', 'personalCenterApi', 'scoreTotalApi', 'scoreListApi', function($scope, $window, personalCenterApi, scoreTotalApi, scoreListApi) {
            personalCenterApi.get().$promise.then(function(data) {
                $scope.userData = data;
            });
            // score rule
            $scope.showPopup = false;
            $scope.showRule = function() {
                $scope.showPopup = true;
            };

            // score total
            scoreTotalApi.get().$promise.then(function(data) {
                $scope.scoreTotal = data;
                console.log(data);
            });

            // score list
            scoreListApi.query().$promise.then(function(data) {
                $scope.scoreList = data;
            });

            $window.document.title = '积分详情';
        }])
        .controller('circleController', ['$scope', '$location', '$window', 'globalFunction', 'modalExtension', 'myCircleApi', 'notJoinedCircleApi', 'userApi',
            function($scope, $location, $window, globalFunction, modalExtension, myCircleApi, notJoinedCircleApi, userApi) {
                // circle category
                myCircleApi.query().$promise.then(function(data) {
                    var isJoined = false;
                    if (data.length > 0) {
                        isJoined = true;
                    }
                    /*angular.forEach($scope.categoryList, function(item) {
                        item.status = false;
                        if (item.user) {
                           isJoined = true; 
                        }
                    });*/


                    if (isJoined) {
                        $location.path('/circle-index');
                    } else {
                        $location.path('/circle');
                    }
                });
                notJoinedCircleApi.query().$promise.then(function(data) {
                    $scope.categoryList = data;

                    angular.forEach($scope.categoryList, function(item) {
                        item.status = false;
                    });
                });

                // join circle
                $scope.join = function(category) {
                    var params = {
                        coterie_id: category.id
                    }
                    userApi.save(params).$promise.then(function() {
                        modalExtension.tips('圈子加入成功');
                        angular.forEach($scope.categoryList, function(item) {
                            if (category.id == item.id) {
                                category.status = true;
                            }
                        });
                    });
                };

                $window.document.title = '圈子首页';
            }
        ])
        .controller('circleIndexController', ['$scope', '$timeout', '$location', '$window', 'globalFunction', 'globalPagination', 'modalExtension', 'myCircleApi', 'circleArticleApi',
            function($scope, $timeout, $location, $window, globalFunction, globalPagination, modalExtension, myCircleApi, circleArticleApi) {

                // search
                $scope.isShow = false;
                $scope.init = function() {
                    $scope.isShow = false;
                    $('#searchFiled').val($scope.defaultKeyword);
                };
                $scope.searchFn = function(keyword) {
                    if (!keyword) {
                        modalExtension.tips('请输入搜索的内容');
                        $('#searchFiled').focus();
                    } else {
                        $location.path('/search-result/' + keyword);
                    }
                };

                // joined circle
                myCircleApi.query().$promise.then(function(data) {
                    $scope.circlesJoined = data;
                });

                // article list
                $timeout(function() {
                    $scope.$parent.showHeader = true;
                }, 0);
                $scope.condition = {};
                //初始化列表數據
                $scope.pagination = globalPagination.create();
                $scope.pagination.resource = circleArticleApi;
                $scope.select = function(page) {
                    $scope.pagination.select(page, $scope.condition, { coteries: { user: '' }, user: {} }).$promise.then(function(data) {
                        $scope.circleArticleList = _.union($scope.circleArticleList, data);
                    });
                };
                $scope.search = function() {
                    $scope.circleArticleList = [];
                    $scope.select(1);
                }

                $scope.setStatus = function(status) {
                    $scope.condition.status = status;
                    $scope.search();
                }

                $scope.bottomReached = globalFunction.debounce(function() {
                    if (!$scope.pagination.isLast()) {
                        $scope.select($scope.pagination.page + 1)
                    } else {
                        modalExtension.tips('没有更多内容');
                    }
                }, 20);
                $scope.search();

                // article filter
                $scope.setFilter = function(circleId, index) {
                    $scope.circleIndex = index;
                    $scope.condition['coterie_id'] = circleId;
                    $scope.search();
                };

                // circle rejoin
                $scope.rejoin = function() {
                    $location.path('/circle-rejoin');
                };

                $window.document.title = '圈子首页';
            }
        ])
        .controller('circleRejoinController', ['$scope', '$route', '$location', '$window', 'globalFunction', 'modalExtension', 'myCircleApi', 'notJoinedCircleApi', 'userApi',
            function($scope, $route, $location, $window, globalFunction, modalExtension, myCircleApi, notJoinedCircleApi, userApi) {
                // joined circle
                myCircleApi.query(globalFunction.generateUrlParams({}, { myCoterie: {} })).$promise.then(function(data) {
                    $scope.joinedList = data;
                    angular.forEach($scope.joinedList, function(item) {
                        item.status = true;
                    });
                });

                // not joined circle
                notJoinedCircleApi.query().$promise.then(function(data) {
                    $scope.notJoinedList = data;
                    angular.forEach($scope.notJoinedList, function(item) {
                        item.status = false;
                    });
                });
                // join circle
                $scope.join = function(category) {
                    var params = {
                        coterie_id: category.id
                    };
                    userApi.save(params).$promise.then(function() {
                        modalExtension.tips('圈子加入成功');
                        angular.forEach($scope.notJoinedList, function(item) {
                            if (category.id == item.id) {
                                category.status = true;
                            }
                        });
                        $route.reload();
                    });
                };

                // exit circle
                $scope.exit = function(category) {
                    var params = {
                        coterie_id: category.id
                    };
                    userApi.delete(category.myCoterie).$promise.then(function() {
                        modalExtension.tips('圈子退出成功');
                        angular.forEach($scope.joinedList, function(item) {
                            if (category.id == item.id) {
                                category.status = false;
                            }
                        });
                        $route.reload();
                    });
                };
            }
        ])
        .controller('articleDetailController', ['$scope', '$timeout', '$location', '$window', '$routeParams', 'globalFunction', 'globalPagination', 'modalExtension', 'articleApi', 'commentReplyApi', 'commentAddApi', 'flowApi', 'commentFlowApi', 'weChat', 'globalConfig',
            function($scope, $timeout, $location, $window, $routeParams, globalFunction, globalPagination, modalExtension, articleApi, commentReplyApi, commentAddApi, flowApi, commentFlowApi, weChat, globalConfig) {
                // article info
                articleApi.get(globalFunction.generateUrlParams({ id: $routeParams.id }, { coteries: {} })).$promise.then(function(data) {
                    $scope.articleData = data;
                    // console.log($location.$$absUrl.split('#')[0]);
                    var image;
                    if (!data.image)
                        image = data.author ? data.author.avatar : $location.$$absUrl.split('#')[0] + 'images/avatar_anonymous.jpg';
                    else
                        image = globalConfig.url + data.image;
                    weChat.onMenuShareTimeline({
                        title: data.title, // 分享标题
                        link: '', // 分享链接
                        desc: data.description, // 分享描述
                        imgUrl: image, // 分享图标
                    });
                    weChat.onMenuShareAppMessage({
                        title: data.title, // 分享标题
                        desc: data.description, // 分享描述
                        link: '', // 分享链接
                        imgUrl: image, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function() {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                });


                // article actions
                $scope.articleCollectFn = function(articleId) {
                    var params = {
                        id: articleId,
                        type: 1
                    };
                    flowApi.update(params).$promise.then(function(data) {
                        if (data.status == 1) { // status => 1(收藏成功) 2(已收藏)
                            modalExtension.tips('收藏成功');
                            $scope.articleData.collect_count++;
                        } else if (data.status == 2) {
                            modalExtension.tips('已收藏');
                        }
                    });
                };

                $scope.articleLikedFn = function(articleId) {
                    var params = {
                        id: articleId,
                        type: 2
                    };
                    flowApi.update(params).$promise.then(function(data) {
                        if (data.status == 1) { // status => 1(点赞成功) 2(已点赞)
                            modalExtension.tips('点赞成功,奖励1积分');
                            $scope.articleData.admire_count++;
                        } else if (data.status == 2) {
                            modalExtension.tips('已点赞');
                        }
                    });
                };

                // comment list
                $timeout(function() {
                    $scope.$parent.showHeader = true;
                }, 0);
                $scope.condition = {
                    'article_id': $routeParams.id
                };
                //初始化列表數據
                $scope.pagination = globalPagination.create();
                $scope.pagination.resource = commentReplyApi;
                $scope.select = function(page) {
                    $scope.pagination.select(page, $scope.condition, { flow: {} }).$promise.then(function(data) {
                        $scope.commentList = _.union($scope.commentList, data);
                    });
                };
                $scope.search = function() {
                    $scope.commentList = [];
                    $scope.select(1);
                }

                $scope.setStatus = function(status) {
                    $scope.condition.status = status;
                    $scope.search();
                }
                $scope.bottomReached = globalFunction.debounce(function() {
                    if (!$scope.pagination.isLast()) {
                        $scope.select($scope.pagination.page + 1)
                    } else {
                        modalExtension.tips('没有更多内容');
                    }
                }, 20);
                $scope.search();

                // comment like
                $scope.commentLikedFn = function(commentId) {
                    var params = {
                        id: commentId,
                        type: 3
                    };
                    commentFlowApi.save(params).$promise.then(function(data) {
                        console.log(data);
                        if (data.status == 1) { // status => 1(点赞成功) 2(已点赞)
                            modalExtension.tips('点赞成功,奖励1积分');
                            angular.forEach($scope.commentList, function(item) {
                                if (item.id == params.id) {
                                    item.admire_count++;
                                    item.flow = { type: 3 };
                                }
                            });
                        } else if (data.status == 2) {
                            modalExtension.tips('已点赞');
                        }
                    });
                };

                // add comment
                $scope.commentSubmitFn = function(inputVal) {
                    if (inputVal == undefined || inputVal == '') {
                        modalExtension.alert('请添加评论内容').then(function() {
                            $('#commentField').focus();
                        })
                    } else {
                        var params = {
                            article_id: $routeParams.id,
                            comment: inputVal
                        }
                        commentAddApi.save(params).$promise.then(function(data) {
                            modalExtension.tips('评论成功,奖励1积分');
                            $scope.commentContent = '';
                            $scope.search();
                            /*modalExtension.alert('评论成功,奖励1积分', '查看其他帖子').then(function(){
                                $scope.search();
                                $scope.commentContent = '';
                                $location.path('/index');
                            });*/
                        });
                    }
                };

                $window.document.title = '文章详情';
            }
        ])
        .controller('myPostController', ['$scope', '$location', '$window', '$timeout', 'globalFunction', 'globalPagination', 'modalExtension', 'myPostApi', 'postDelApi',
            function($scope, $location, $window, $timeout, globalFunction, globalPagination, modalExtension, myPostApi, postDelApi) {
                // post list
                $timeout(function() {
                    $scope.$parent.showHeader = true;
                }, 0);
                //初始化列表數據
                $scope.pagination = globalPagination.create();
                $scope.pagination.resource = myPostApi;
                $scope.select = function(page) {
                    $scope.pagination.select(page).$promise.then(function(data) {
                        $scope.postList = _.union($scope.postList, data);
                    });
                };
                $scope.search = function() {
                    $scope.postList = [];
                    $scope.select(1);
                }

                $scope.setStatus = function(status) {
                    $scope.condition.status = status;
                    $scope.search();
                }

                $scope.bottomReached = globalFunction.debounce(function() {
                    if (!$scope.pagination.isLast()) {
                        $scope.select($scope.pagination.page + 1)
                    } else {
                        modalExtension.tips('没有更多内容');
                    }
                }, 20);
                $scope.search();

                // operation
                $scope.postDel = function(post) {
                    var params = {
                        channel: 'bbs',
                        id: post.id,
                        do: 'del'
                    };
                    postDelApi.save(params).$promise.then(function() {
                        modalExtension.tips('帖子删除成功');
                        $scope.search();
                    });
                };

                $window.document.title = '我的发帖';
            }
        ])
        .controller('myReplyController', ['$scope', '$location', '$window', '$timeout', 'globalFunction', 'globalPagination', 'modalExtension', 'replyApi',
            function($scope, $location, $window, $timeout, globalFunction, globalPagination, modalExtension, replyApi) {
                // reply list
                $timeout(function() {
                    $scope.$parent.showHeader = true;
                }, 0);
                //初始化列表數據
                $scope.pagination = globalPagination.create();
                $scope.pagination.resource = replyApi;
                $scope.select = function(page) {
                    $scope.pagination.select(page, {}, { article: {} }).$promise.then(function(data) {
                        $scope.replyList = _.union($scope.replyList, data);
                    });
                };
                $scope.search = function() {
                    $scope.replyList = [];
                    $scope.select(1);
                }

                $scope.setStatus = function(status) {
                    $scope.condition.status = status;
                    $scope.search();
                }

                $scope.bottomReached = globalFunction.debounce(function() {
                    if (!$scope.pagination.isLast()) {
                        $scope.select($scope.pagination.page + 1)
                    } else {
                        modalExtension.tips('没有更多内容');
                    }
                }, 20);
                $scope.search();

                $window.document.title = '我的回帖';
            }
        ])
        .controller('myCollectController', ['$scope', '$location', '$window', '$timeout', 'globalFunction', 'globalPagination', 'modalExtension', 'collectApi',
            function($scope, $location, $window, $timeout, globalFunction, globalPagination, modalExtension, collectApi) {
                // collect list
                $timeout(function() {
                    $scope.$parent.showHeader = true;
                }, 0);
                $scope.condition = {
                    type: 1
                };
                //初始化列表數據
                $scope.pagination = globalPagination.create();
                $scope.pagination.resource = collectApi;
                $scope.select = function(page) {
                    $scope.pagination.select(page, $scope.condition, { article: {} }).$promise.then(function(data) {
                        $scope.collectList = _.union($scope.collectList, data);
                    });
                };
                $scope.search = function() {
                    $scope.collectList = [];
                    $scope.select(1);
                }

                $scope.setStatus = function(status) {
                    $scope.condition.status = status;
                    $scope.search();
                }

                $scope.bottomReached = globalFunction.debounce(function() {
                    if (!$scope.pagination.isLast()) {
                        $scope.select($scope.pagination.page + 1)
                    } else {
                        modalExtension.tips('没有更多内容');
                    }
                }, 20);
                $scope.search();

                $window.document.title = '我的收藏';
            }
        ])
        .controller('myCircleController', ['$scope', '$route', '$window', 'globalFunction', 'modalExtension', 'myCircleApi', 'userApi', function($scope, $route, $window, globalFunction, modalExtension, myCircleApi, userApi) {
            // joined circle
            myCircleApi.query(globalFunction.generateUrlParams({}, { myCoterie: {} })).$promise.then(function(data) {
                $scope.joinedList = data;
                angular.forEach($scope.joinedList, function(item) {
                    item.status = true;
                });
            });

            // exit circle
            $scope.exit = function(category) {
                var params = {
                    coterie_id: category.id
                };
                userApi.delete(category.myCoterie).$promise.then(function() {
                    modalExtension.tips('圈子退出成功');
                    angular.forEach($scope.joinedList, function(item) {
                        if (category.id == item.id) {
                            category.status = false;
                        }
                    });
                    $route.reload();
                });
            };
            $window.document.title = '我加入的圈子';
        }])
        .controller('postController', ['$scope', '$location', '$window', 'globalFunction', 'modalExtension', 'categaryApi', 'articleApi',
            function($scope, $location, $window, globalFunction, modalExtension, categaryApi, articleApi) {
                // pic crop
                $scope.hasCropImg = false;

                // circle list
                categaryApi.query(globalFunction.generateUrlParams({ sort: 'sort DESC' })).$promise.then(function(data) {
                    $scope.circleList = data;
                    angular.forEach($scope.circleList, function(item) {
                        item.isCurrent = false;
                    });
                });
                $scope.hasSelectCircle = false;
                $scope.selectCircleFn = function(circleId) {
                    angular.forEach($scope.circleList, function(item) {
                        item.isCurrent = false;
                        if (item.id == circleId) {
                            item.isCurrent = true;
                            $scope.hasSelectCircle = true;
                        }
                    });
                }

                // form validate
                $scope.save = function() {
                    if ($scope.postForm.postTitle.$invalid) {
                        $scope.showErrorTitle = true;
                    } else {
                        $scope.showErrorTitle = false;
                        if ($('#target').val() == '') {
                            $scope.showErrorContent = true;
                        } else {
                            $scope.showErrorContent = false;
                            if (!$scope.hasSelectCircle) {
                                $scope.showErrorSelectCircle = true;
                            } else {
                                $scope.showErrorSelectCircle = false;
                            }
                        }
                    }

                    if ($scope.postForm.$valid && $scope.hasSelectCircle) {
                        var postThumb = $('.crop-img img').attr('src'),
                            postCircleId = $('.click-on').attr('data-circle-id'),
                            postContent = $('#target').val();
                        var postObj = {
                            image: postThumb || '',
                            coterie_id: postCircleId,
                            title: $scope.postTitle,
                            content: postContent,
                            is_anonymity: $scope.postAnonymous || 0
                        };
                        console.log(postObj);
                        articleApi.save(postObj).$promise.then(function(data) {
                            modalExtension.alert('发帖成功,奖励5积分', '查看发表的帖子').then(function() {
                                $location.path('/article-detail/' + 　data.id);
                            })
                        });
                    }

                };
                $window.document.title = '我要发帖';
            }
        ])
        .controller('postEditController', ['$scope', '$location', '$window', '$routeParams', 'globalFunction', 'modalExtension', 'categaryApi', 'articleApi',
            function($scope, $location, $window, $routeParams, globalFunction, modalExtension, categaryApi, articleApi) {
                // circle list
                categaryApi.query(globalFunction.generateUrlParams({ sort: 'sort DESC' })).$promise.then(function(data) {
                    $scope.circleList = data;
                    angular.forEach($scope.circleList, function(item) {
                        item.isCurrent = false;
                    });
                });

                // post info
                articleApi.get(globalFunction.generateUrlParams({ id: $routeParams.postId }, { coteries: {}, user: {} })).$promise.then(function(data) {
                    $scope.postTitle = data.title;
                    $('#content').html(data.content);
                    angular.forEach($scope.circleList, function(item) {
                        if (item.id == data.coteries.coterie_id) {
                            item.isCurrent = true;
                        }
                    });
                    $scope.isAnonymous = data.is_anonymity == 1 ? true : false;
                    $scope.hasCropImg = data.image != '' ? true : false;
                    if (data.image != '') {
                        $scope.thumbPic = data.image;
                    }
                });
                $scope.hasSelectCircle = true;
                $scope.selectCircleFn = function(circleId) {
                    angular.forEach($scope.circleList, function(item) {
                        item.isCurrent = false;
                        if (item.id == circleId) {
                            item.isCurrent = true;
                            $scope.hasSelectCircle = true;
                        }
                    });
                };
                // form validate
                $scope.save = function() {
                    if ($scope.postForm.postTitle.$invalid) {
                        $scope.showErrorTitle = true;
                    } else {
                        $scope.showErrorTitle = false;
                        if ($('#content').html() == '') {
                            $scope.showErrorContent = true;
                        } else {
                            $scope.showErrorContent = false;
                            if (!$scope.hasSelectCircle) {
                                $scope.showErrorSelectCircle = true;
                            } else {
                                $scope.showErrorSelectCircle = false;
                            }
                        }
                    }

                    if ($scope.postForm.$valid && $scope.hasSelectCircle) {
                        var postThumb = $('.crop-img img').attr('src'),
                            postCircleId = $('.click-on').attr('data-circle-id'),
                            postContent = $('#content').html();
                        var postObj = {
                            image: postThumb || '',
                            coterie_id: postCircleId,
                            title: $scope.postTitle,
                            content: postContent,
                            is_anonymity: $scope.postAnonymous || 0
                        };
                        console.log(postObj);
                        articleApi.update({ id: $routeParams.postId }, postObj).$promise.then(function(data) {
                            modalExtension.alert('更新成功', '查看发表的帖子').then(function() {
                                $location.path('/article-detail/' + 　data.id);
                            })
                        });
                    }

                };

                $window.document.title = '编辑帖子';
            }
        ])
        .controller('searchController', ['$scope', '$window', '$routeParams', '$timeout', '$route', 'globalPagination', 'globalFunction', 'modalExtension', 'articleApi', 'conditionTypes',
            function($scope, $window, $routeParams, $timeout, $route, globalPagination, globalFunction, modalExtension, articleApi, conditionTypes) {

                // console.log($routeParams.keyword);

                // article list
                $timeout(function() {
                    $scope.$parent.showHeader = true;
                }, 0);
                $scope.article = {
                        name: $routeParams.keyword
                    }
                    //初始化列表數據
                $scope.pagination = globalPagination.create();
                $scope.pagination.resource = articleApi;
                $scope.pagination.sort = 'is_top,sort DESC';
                $scope.select = function(page) {
                    $scope.pagination.select(page, $scope.condition_copy, { coteries: {}, user: {} }).$promise.then(function(data) {
                        $scope.isDataNull = (data.length == 0) ? true : false;
                        $scope.articleList = _.union($scope.articleList, data);
                    });
                };
                $scope.search = function() {
                    $scope.condition = {
                        title: { type: conditionTypes.like, value: $scope.article.name }
                    };
                    $scope.condition_copy = angular.copy($scope.condition);
                    $scope.articleList = [];
                    $scope.select(1);
                }

                $scope.setStatus = function(status) {
                    $scope.condition.status = status;
                    $scope.search();
                }

                $scope.setFilter = function(typeId) {
                    $scope.condition.type_id = typeId;
                    $scope.search();
                }

                $scope.bottomReached = globalFunction.debounce(function() {
                    if (!$scope.pagination.isLast()) {
                        $scope.select($scope.pagination.page + 1)
                    } else {
                        modalExtension.tips('没有更多内容');
                    }
                }, 20);
                $scope.search();

                $window.document.title = '搜索结果';
            }
        ])
        .directive('errSrc', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    element.bind('error', function() {
                        if (attr.src != attr.errSrc) {
                            attr.$set('src', attr.errSrc);
                        }
                    });
                }
            };
        })
        .directive('picPreview', function($compile) {
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    element.find('input').eq(0).on('change', function(event) {
                        if (event.target.files && event.target.files[0]) {
                            element.children().eq(0).css('display', 'none');
                            element.children().eq(1).css('display', 'block');
                            var reader = new FileReader();

                            reader.onload = function(e) {
                                element.children().eq(1).append($compile('<div cropper><img src="' + e.target.result + '" width="100%"></div>')(scope));
                            };

                            reader.readAsDataURL(event.target.files[0]);
                            $('#btnConfirm').show();
                        }
                    });
                }
            }
        })
        .directive('picUpdatePreview', function($compile) {
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    element.on('change', function(event) {
                        if (event.target.files && event.target.files[0]) {
                            $('.post').hide().next().show();
                            var reader = new FileReader();

                            reader.onload = function(e) {
                                $('#preview').empty().append($compile('<div cropper><img src="' + e.target.result + '" width="100%"></div>')(scope));
                            };

                            reader.readAsDataURL(event.target.files[0]);
                            $('#btnConfirm').show();
                        }
                    });
                }
            }
        })
        .directive('cropper', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    var convertToData = function(url, canvasdata, cropdata, callback) {
                        var cropw = cropdata.width; // 剪切的宽
                        var croph = cropdata.height; // 剪切的高
                        var imgw = canvasdata.width; // 图片缩放或则放大后的宽
                        var imgh = canvasdata.height; // 图片缩放或则放大后的高
                        var poleft = canvasdata.left - cropdata.left; // canvas定位图片的左边位置
                        var potop = canvasdata.top - cropdata.top; // canvas定位图片的上边位置
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext('2d');
                        canvas.width = cropw;
                        canvas.height = croph;
                        var img = new Image();
                        img.src = url;
                        img.onload = function() {
                            this.width = imgw;
                            this.height = imgh;
                            // 这里主要是懂得canvas与图片的裁剪之间的关系位置
                            ctx.drawImage(this, poleft, potop, this.width, this.height);
                            var base64 = canvas.toDataURL('image/jpg', 1); // 这里的“1”是指的是处理图片的清晰度（0-1）之间，当然越小图片越模糊，处理后的图片大小也就越小
                            callback && callback(base64) // 回调base64字符串
                        }

                    };
                    var cropBox = $(element)
                    var image = cropBox.find('img'),
                        btnConfirm = $('#btnConfirm');
                    image.on('load', function() {
                        image.cropper({
                            dragMode: 'none',
                            aspectRatio: NaN,
                            autoCropArea: 1,
                            scalable: true,
                            zoomable: false,
                            cropBoxResizable: true,
                            movable: false
                        });
                    });

                    btnConfirm.on('click', function() {
                        var src = image.eq(0).attr('src');
                        var canvasdata = image.cropper('getCanvasData');
                        var cropBoxData = image.cropper('getCropBoxData');

                        convertToData(src, canvasdata, cropBoxData, function(basechar) {
                            // 回调后的函数处理 
                            // console.log(basechar);
                            scope.$apply(function() {
                                scope.hasCropImg = true;
                            });
                            $('.crop-img > img').attr('src', basechar);
                            $('#preview').hide().prev().show();
                            $('#btnConfirm').hide();
                        });
                    });
                }
            }
        })
        .directive('artEditor', function(globalFunction) {
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    var token = window.sessionStorage.getItem('token');
                    $(element).artEditor({
                        imgTar: '#imageUpload',
                        limitSize: 5, // 兆
                        showServer: true,
                        uploadUrl: globalFunction.getApiUrl('bbs/article/upload?PHPSESSID=' + token),
                        data: {},
                        uploadField: 'image',
                        placeholader: '<p>请输入文章正文内容</p>',
                        validHtml: ["<br/>"],
                        formInputId: 'target',
                        uploadSuccess: function(res) {
                            // return img url
                            return res.image;
                        },
                        uploadError: function(res) {
                            // something error
                            console.log(res);
                        }
                    });
                }
            }
        })
        .directive('backToTop', function() {
            return {
                restrict: 'A',
                require: '^scrollableContent',
                link: function(scope, element, attr, ctrl) {
                    var scrollableContentController = ctrl;
                    // scrollableContentController.scrollTo(200);
                    var ele = $(element);
                    $(window).on('touchmove', function() {
                        if ($('#myScrollableContent').scrollTop() > 400) {
                            ele.fadeIn(200);
                        } else {
                            ele.fadeOut(200);
                        }
                    });
                    ele.on('click', function() {
                        scrollableContentController.scrollTo(0);
                        ele.fadeOut(200);
                    });
                }
            }
        })
        /*.directive('contenteditable',function(){
            return {
                restrict:'A',
                require:'?ngModel',
                link:function(scope,element,atrrs,ngModel){
                    debugger;
                    if(!ngModel)return;
                    ngModel.$render=function(){
                        element.html(ngModel.$viewValue||'');
                    }
                    element.on('blur keyup change', function() {
                        scope.$apply(read);
                    });
                    read();
                    function read() {
                        var html = element.html();
                        ngModel.$setViewValue(html);
                    }
                }
            }
        })*/
        .directive('errSrc', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    element.bind('error', function() {
                        if (attr.src != attr.errSrc) {
                            attr.$set('src', attr.errSrc);
                        }
                    });
                }
            };
        })
        // .directive('historyPushState', function() {
        //     return {
        //         restrict: 'A',
        //         // require: '^scrollableContent',
        //         link: function(scope, element, attr, ctrl) {
        //             // var scrollableContentController = ctrl;
        //             var elem = angular.element(document.getElementById('myScrollableContent'));
        //             var scrollableContentController = elem.controller('scrollableContent');
        //             // var index = document.getElementById('0'); 
        //             scrollableContentController.scrollableContent.onscroll = function() {
        //                     scope.scrollTop = scrollableContentController.scrollableContent.scrollTop;
        //                     //无刷新加载 记录返回history位置
        //                     var state = {
        //                         data: scope.bbsArticleList,
        //                         page: scope.pagination.page,
        //                         scrollTop: scope.scrollTop
        //                     };
        //                     window.history.pushState(state, '', '');

    //                 }
    //                 //监听history事件
    //             window.onpopstate = function(event) {
    //                 console.log(event);
    //                 var state = event.state;
    //                 scope.bbsArticleList = state.data;
    //                 scope.pagination.page = state.page;
    //                 scrollableContentController.scrollTo(state.scrollTop);
    //             };
    //         }
    //     };
    // })
    .filter('trust', ['$sce', function($sce) {
        return function(val, str) {
            switch (str) {
                case 'html':
                    return $sce.trustAsHtml(val);
                case 'js':
                    return $sce.trustAsJs(val);
                case 'css':
                    return $sce.trustAsCss(val);
                case 'url':
                    return $sce.trustAsUrl(val);
                case 'resourceUrl':
                    return $sce.trustAsResourceUrl(val);
                default:
                    return '未可知';
            }
        };

    }]);
}).call(this);
