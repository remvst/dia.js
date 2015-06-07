function extend(subClass,superClass){
	if(!subClass.extendsClasses || !subClass.extendsClasses[superClass]){
		for(var i in superClass.prototype){
			if(!subClass.prototype[i]){
				subClass.prototype[i] = superClass.prototype[i];
			}
		}
		
		subClass.extendsClasses = subClass.extendsClasses || {};
		subClass.extendsClasses[superClass] = true;
	}
};

function extendPrototype(superClasses,proto){
    superClasses = superClasses instanceof Array ? superClasses : [superClasses];
    //superClasses = [superClasses];
	
	var propStart = '__prop_';
    
	var subProto = {
        superior : {}
    };
    for(var i in superClasses){
        for(var j in superClasses[i].prototype){
			var g = superClasses[i].prototype.__lookupGetter__(j), 
				s = superClasses[i].prototype.__lookupSetter__(j);
			
			var propName = j;
			if(propName.indexOf(propStart) === 0){
				g = superClasses[i].prototype[j].get;
				s = superClasses[i].prototype[j].set;
				propName = j.substr(propStart.length);
			}
       
			if ( g || s ) {
				var prop = {};
				if ( g )
					prop.get = g;
				if ( s )
					prop.set = s;
				Object.defineProperty(subProto,propName,prop);
				subProto[propStart + j] = prop;
			}else{
				subProto[j] = superClasses[i].prototype[j];
				subProto.superior[j] = superClasses[i].prototype[j];
			}
        }
    }
    
    if(proto){
        for(var i in proto){
            subProto[i] = proto[i];
        }
    }
	
	return subProto;
};

function quickImplementation(object,prototype){
    for(var i in prototype){
        object[i] = prototype[i];
    }
    return object;
};

function extendObject(base,additions){
	var res = {};
	for(var i in base){
		res[i] = base[i];
	}
	for(var i in additions){
		res[i] = additions[i];
	}
	return res;
}