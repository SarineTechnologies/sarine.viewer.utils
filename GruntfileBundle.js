'use strict';
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt)
    var target = grunt.option('target') || "";
    grunt.initConfig({
        config: grunt.file.readJSON("package.json"),
        concat: {
            build: {
                options: {
                    sourceMap : true,
                },
                src: ["src/*.js"],
                dest: 'dist/sarine.viewer.utils.js'
            }  
        },      
        uglify: {
            build: {
                options: {
                    banner: '/*\n<%= config.name %> - v<%= config.version %> - ' +
                        ' <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %> ' + '\n*/\n',
                    preserveComments: false,
                    sourceMap : true,
                    sourceMapIn: "dist/<%= config.name %>.js.map"
                },
                files: {
                    'dist/sarine.viewer.utils.min.js': ['dist/sarine.viewer.utils.js']
                }
            }
        }
    })
    grunt.registerTask('bundle', [
        'concat:build', // concat + map
        'uglify' //min + banner + remove comments + map
        ]);
};
