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
                src: ["src/*.js"],
                dest: 'dist/sarine.viewer.utils.js'
            }     
        },      
        uglify: {
            build: {
                options: {
                    mangle: false
                },
                files: {
                    'dist/sarine.viewer.utils.min.js': ['dist/sarine.viewer.utils.js']
                }
            }
        },
        gitcommit: {
            all: {
                options: {
                    message: "<%= config.message %>",
                    force: true
                },
                files: {
                    src: files
                }
            },
            bower: {
                options: {
                    message: "release : <%= config.version %>",
                    force: true
                },
                files: {
                    src: ["bower.json", "package.json"]
                }
            }
        },
        gitpush: {
            all: {
                options: {
                    force: true
                },
                files: {
                    src: files
                }
            }
        },
        gitadd: {
            firstTimer: {
                option: {
                    force: true
                },
                files: {
                    src: files
                }
            }
        },
        gitpull: {
            build: {
                options: {
                    force: true
                },
                files: {
                    src: files
                }
            }
        },
        prompt: {
            all: {
                options: {
                    questions: [{
                        config: 'config.message',
                        type: 'input',
                        message: 'comment:\n',
                        default: 'commit'
                    }]
                }
            }
        }
    })
    grunt.registerTask('bundle', ['copy','concat','uglify']);
};
