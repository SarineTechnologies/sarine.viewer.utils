'use strict';
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt)
    var target = grunt.option('target') || "";
    grunt.initConfig({
        config: grunt.file.readJSON("bower.json"),
        version: {
            project: {
                src: ['bower.json', 'package.json']
            }
        },
        copy: {
            build: {
                flatten: true,
                src: ["src/*.png"],
                dest: "dist",
                expand: true
            }
        },
        concat: {
            build: {
                options: {
                    stripBanners: true,
                    banner: '/*\n<%= config.name %> - v<%= config.version %> - ' +
                        ' <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %> ' + '\n*/\n',
                },
                src: ["src/*.js"],
                dest: 'dist/sarine.viewer.utils.js'
            },
            commentMin : {
                options: {
                    stripBanners: true,
                    banner: '/*\n<%= config.name %> - v<%= config.version %> - ' +
                        ' <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %> ' + '\n*/\n',
                },
                src: ["dist/sarine.viewer.utils.min.js"],
                dest: 'dist/sarine.viewer.utils.min.js'
            }     
        },      
        uglify: {
            build: {
                options: {
                    mangle: false,
                    sourceMap : true
                },
                files: {
                    'dist/sarine.viewer.utils.min.js': ['dist/sarine.viewer.utils.js']
                }
            }
        }
    })
    grunt.registerTask('bundle', ['copy','concat:build','uglify','concat:commentMin']);
};
