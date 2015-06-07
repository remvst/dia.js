dia.UML = {};

dia.UML.CLASS = new dia.ElementType({
	id: 'uml.class'
});

dia.UML.CLASS.addProperty(new dia.Property({
	id: 'name',
	type: dia.DataType.STRING,
	label: 'Class name',
	description: 'Name of the UML class',
	default: ''
}));

dia.UML.CLASS.addProperty(new dia.Property({
	id: 'attributes',
	type: dia.DataType.STRING_ARRAY,
	label: 'Class attributes',
	description: 'Instance attributes of the UML class',
	default: []
}));

dia.UML.CLASS.addProperty(new dia.Property({
	id: 'methods',
	type: dia.DataType.STRING_ARRAY,
	label: 'Class methods',
	description: 'Instance methods of the UML class',
	default: []
}));
