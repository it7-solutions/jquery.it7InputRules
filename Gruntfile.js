module.exports = function(grunt) {
	grunt.initConfig({
		qunit: {
			all: {
				options: {
					urls: ['tests/index.html'],
					noGlobals: true
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-qunit');

	grunt.registerTask('test', [
		'qunit'
	]);
};