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
					'src/dia/EventDispatcher.js',
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
					'src/dia/Toolbox.js',
					'src/dia/Tool.js',
					'src/dia/CreateTool.js',
					'src/dia/SelectionTool.js',
					'src/dia/EditTool.js',
					'src/dia/Dialog.js',
					'src/dia/Canvas.js',
					'src/dia/App.js',
					'src/dia/ElementForm.js'
				],
			dest: 'dist/<%= pkg.name %>.js'
			}
		},
		jasmine: {
			src: 'dist/dia.js',
			options: {
				vendor: [
					'bower_components/mustache/mustache.js',
					'bower_components/jquery/dist/jquery.js',
					'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
					'bower_components/bootstrap/dist/js/bootstrap.min.js'
			  	],
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
