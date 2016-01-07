/*jshint browser: true */
/*global d3: false */

(function(window){
    "use strict";
    //====================================
    //Particle Class
    function Particle(container, posX, posY, radius, color, config){
        /*Particle.containerWidth = parseInt(container.attr('width'));
        Particle.containerHeight = parseInt(container.attr('height'));*/
        this.config = config;
        this.initialize(container, posX, posY, radius, color, config);
        this.renderParticle();
    }
    //setting all the common values
    /*Particle.maxRadius = 4;
    Particle.minRadius = 1;
    Particle.defaultColor = '#fff';
    Particle.maxHorizontalSpeed = 2;
    Particle.maxVerticalSpeed = 2;
    Particle.containerWidth = undefined;
    Particle.containerHeight = undefined;*/

    //this functions creates initial particle
    Particle.prototype.initialize = function(container, posX, posY, radius, color){
        //initial assignments
        this.container = container;
        this.resetParticle(posX, posY, radius, color);
    };

    Particle.prototype.resetParticle = function(posX, posY, radius, color){
        this.radius = radius || (Math.random() * this.config.maxRadius) + this.config.minRadius;
        this.color = color || this.config.particleColor;
        this.opacity = 0.7;
        this.horizontalSpeed = Math.random() * this.config.maxHorizontalSpeed * (Math.round(Math.random())?-1 : 1);
        this.VerticalSpeed = Math.random() * this.config.maxVerticalSpeed * (Math.round(Math.random())?-1 : 1);
        this.posX = posX || Math.random() * this.config.elementWidth;
        this.posY = posY || Math.random() * this.config.elementHeight;
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
        var tempPosX = posX || (this.posX + this.horizontalSpeed);
        var tempPosY = posY || (this.posY + this.VerticalSpeed);

        //reset the particles if they are out of bound
        if(tempPosX < 0 || tempPosX > this.config.elementWidth){
            tempPosX = Math.random() * this.config.elementWidth;
        }
        if(tempPosY < 0 || tempPosY > this.config.elementHeight){
            tempPosY = Math.random() * this.config.elementHeight;
        }

        this.posX = tempPosX;
        this.posY = tempPosY;
    };

    //====================================
    //connectorlines Class
    function ConnectorLine(x1, y1, x2, y2, lineColor, config){
        this.config = config;
        this.initialize(x1, y1, x2, y2, lineColor);
    }

    //ConnectorLine.threshold = 100;

    ConnectorLine.prototype.initialize = function(x1, y1, x2, y2, lineColor){
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
    function nParticle(element, elementWidth, elementHeight, config){
        var selfObj = this;
        selfObj.particleList = [];
        selfObj.connectorLinesList = [];
        selfObj.config = config;
        selfObj.initialize(element, elementWidth, elementHeight, selfObj.config);
        setInterval(function(){
            selfObj.animateParticles(elementWidth, elementHeight);
        }, 50);
    }

    //setting all the common values
    //nParticle.bgColor = '#398bdd';
    //nParticle.maxParticleCount = 10;

    nParticle.prototype.initialize = function(element, elementWidth, elementHeight, config){
        this.element = element;
        this.elementWidth = elementWidth;
        this.elementHeight = elementHeight;

        //creating config object
        this.config = {
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
            maxThreshold: 80,
            backgroundColor: '#398bdd',
            fps: 100
        };
        for(var key in config){
            if(config.hasOwnProperty(key)){
                this.config[key] = config[key];
            }
        }

        //create the element
        this.svg = this.config.element
            .attr({
            width: '100%',
            height: '100%'
        })
            .style({background: this.config.backgroundColor});

        this.svg.append('g')
            .attr({
            class: 'particleContainer',
            transform: 'translate(0, 0)'
        });
        this.svg.append('g').attr('class', 'lineContainer');
    };

    //rendering particles
    nParticle.prototype.animateParticles = function(elementWidth, elementHeight){
        //add particle if there aren't enough
        if(this.particleList.length < this.config.maxParticleCount){
            var randomPosX = Math.random() * elementWidth;
            var randomPosY = Math.random() * elementHeight;
            var particle = new Particle(this.svg, randomPosX, randomPosY, '', '', this.config);
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
                if(distance < 100){
                    var line = new ConnectorLine(x1, y1, x2, y2, '', this.config);
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
            opacity: function(d){return d.opacity > 0.6 ? 0.6 : d.opacity;}
        });

    };
    window.nParticle = nParticle;
    //====================================
})(window, d3);