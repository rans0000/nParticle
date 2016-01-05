/*jshint browser: true */
/*global d3: false */

(function(window){
    "use strict";
    //====================================
    //Particle Class
    function Particle(container, posX, posY, radius, color){
        this.initialize(container, posX, posY, radius, color);
        this.renderParticle();
    }
    //setting all the common values
    Particle.maxRadius = 10;
    Particle.minRadius = 4;
    Particle.defaultColor = '#5d63f8';
    Particle.maxHorizontalSpeed = 10;
    Particle.maxVerticalSpeed = 10;

    //this functions creates initial particle
    Particle.prototype.initialize = function(container, posX, posY, radius, color){
        //initial assignments
        this.radius = radius || (Math.random() * Particle.maxRadius) + Particle.minRadius;
        this.color = color || Particle.defaultColor;
        this.opacity = Math.random();
        this.posX = posX;
        this.posY = posY;
        this.horizontalSpeed = Math.random() * Particle.maxHorizontalSpeed;
        this.VerticalSpeed = Math.random() * Particle.maxVerticalSpeed;
        this.container = container;
    };

    //render a single particle
    Particle.prototype.renderParticle = function(){
        this.container.append('circle')
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
        this.posX = posX || (this.posX + this.horizontalSpeed);
        this.posY = posY || (this.posY + this.VerticalSpeed);
    };

    //====================================
    //nParticle Class
    function nParticle(element, elementWidth, elementHeight){
        var selfObj = this;
        selfObj.particleList = [];
        selfObj.initialize(element, elementWidth, elementHeight);
        setInterval(function(){
            selfObj.animateParticles(elementWidth, elementHeight);
        }, 300);
    }

    //setting all the common values
    nParticle.bgColor = '#eee';
    nParticle.maxParticleCount = 10;

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
    };

    //rendering particles
    nParticle.prototype.animateParticles = function(elementWidth, elementHeight){
        if(this.particleList.length < nParticle.maxParticleCount){
            var randomPosX = Math.random() * elementWidth;
            var randomPosY = Math.random() * elementHeight;
            var particle = new Particle(this.svg, randomPosX, randomPosY);
            this.particleList.push(particle);
        }

    };
    window.nParticle = nParticle;
    //====================================
})(window, d3);