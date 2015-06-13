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
					'src/dia/ArrayDataType.js',
					'src/dia/GraphicalRepresentation.js',
					'src/dia/Renderable.js',
					'src/dia/Primitive.js',
					'src/dia/RectanglePrimitive.js',
					'src/dia/LinePrimitive.js',
					'src/dia/BrokenLinePrimitive.js',
					'src/dia/TextPrimitive.js',
					'src/dia/Generic.js',
					'src/dia/DragHandle.js',
					'src/dia/MoveElementDragHandle.js',
					'src/dia/Area.js',
					'src/dia/RectangleArea.js',
					'src/dia/InteractionManager.js',
					'src/dia/Tool.js',
					'src/dia/CreateTool.js',
					'src/dia/SelectionTool.js',
					'src/dia/EditTool.js',
					'src/dia/ElementForm.js'
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
