
'use strict';
var app = angular.module('twitterApp');

app.controller('homeController', function ($scope, $q, $interval, $timeout, twitterService, instagramService) {
    
    $scope.trends = [{
        text: 'AylanKurdi ',
        relativeterms: [
            {
                word: 'AylanKurdi'
            },
            {
                word: 'refugee'
            },
            {
                word: 'crisis'
            }
        ]
    }];

    $scope.tweets = []; //array of tweets

    twitterService.initialize();

    //using the OAuth authorization result get the latest 20 tweets from twitter for the user
    $scope.refreshTimeline = function (maxId, searchterm) {
        return twitterService.getLatestTweets(maxId, searchterm).then(function (data) {
            $scope.tweets = $scope.tweets.concat(data.statuses);

            var wordFreq = {},
              data = [];

            angular.forEach($scope.tweets, function (tweet) {
                angular.forEach(tweet.text.split(' '), function (word) {
                        if (word.length > 3) {
                            if (!wordFreq[word]) {
                                wordFreq[word] = { word: word, score: 0, id: tweet.id };
                            }
                            wordFreq[word].score += 1;
                        }
                    });
                });
            angular.forEach(wordFreq, function (word) {
                data.push({
                    name: word.word,
                    score: word.score,
                    id: word.id
                });
            });

            data.sort(function (a, b) { return b.score - a.score; })
            $scope.data = data.slice(0, 20);


        }, function () {
            $scope.rateLimitError = true;
        });
    }

    var fetchInstagramTrends = function (trend) {
        var deferred = $q.defer(); 
        angular.forEach(trend.relativeterms, function (term) {
            trend.photos = []; 
            instagramService.getTagFeed(term.word, '27719842.467ede5.b3ef1ac828a54a73b24c061dd17ed800').then(function (results) {
                trend.photos = results.data; 
            });
        })
        deferred.resolve();
        return deferred.promise; 
    };

    var fetchTwitterTrends = function (maxId) {
        $scope.scene_1 = false;
        var deferred = $q.defer(); 
        angular.forEach($scope.trends, function (trend) {
            $scope.refreshTimeline(maxId, trend.text).then(fetchInstagramTrends(trend)).then($scope.startVisual);
        });
        deferred.resolve();
        return deferred.promise; 
    };
    $scope.fetchTwitterTrends = fetchTwitterTrends; 

    $scope.startVisual = function () {
        var timer = $interval(function () {
            if ($scope.triangles > 0.2)
                $scope.triangles = $scope.triangles - 0.01;
            else {
                $interval.cancel(timer);
            }
        }, 100);
    };  

    $scope.emotionrange = true;
    $scope.startd3 = function () {
        $scope.emotionrange = false; 
        $scope.scene_4 = true;

        var dummyDataWords = [
            {
                word: 'senseless ',
                sentiment: '-',
                weight: 5,
                score: 3
            },
            {
                word: 'tragedy ',
                sentiment: '-',
                weight: 8,
                score: 2
            },
            {
                word: 'Child ',
                sentiment: '+',
                weight: 4,
                score: 7
            },
            {
                word: 'Beautiful ',
                sentiment: '+',
                weight: 8,
                score: 5
            },
            {
                word: 'Brutal ',
                sentiment: '-',
                weight: 7,
                score: 1
            },
            {
                word: 'Syria ',
                sentiment: '-',
                weight: 5,
                score: 4
            },
            {
                word: 'Sympathy ',
                sentiment: '+',
                weight: 2,
                score: 3
            },
            {
                word: 'Refugees ',
                sentiment: '-',
                weight: 2,
                score: 6
            },
            {
                word: 'Crisis ',
                sentiment: '-',
                weight: 8,
                score: 2
            },
        ];


        $timeout(function () { $scope.circledata = dummyDataWords }, 1200);
    }; 

    $scope.fetchTweetByIndex = function (index) {
        alert(index);
    }

    $scope.scene_1 = true; // Opening hashtag
    $scope.scene_2 = false; // Fractal animation 
    $scope.scene_3 = false; // Instagram fade-in
    $scope.scene_4 = false; // D3 Animation 

    //when the user clicks the connect twitter button, the popup authorization window opens
    $scope.connectButton = function () {
        twitterService.connectTwitter().then(function () {
            if (twitterService.isReady()) {

                //if the authorization is successful, hide the connect button and display the tweets
                $('#connectButton').fadeOut(function () {
                    $('#getTimelineButton, #signOut').fadeIn();

                    fetchTwitterTrends(null);
                    
                    $scope.connectedTwitter = true;
                });
            } else {

            }
        });
    }

    //if the user is a returning user, hide the sign in button and display the tweets
    if (twitterService.isReady()) {
        //$('#connectButton').hide();
        //$('#getTimelineButton, #signOut').show();
        $scope.scene_1 = true; 
        $scope.connectedTwitter = true;
        //fetchTwitterTrends(null);
    }
    else {
        $scope.authRequired = true; 
    }

    //sign out clears the OAuth cache, the user will have to reauthenticate when returning
    $scope.signOut = function () {
        twitterService.clearCache();
        $scope.tweets.length = 0;
        $('#getTimelineButton, #signOut').fadeOut(function () {
            $('#connectButton').fadeIn();
            $scope.$apply(function () {
                $scope.connectedTwitter = false
            })
        });
    }

    $scope.triangles = 0.5;

    var emotionColours = [
        {
            emotion: "positive",
            colour: "Greens",
            minValue: 0.9,
            maxValue: 0.99
        },
        {
            emotion: "positive",
            colour: "BuGn",
            minValue: 0.8,
            maxValue: 0.89
        },
        {
            emotion: "positive",
            colour: "GnBu",
            minValue: 0.7,
            maxValue: 0.79
        },
        {
            emotion: "positive",
            colour: "PuBu",
            minValue: 0.6,
            maxValue: 0.69
        },
        {
            emotion: "ambivalent",
            colour: "Pastel1",
            minValue: 0.5,
            maxValue: 0.59
        },
        {
            emotion: "negative",
            colour: "Oranges",
            minValue: 0.4,
            maxValue: 0.49
        },
        {
            emotion: "negative",
            colour: "OrRd",
            minValue: 0.3,
            maxValue: 0.39
        },
        {
            emotion: "negative",
            colour: "Reds",
            minValue: 0.2,
            maxValue: 0.29
        },
        {
            emotion: "negative",
            colour: "YlOrBr",
            minValue: 0.1,
            maxValue: 0.19
        },
        {
            emotion: "negative",
            colour: "Greys",
            minValue: 0,
            maxValue: 0.09
        }
    ]

    var currentColour = "";
    var currentEmotionalColour = function () {
        angular.forEach(emotionColours, function (colour) {
            if ($scope.triangles <= colour.maxValue && $scope.triangles >= colour.minValue)
                currentColour = colour.colour;
        })
    }

    $scope.$watch('triangles', function (newValue, oldValue) {
        $scope.buildFractal();
    });

    $scope.buildFractal = function () {
        demo.init();
    };

    var demo = (function (window, undefined) {

        /**
         * Enum of CSS selectors.
         */
        var SELECTORS = {
            pattern: '.pattern',
            card: '.card',
            cardImage: '.card__image',
            cardClose: '.card__btn-close',
        };

        /**
         * Enum of CSS classes.
         */
        var CLASSES = {
            patternHidden: 'pattern--hidden',
            polygon: 'polygon',
            polygonHidden: 'polygon--hidden'
        };

        /**
         * Map of svg paths and points.
         */
        var polygonMap = {
            paths: null,
            points: null
        };

        /**
         * Container of Card instances.
         */
        var layout = {};

        /**
         * Initialise demo.
         */
        function init() {

            // For options see: https://github.com/qrohlf/Trianglify
            currentEmotionalColour();
            
            var pattern = Trianglify({
                width: window.innerWidth,
                height: window.innerHeight,
                x_colors: currentColour,
                y_colors: 'match_x',
                palette: Trianglify.colorbrewer,
                color_space: 'lab',
                color_function: false,
                variance: 1 - $scope.triangles,
                cell_size: (1 - $scope.triangles) * 200
            }).svg();
            $(SELECTORS.pattern).empty();
            _mapPolygons(pattern);

            _bindCards();
        };

        /**
         * Store path elements, map coordinates and sizes.
         * @param {Element} pattern The SVG Element generated with Trianglify.
         * @private
         */
        function _mapPolygons(pattern) {

            // Append SVG to pattern container.
            $(SELECTORS.pattern).append(pattern);

            // Convert nodelist to array,
            // Used `.childNodes` because IE doesn't support `.children` on SVG.
            polygonMap.paths = [].slice.call(pattern.childNodes);

            polygonMap.points = [];

            polygonMap.paths.forEach(function (polygon) {

                // Hide polygons by adding CSS classes to each svg path (used attrs because of IE).
                $(polygon).attr('class', CLASSES.polygon);

                var rect = polygon.getBoundingClientRect();

                var point = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };

                polygonMap.points.push(point);
            });

            // All polygons are hidden now, display the pattern container.
            $(SELECTORS.pattern).removeClass(CLASSES.patternHidden);
        };

        /**
         * Bind Card elements.
         * @private
         */
        function _bindCards() {

            var elements = $(SELECTORS.card);

            $.each(elements, function (card, i) {

                var instance = new Card(i, card);

                layout[i] = {
                    card: instance
                };

                var cardImage = $(card).find(SELECTORS.cardImage);
                var cardClose = $(card).find(SELECTORS.cardClose);

                $(cardImage).on('click', _playSequence.bind(this, true, i));
                $(cardClose).on('click', _playSequence.bind(this, false, i));
            });
        };

        /**
         * Create a sequence for the open or close animation and play.
         * @param {boolean} isOpenClick Flag to detect when it's a click to open.
         * @param {number} id The id of the clicked card.
         * @param {Event} e The event object.
         * @private
         *
         */
        function _playSequence(isOpenClick, id, e) {

            var card = layout[id].card;

            // Prevent when card already open and user click on image.
            if (card.isOpen && isOpenClick) return;

            // Create timeline for the whole sequence.
            var sequence = new TimelineLite({ paused: true });

            var tweenOtherCards = _showHideOtherCards(id);

            if (!card.isOpen) {
                // Open sequence.

                _setPatternBgImg(e.target);

                sequence.add(tweenOtherCards);
                sequence.add(card.openCard(_onCardMove), 0);

            } else {
                // Close sequence.

                var closeCard = card.closeCard();
                var position = closeCard.duration() * 0.8; // 80% of close card tween.

                sequence.add(closeCard);
                sequence.add(tweenOtherCards, position);
            }

            sequence.play();
        };

        /**
         * Show/Hide all other cards.
         * @param {number} id The id of the clcked card to be avoided.
         * @private
         */
        function _showHideOtherCards(id) {

            var TL = new TimelineLite;

            var selectedCard = layout[id].card;

            for (var i in layout) {

                var card = layout[i].card;

                // When called with `openCard`.
                if (card.id !== id && !selectedCard.isOpen) {
                    TL.add(card.hideCard(), 0);
                }

                // When called with `closeCard`.
                if (card.id !== id && selectedCard.isOpen) {
                    TL.add(card.showCard(), 0);
                }
            }

            return TL;
        };

        /**
         * Add card image to pattern background.
         * @param {Element} image The clicked SVG Image Element.
         * @private
         */
        function _setPatternBgImg(image) {

            var imagePath = $(image).attr('xlink:href');

            $(SELECTORS.pattern).css('background-image', 'url(' + imagePath + ')');
        };

        /**
         * Callback to be executed on Tween update, whatever a polygon
         * falls into a circular area defined by the card width the path's
         * CSS class will change accordingly.
         * @param {Object} track The card sizes and position during the floating.
         * @private
         */
        function _onCardMove(track) {

            var radius = track.width / 2;

            var center = {
                x: track.x,
                y: track.y
            };

            polygonMap.points.forEach(function (point, i) {

                if (_detectPointInCircle(point, radius, center)) {
                    $(polygonMap.paths[i]).attr('class', CLASSES.polygon + ' ' + CLASSES.polygonHidden);
                } else {
                    $(polygonMap.paths[i]).attr('class', CLASSES.polygon);
                }
            });
        }

        /**
         * Detect if a point is inside a circle area.
         * @private
         */
        function _detectPointInCircle(point, radius, center) {

            var xp = point.x;
            var yp = point.y;

            var xc = center.x;
            var yc = center.y;

            var d = radius * radius;

            var isInside = Math.pow(xp - xc, 2) + Math.pow(yp - yc, 2) <= d;

            return isInside;
        };

        // Expose methods.
        return {
            init: init
        };
    })(window);

    // Kickstart Demo.
    window.onload = demo.init;

});