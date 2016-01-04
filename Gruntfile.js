/*module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        express: {
            all: {
                options: {
                    bases: 'html',
                    livereload: false,
                    port: 4000,
                    open: 'http://localhost:4000'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-express');

    grunt.registerTask('myserver', ['express', 'express-keepalive']);
    grunt.registerTask('default', ['express']);
};*/