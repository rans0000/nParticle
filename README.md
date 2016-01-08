# nParticles

**# nParticles** is a small particle effect I did after I saw the [website](http://www.rapidvaluetechathon.com/) for techathon at RapidValue. After seeing it, I just couldn't hold myself and I opened up brackets to hack together this plugin. The original plugin used uses canvas (https://github.com/VincentGarreau/particles.js) and has much more options but for now I'll just do a basic version.

## Usage
Simply include the javascript & css file *(nParticle.js & nParticle.js)*.
Pass the html selector to the constructor. The genetrated svg will fill the container.

```
var anim = new nParticle('#particle-container');
```

You can also pass an optional **config ** object to override the default values:

```javascript
var anim = new nParticle('#particle-container', {
    maxRadius: 4,                   // Integer: Maximum  radius for circular particle
    minRadius: 1,                   // Integer: Minimum  radius for circular particle
    maxHorizontalSpeed: 2,          // Number: Maximum horizontal speed for particles
    maxVerticalSpeed: 4,            // Number: Minimum horizontal speed for particles
    maxParticleCount: 20,           // Number: Number of particles created. Large numbers will slow down the animation.
    particleColor: '#fff',          // Hex Color String: The color for circular and line particles
    maxThreshold: 100,              // Number: The minimum distance between the circle particles to be connected by the line
    minThreshold: 10,               // Number: The minimum distance between two circle particle where the line opacity is at maximum
    backgroundColor: '#398bdd',     // Hex Color String: Background color. Use 'none' to have a transparent background
    animInterval: 100               // Integer: How often the animation needs to update (milliseconds). Lower values will make the animation smoother but going too low will affect perfomance.
})
```
The partcles are *SVG*, so you cann just use CSS to further style them.

Thanks for my buddy [Sarath](https://github.com/noobe) for helping me figure out some of the issues with the code. Cheers!!