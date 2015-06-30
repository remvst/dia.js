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
					'src/dia/math.js',

					'src/dia/core/EventDispatcher.js',
					'src/dia/core/Sheet.js',
					'src/dia/core/Element.js',
					'src/dia/core/ElementType.js',
					'src/dia/core/Property.js',
					'src/dia/core/DataType.js',
					'src/dia/core/ArrayDataType.js',
					'src/dia/core/EnumerationDataType.js',

					'src/dia/graphic/GraphicalRepresentation.js',
					'src/dia/graphic/Renderable.js',
					'src/dia/graphic/Primitive.js',
					'src/dia/graphic/RectanglePrimitive.js',
					'src/dia/graphic/LinePrimitive.js',
					'src/dia/graphic/BrokenLinePrimitive.js',
					'src/dia/graphic/TextPrimitive.js',

					'src/dia/handle/DragHandle.js',
					'src/dia/handle/MoveElementDragHandle.js',
					'src/dia/handle/MoveRelationDragHandle.js',
					'src/dia/handle/MoveAnchorDragHandle.js',
					'src/dia/handle/BrokenLineDragHandle.js',

					'src/dia/area/Area.js',
					'src/dia/area/RectangleArea.js',
					'src/dia/area/CircleArea.js',
					'src/dia/area/LineArea.js',
					'src/dia/area/BrokenLineArea.js',

					'src/dia/ui/InteractionManager.js',
					'src/dia/ui/Dialog.js',
					'src/dia/ui/Canvas.js',
					'src/dia/ui/App.js',
					'src/dia/ui/GUI.js',
					'src/dia/ui/ElementForm.js',

					'src/dia/tool/Toolbox.js',
					'src/dia/tool/Tool.js',
					'src/dia/tool/CreateTool.js',
					'src/dia/tool/SelectionTool.js',

					'src/dia/guide/Guide.js',
					'src/dia/guide/HorizontalGuide.js',
					'src/dia/guide/VerticalGuide.js',

					'src/dia/generic/**.js',
					'src/dia/uml/**.js'
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
			},
			coverage: {
				src: 'dist/dia.js',
				options: {
					specs: ['spec/dia/**.spec.js'],
					template: require('grunt-template-jasmine-istanbul'),
					templateOptions: {
						coverage: 'bin/coverage/coverage.json',
						report: 'bin/coverage',
						thresholds: {
							lines: 75,
							statements: 75,
							branches: 75,
							functions: 90
						}
					}
				}
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	// Default task(s).
	grunt.registerTask('default', ['concat', 'jasmine']);
	grunt.registerTask('test:coverage', ['concat', 'jasmine:coverage']);
};
