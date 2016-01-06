/*jshint browser: true */
/*global d3: false */

(function(window){
    "use strict";
    //====================================
    //Particle Class
    function Particle(container, posX, posY, radius, color){
        Particle.containerWidth = parseInt(container.attr('width'));
        Particle.containerHeight = parseInt(container.attr('height'));
        this.initialize(container, posX, posY, radius, color);
        this.renderParticle();
    }
    //setting all the common values
    Particle.maxRadius = 4;
    Particle.minRadius = 1;
    Particle.defaultColor = '#fff';
    Particle.maxHorizontalSpeed = 2;
    Particle.maxVerticalSpeed = 2;
    Particle.containerWidth = undefined;
    Particle.containerHeight = undefined;

    //this functions creates initial particle
    Particle.prototype.initialize = function(container, posX, posY, radius, color){
        //initial assignments
        this.container = container;
        this.resetParticle(posX, posY, radius, color);
    };

    Particle.prototype.resetParticle = function(posX, posY, radius, color){
        this.radius = radius || (Math.random() * Particle.maxRadius) + Particle.minRadius;
        this.color = color || Particle.defaultColor;
        //this.opacity = Math.random();
        this.opacity = 0.7;
        this.horizontalSpeed = Math.random() * Particle.maxHorizontalSpeed * (Math.round(Math.random())?-1 : 1);
        this.VerticalSpeed = Math.random() * Particle.maxVerticalSpeed * (Math.round(Math.random())?-1 : 1);
        this.posX = posX || Math.random() * Particle.containerWidth;
        this.posY = posY || Math.random() * Particle.containerHeight;
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
        if(tempPosX < 0 || tempPosX > Particle.containerWidth){
            tempPosX = Math.random() * Particle.containerWidth;
        }
        if(tempPosY < 0 || tempPosY > Particle.containerHeight){
            tempPosY = Math.random() * Particle.containerHeight;
        }

        this.posX = tempPosX;
        this.posY = tempPosY;
        console.log(this.posX);
    };

    //====================================
    //connectorlines Class
    function ConnectorLine(x1, y1, x2, y2, lineColor){
        this.initialize(x1, y1, x2, y2, lineColor);
    }

    ConnectorLine.threshold = 100;

    ConnectorLine.prototype.initialize = function(x1, y1, x2, y2, lineColor){
        this.color = lineColor || '#fff';
        this.renderConnectorLines(x1, y1, x2, y2);
    };

    ConnectorLine.prototype.renderConnectorLines = function(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        var distance = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
        distance = (ConnectorLine.threshold - distance > 30)? 10 : distance;
        this.opacity = 1 - (distance / ConnectorLine.threshold);
    };

    //====================================
    //nParticle Class
    function nParticle(element, elementWidth, elementHeight){
        var selfObj = this;
        selfObj.particleList = [];
        selfObj.connectorLinesList = [];
        selfObj.initialize(element, elementWidth, elementHeight);
        setInterval(function(){
            selfObj.animateParticles(elementWidth, elementHeight);
        }, 50);
    }

    //setting all the common values
    nParticle.bgColor = '#398bdd';
    nParticle.maxParticleCount = 30;

    nParticle.prototype.initialize = function(element, elementWidth, elementHeight){
        this.element = element;
        this.elementWidth = elementWidth;
        this.elementHeight = elementHeight;

        //create the element
        this.svg = d3.select(element).append('svg')
            .attr({
            width: elementWidth,
            height: elementHeight
        })
            .style({background: nParticle.bgColor});

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
        if(this.particleList.length < nParticle.maxParticleCount){
            var randomPosX = Math.random() * elementWidth;
            var randomPosY = Math.random() * elementHeight;
            var particle = new Particle(this.svg, randomPosX, randomPosY);
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
                    var line = new ConnectorLine(x1, y1, x2, y2);
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