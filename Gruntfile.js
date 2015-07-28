/**
 * @description Gruntfile template for managing sites workflow 
 *
 * @copyright Develo Design Ltd. 2014-2015
 * @author Doug Bromley <doug@develodesign.co.uk>
 */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        db: grunt.file.readJSON('localdb.json'),
        /**
         * Edit these values for your project
         */
        namespace: 'PHP LOCAL POOL DIR',
        project: 'PROJECTNAME',
        themePath: 'YOUR/THEME/',
        /**
         * Auto install all bower packages
         */
        auto_install: {
            skin: {
                options: {
                    cwd: 'skin/frontend/<%= project %>/default',
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    npm: false,
                    bower: true
                }
            }
        },
        /**
         * Clean Magento cache
         */
        clean: {
            options: {
                force: true
            },
            cache: {
                src: ['var/cache/*']
            },
            sass: {
                src: ['skin/frontend/<%= project %>/default/.sass-cache/*']
            }
        },
        /**
         * One of th most useful plugins we've used enabling us to 
         * push or pull a Magento database renaming the URL as it goes.
         */
        deployments: {
            options: {
                backups_dir: '../'
            },
            local: {
                'title': 'Local MySQL Server',
                'database': '<%= db.database %>',
                'user': '<%= db.user %>',
                'pass': '<%= db.pass %>',
                'host': '<%= db.host %>',
                'url': '<%= db.url %>'
            },
            remote: {
                'title': 'Staging Server',
                'database': 'REMOTEDB',
                'user': 'REMOTEDBUSER',
                'pass': 'REMOTEDBPASS',
                'host': 'localhost',
                'url': 'REMOTEURL',
                'ssh_host': 'root@ip.address'
            }
        },
        /**
         * Running grunt githooks will insert the phplint and sass 
         * tasks into your Git commint hooks. Very useful to stop you 
         * comitting anything obviously breaking.
         */
        githooks: {
            all: {
                'pre-commit': 'phplint',
                'post-commit': 'sass'
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            grunt: {
                src: 'Gruntfile.js'
            },
            skin: {
                src: [
                    'skin/frontend/<%= project %>/default/js/all.js',
                    'skin/frontend/<%= project %>/default/js/pages/*.js',
                    'skin/frontend/<%= project %>/default/js/plugins/develo-slide-tabs.js',
                ]
            }
        },
        /**
         * Run PHPCS on all local and community extensions
         */
        phpcs: {
            handybrand: {
                dir: ['app/code/local/<%= themePath %>**/*.php']
            },
            develo: {
                dir: ['app/code/local/<%= namespace %>/**/*.php']
            },
            local: {
                dir: ['app/code/local/**/*.php']
            },
            community: {
                dir: ['app/code/community/**/*.php']
            },
            options: {
                bin: '/usr/local/bin/phpcs',
                standard: 'Zend'
            }
        },
        /**
         * Basic PHP lint of all local and community code pools
         */
        phplint: {
            local: {
                files: [{
                    expand: true,
                    cwd: 'app/code/local/',
                    src: ['**/*.php']
                }]
            },
            community: {
                files: [{
                    expand: true,
                    cwd: 'app/code/community/',
                    src: ['**/*.php']
                }]
            },
            design: {
                files: [{
                    expand: true,
                    cwd: 'app/design/frontend/<%= project %>/default/template/',
                    src: ['**/*.phtml']
                }]
            }
        },
        /**
         * Process our Sass files
         */
        sass: {
            dist: {
                files: {
                    'skin/frontend/<%= project %>/default/css/app.css' : 'skin/frontend/<%= project %>/default/scss/app.scss',
                    'skin/frontend/<%= project %>/default/css/checkout.css' : 'skin/frontend/<%= project %>/default/scss/checkout.scss'
                }
            }
        },
        /**
         * As well as having linting built into our IDE's and editors we 
         * have a linter which runs on every default run task.
         */
        scsslint: {
            allFiles: [
                'skin/frontend/<%= project %>/default/scss/*.scss'
            ],
            options: {
                colorizeOutput: true
            }
        },
        /**
         * Processing our Illustrator provided SVGs and placing them in 
         * the correct directory for use
         */
        svgmin: {
            dist: {
                expand: true,
                cwd: 'skin/frontend/<%= project %>/default/images/raw',
                src: ['*.svg'],
                dest: 'skin/frontend/<%= project %>/default/images'
            }
        },
        watch: {
            css: {
                files: 'skin/frontend/<%= project %>/default/scss/**/*.scss',
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-phplint');
    grunt.loadNpmTasks('grunt-phpcs');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-auto-install');
    grunt.loadNpmTasks('grunt-scss-lint');
    grunt.loadNpmTasks('grunt-deployments');

    grunt.registerTask('default', ['sass', 'watch']);
};
