module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            my_target: {
                files: {
                    'html/js/n-particle.min.js': ['html/js/n-particle.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['html/js/*.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false,
                },
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']);
};