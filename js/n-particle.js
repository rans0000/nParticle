/*jshint browser: true */
/*global d3: false */

(function(window){
    "use strict";
    //====================================
    //Particle Class
    function Particle(container, posX, posY, config){
        this.config = config;
        this.initialize(container, posX, posY, config);
        this.renderParticle();
    }

    //this functions creates initial particle
    Particle.prototype.initialize = function(container, posX, posY){
        //initial assignments
        this.container = container;
        this.resetParticle(posX, posY);
    };

    Particle.prototype.resetParticle = function(posX, posY){
		var config = this.config;
        this.radius = (Math.random() * config.maxRadius) + config.minRadius;
        this.color = config.particleColor;
        this.opacity = 0.7;
        this.horizontalSpeed = Math.random() * config.maxHorizontalSpeed * (Math.round(Math.random())?-1 : 1);
        this.VerticalSpeed = Math.random() * config.maxVerticalSpeed * (Math.round(Math.random())?-1 : 1);
        this.posX = posX || Math.random() * config.elementWidth;
        this.posY = posY || Math.random() * config.elementHeight;
    };

    //render a single particle
    Particle.prototype.renderParticle = function(){
        this.container.select('.particleContainer')
            .append('circle')
            .attr({
            cx: this.posX,
            cy: this.posY,
            r: this.radius
        })
            .style({
            fill: this.color,
            stroke: 'none',
            opacity: this.opacity
        });
    };

    //Move the particle
    Particle.prototype.moveParticle = function(posX, posY){
		var config = this.config;
        var tempPosX = posX || (this.posX + this.horizontalSpeed);
        var tempPosY = posY || (this.posY + this.VerticalSpeed);

        //reset the particles if they are out of bound
        if(tempPosX < 0 || tempPosX > config.elementWidth){
            tempPosX = Math.random() * config.elementWidth;
        }
        if(tempPosY < 0 || tempPosY > config.elementHeight){
            tempPosY = Math.random() * config.elementHeight;
        }

        this.posX = tempPosX;
        this.posY = tempPosY;
    };

    //====================================
    //connectorlines Class
    function ConnectorLine(x1, y1, x2, y2, config){
        this.config = config;
        this.initialize(x1, y1, x2, y2);
    }

    ConnectorLine.prototype.initialize = function(x1, y1, x2, y2){
        this.color = this.config.particleColor;
        this.renderConnectorLines(x1, y1, x2, y2);
    };

    ConnectorLine.prototype.renderConnectorLines = function(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        var distance = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
        distance = (this.config.maxThreshold - distance > (this.config.maxThreshold - this.config.minThreshold))? this.config.minThreshold : distance;
        this.opacity = 1 - (distance / this.config.maxThreshold);
    };

    //====================================
    //nParticle Class
    function nParticle(element, config){
        var selfObj = this;
        selfObj.particleList = [];
        selfObj.connectorLinesList = [];
        selfObj.config = config;
        selfObj.initialize(element, selfObj.config);
        setInterval(function(){
            selfObj.animateParticles();
        }, this.config.animInterval);
    }

    nParticle.prototype.initialize = function(element, config){
        var selfObj = this;
        selfObj.element = d3.select(element);
        var containerDimensions = selfObj.element.node().getBoundingClientRect();
        var elementWidth = containerDimensions.width;
        var elementHeight = containerDimensions.height;

        //creating config object
        selfObj.config = {
            element: d3.select(element).append('svg'),
            elementWidth: elementWidth || 500,
            elementHeight: elementHeight || 500,
            maxRadius: 4,
            minRadius: 1,
            maxHorizontalSpeed: 2,
            maxVerticalSpeed: 4,
            maxParticleCount: 20,
            particleColor: '#fff',
            minThreshold: 10,
            maxThreshold: 100,
            backgroundColor: '#398bdd',
            animInterval: 100
        };
        for(var key in config){
            if(config.hasOwnProperty(key)){
                selfObj.config[key] = config[key];
            }
        }

        //create the element
        selfObj.svg = selfObj.config.element
            .attr({
            width: '100%',
            height: '100%'
        })
            .style({background: selfObj.config.backgroundColor});

        selfObj.svg.append('g')
            .attr({
            class: 'particleContainer',
            transform: 'translate(0, 0)'
        });
        selfObj.svg.append('g').attr('class', 'lineContainer');
        
        //attaching resize event
        window.onresize = function(){
            selfObj.onResize();
        };
    };
    
    nParticle.prototype.onResize = function(){
		var config = this.config;
        var containerDimensions = this.element.node().getBoundingClientRect();
        config.elementWidth = containerDimensions.width;
        config.elementHeight = containerDimensions.height;
    };

    //rendering particles
    nParticle.prototype.animateParticles = function(){
		var config = this.config;
        //add particle if there aren't enough
        if(this.particleList.length < config.maxParticleCount){
            var randomPosX = Math.random() * config.elementWidth;
            var randomPosY = Math.random() * config.elementHeight;
            var particle = new Particle(this.svg, randomPosX, randomPosY, config);
            this.particleList.push(particle);
        }

        //update the particles & connector lines
        var i;
        var j;
        var len = this.particleList.length;
        this.connectorLinesList = [];
        for(i = 0; i < len; ++i){
            this.particleList[i].moveParticle();
            for(j = 0; j < len; ++j){
                if(i === j && i < len / 2){
                    continue;
                }
                var x1 = this.particleList[i].posX;
                var y1 = this.particleList[i].posY;
                var x2 = this.particleList[j].posX;
                var y2 = this.particleList[j].posY;
                var distance = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
                if(distance < config.maxThreshold){
                    var line = new ConnectorLine(x1, y1, x2, y2, config);
                    this.connectorLinesList.push(line);
                }
            }
        }

        //draw the circles
        var circleJoin = this.svg.select('.particleContainer')
        .selectAll('circle')
        .data(this.particleList);
        circleJoin.enter().append('circle');
        circleJoin.exit().remove('circle');
        this.svg.select('.particleContainer')
            .selectAll('circle')
            .attr({
            cx: function(d){return d.posX;},
            cy: function(d){return d.posY;},
            r: function(d){return d.radius;}
        })
            .style({
            fill: function(d){return d.color;},
            stroke: 'none',
            opacity: function(d){return d.opacity;}
        });

        //draw the connectorlines
        var lineJoin = this.svg.select('.lineContainer')
        .selectAll('line')
        .data(this.connectorLinesList);
        lineJoin.enter().append('line');
        lineJoin.exit().remove('line');
        this.svg.select('.lineContainer')
            .selectAll('line')
            .attr({
            x1: function(d){return d.x1;},
            y1: function(d){return d.y1;},
            x2: function(d){return d.x2;},
            y2: function(d){return d.y2;},
            stroke: function(d){return d.color;}
        })
            .style({
            //maximum opacity is set to 0.6
            opacity: function(d){return d.opacity > 0.6 ? 0.6 : d.opacity;}
        });

    };
    window.nParticle = nParticle;
    //====================================
})(window, d3);