module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
				src: [
					'src/dia/start.js',
					'src/dia/uuid4.js',
					'src/dia/extend.js',
					'src/dia/Sheet.js',
					'src/dia/Element.js',
					'src/dia/ElementType.js',
					'src/dia/Property.js',
					'src/dia/DataType.js',
					'src/dia/GraphicalRepresentation.js',
					'src/dia/Primitive.js',
					'src/dia/RectanglePrimitive.js',
					'src/dia/Generic.js'
				],
			dest: 'dist/<%= pkg.name %>.js'
			}
		},
		jasmine: {
			src: 'dist/dia.js',
			options: {
				specs: 'spec/**/**.spec.js'
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	// Default task(s).
	grunt.registerTask('default', ['concat', 'jasmine']);
};
