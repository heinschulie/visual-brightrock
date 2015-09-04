(function () {

    var module = angular.module("twitterApp");

    module.directive('d3Bars', ['$window', '$timeout', 'd3Service', function ($window, $timeout, d3Service) {
        return {
            restrict: 'EA',
            scope: {
                data: '=' // bi-directional data-binding
            },
            link: function (scope, element, attrs) {
                d3Service.d3().then(function (d3) {

                    var margin = parseInt(attrs.margin) || 20,
                          barHeight = parseInt(attrs.barHeight) || 20,
                          barPadding = parseInt(attrs.barPadding) || 5;

                    var svg = d3.select(element[0])
                        .append("svg")
                        .style('width', '100%')
                        .style('height', '500px')
                        .append("g");

                    // Browser onresize event
                    window.onresize = function () {
                        scope.$apply();
                    };               

                    // Watch for resize event
                    scope.$watch(function () {
                        return angular.element($window)[0].innerWidth;
                    }, function () {
                        scope.render(scope.data);
                    });

                    //Watch for data change 
                    scope.$watch('data', function (newData) {
                        scope.render(newData);
                    }, true);

                    scope.render = function (data) {

                        //Remove existing elements 
                        svg.selectAll('*').remove();

                        // If we don't pass any data, return out of the element
                        if (!data) return;

                        // setup variables
                        var width = d3.select(element[0]).node().offsetWidth - margin,
                            // calculate the height
                            height = scope.data.length * (barHeight + barPadding),
                            // Use the category20() scale function for multicolor support
                            color = d3.scale.category20(),
                            // our xScale
                            xScale = d3.scale.linear()
                              .domain([0, d3.max(data, function (d) {
                                  return d.score;
                              })])
                              .range([0, width]);

                        // set the height based on the calculations above
                        svg.attr('height', height);

                        svg.selectAll('rect')
                          .data(data)
                            .enter()
                            .append('g')
                            .append('rect')
                            .attr('height', barHeight)
                            .attr('width', 140)
                            .attr('x', Math.round(margin / 2))
                            .attr('y', function (d, i) {
                                return i * (barHeight + barPadding);
                            })
                            .attr('fill', function (d) { return color(d.score); })
                            .transition()
                              .duration(3000)
                              .attr('width', function (d) {
                                  return xScale(d.score);
                              });

                        svg.selectAll("g")
                          //.data(data)
                          //.enter()
                            .append("text")
                            .attr("fill", "#fff")
                            .attr("y", function (d, i) { return i * 25 + 15; })
                            .attr("x", 15)
                            .text(function (d) { return d.name + " ( " + d.score + " )"; });
                    }

                });
            }
        };
    }]);

    module.directive('d3Circles', ['$window', '$timeout', 'd3Service', function ($window, $timeout, d3Service) {
        return {
            restrict: 'EA',
            scope: {
                circledata: '=' // bi-directional data-binding
                //hoverin: '&',
                //hoverout: '&'
            },
            link: function (scope, element, attrs) {
                d3Service.d3().then(function (d3) {

                    var canvas = d3.select(element[0])
                        .append("svg")
                        .style('width', '100%')
                        .style('height', '667px')
                        .style('position', 'absolute')
                        .style('bottom', '0')
                        .style('left', '0')
                        .style('top', '0');
                        //.append("g");

                    // Browser onresize event
                    window.onresize = function () {
                        scope.$apply();
                    };

                    // Watch for resize event
                    scope.$watch(function () {
                        return angular.element($window)[0].innerWidth;
                    }, function () {
                        scope.render(scope.circledata);
                    });

                    //Watch for data change 
                    scope.$watch('circledata', function (newData) {
                        scope.render(newData);
                    }, true);

                    scope.render = function (data) {

                        /* Define the data for the circles */
                        var circles = canvas.selectAll('g')
                            .data(data);

                        /*Create and place the "blocks" containing the circle and the text */
                        var circleenter = circles.enter()
                             .append('g')
                            .attr("transform", function (d) { return "translate(" + d.x + ",80)" });

                        /*Create the circle for each block */
                        var circle = circleenter.append('circle')
                            .attr('fill', 'red')
                            .attr("cx", function (d, i) { return i * 200 + 100; })
                            .attr('r', 0)
                            // start transition:
                            .transition()
                                .duration(3000)
                            // set final (post transition) attributes:
                            .attr('r', function (d) {
                                return d.score * d.weight * 2;
                            })
                            .attr('cy', 500)
                            // start transition:
                            .transition()
                                .duration(3000)
                            .attr('cy', function (d) {
                                return (500 - d.score * 40);
                            });
                            //.on("mouseover", scope.hoverin(3));
                            //.on("mouseout", scope.hoverout);

                        /* Create the text for each block */
                        circleenter.append("text")
                            .attr("fill", "#fff")
                            .attr("y", function (d) {
                                return (500 - d.score * 40);
                            })
                            .attr("x", function (d, i) { return i * 200 + 100; })
                            .style('font-size', function (d) {
                                return (d.score * d.weight + 24);
                            })
                            .text(function (d) { return d.word + " ( " + d.score + " )"; });


                        //var circles = canvas
                        //        .selectAll('circle')
                        //    .data(data)
                        //    .enter()
                        //    .append('g')
                        //    .append('circle')
                        //    .attr('fill', 'red')
                        //    .attr("cx", function (d, i) { return i * 200 + 100; })
                        //    .attr('r', 0)
                        //    // start transition:
                        //    .transition()
                        //        .duration(3000)
                        //    // set final (post transition) attributes:
                        //    .attr('r', function (d) {
                        //        return d.score * d.weight * 2;
                        //    })
                        //    .attr('cy', 500)
                        //    // start transition:
                        //    .transition()
                        //        .duration(3000)
                        //    .attr('cy', function (d) {
                        //        return (500 - d.score * 40);
                        //    });

                        //canvas.selectAll("g")
                        //  //.data(data)
                        //  //.enter()
                        //    .append("text")
                        //    .attr("fill", "#fff")
                        //    .attr("y", function (d, i) { return i * 25 + 15; })
                        //    .attr("x", 15)
                        //    .text(function (d) { return d.name + " ( " + d.score + " )"; });
                    }

                });
            }
        };
    }]);

}());