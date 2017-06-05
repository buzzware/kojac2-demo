import _ from 'lodash';
import bf from './BuzzFunctions';
//import Can from 'can-namespace';
//import plugin from 'can-construct';
//import can from 'can'
//import can from 'npm:can';

//import KojacObject from './KojacObject';
//import Construct from 'can-construct';
import Construct from 'npm:can-construct';

/**
 * Extends Kojac.Object to support typed attributes
 * @class Kojac.Model
 * @extends Kojac.Object
 **/
var KojacModel = Construct.extend({
	/**
	 * This method is called when inheriting a new model from Kojac.Model, and allows attributes to be defined as
	 *   name: Class (default value is null)
	 * or
	 *   name: default value (class is inferred)
	 * or
	 *   name: [Class,default value]
	 * @param prop Hash of attributes defined as above
	 * @return Hash of attributes in expected name:value format
	 */
	setup: function(prop) {
		this.__attributes = (this._superClass && this._superClass.__attributes && bf.clone(this._superClass.__attributes)) || {};
		//this.__defaults = (constructor.__defaults && _.clone(constructor.__defaults)) || {};
		for (var p in prop) {
			if (['__defaults','__attributes'].indexOf(p)>=0)
				continue;
			var propValue = prop[p];
			if (_.isArray(propValue) && (propValue.length===2) && (KojacModel.FieldTypes.indexOf(propValue[0])>=0)) {  // in form property: [Type, Default Value]
				this.__attributes[p] = propValue[0];
				prop[p] = propValue[1];
			} else if (KojacModel.FieldTypes.indexOf(propValue) >= 0) {   // field type
				prop[p] = null;
				this.__attributes[p] = propValue;
				//this.__defaults[p] = null;
			} else if (_.isFunction(propValue)) {
				continue;
			} else {        // default value
				var i = KojacModel.FieldTypes.indexOf(KojacModel.getPropertyValueType(propValue));
				if (i >= 0) {
					this.__attributes[p] = KojacModel.FieldTypes[i];
				} else {
					this.__attributes[p] = null;
				}
				//this.__defaults[p] = v;
			}
		}
		return [prop];
	},
	/**
	 * The base constructor for Kojac.Model. When creating an instance of a model, an optional hash aValues provides attribute values that override the default values
	 * @param aValues
	 * @constructor
	 */
	init: function(aValues){
		// we don't use base init here
		if (!aValues)
			return;
		for (var p in aValues) {
			if (this.isAttribute(p)) {
				this.attr(p,aValues[p]);
			} else {
				this[p] = aValues[p];
			}
		}
	},

	/**
	 * Determines whether the given name is defined as an attribute in the model definition. Attributes are properties with an additional class and default value
	 * @param aName
	 * @return {Boolean}
	 */
	isAttribute: function(aName) {
		return this.constructor.__attributes && (aName in this.constructor.__attributes);
	},

	/**
	 * Used various ways to access the attributes of a model instance.
	 * 1. attr() returns an object of all attributes and their values
	 * 2. attr(<name>) returns the value of a given attribute
	 * 3. attr(<name>,<value>) sets an attribute to the given value after converting it to the attribute's class
	 * 4. attr({Object}) sets each of the given attributes to the given value after converting to the attribute's class
	 * @param aName
	 * @param aValue
	 * @return {*}
	 */
	attr: function(aName,aValue) {
		if (aName===undefined) {  // read all attributes
			return _.pick(this, _.keys(this.constructor.__attributes));
		} else if (aValue===undefined) {
			if (_.isObject(aName)) {  // write all given attributes
				aValue = aName;
				aName = undefined;
				if (!this.constructor.__attributes)
					return {};
				_.extend(this,_.pick(aValue,_.keys(this.constructor.__attributes)))
			} else {                  // read single attribute
				return (_.has(this.constructor.__attributes,aName) && this[aName]) || undefined;
			}
		} else {  // write single attribute
			var t = this.constructor.__attributes[aName];
			if (t)
				aValue = KojacModel.interpretValueAsType(aValue,t);
			return (this[aName]=aValue);
		}
	}
});

KojacModel.Int = {name: 'Int', toString: function() {return 'Int';}};    // represents a virtual integer type
KojacModel.Null = {name: 'Null', toString: function() {return 'Null';}}; // represents a virtual Null type
KojacModel.FieldTypes = [KojacModel.Null,KojacModel.Int,Number,String,Boolean,Date,Array,Object];  // all possible types for fields in Kojac.Model
KojacModel.FieldTypeStrings = ['Null','Int','Number','String','Boolean','Date','Array','Object'];  // String names for FieldTypes
KojacModel.SimpleTypes = [KojacModel.Null,KojacModel.Int,Number,String,Boolean,Date];  // simple field types in Kojac.Model ie. Object and Array are considered complex

/*
 * Function used to determine the data type class of the given value
 * @param {*} aValue
 * @return {Class} eg. see Kojac.FieldTypes
 */
KojacModel.getPropertyValueType = function(aValue) {
	var t = bf.typeOf(aValue);
	var result;
	switch(t) {
		case 'number':   // determine number or int
			result = (Math.floor(aValue) === aValue) ? KojacModel.Int : Number;
			break;
		default:
		case 'undefined':
		case 'null':
			result = KojacModel.Null;
			break;
		case 'string':
			result = String;
			break;
		case 'boolean':
			result = Boolean;
			break;
		case 'array':
			result = Array;
			break;
		case 'object':
			result = Object;
			break;
		case 'date':
			result = Date;
			break;
		case 'function':
		case 'class':
		case 'instance':
		case 'error':
			result = null;
			break;
	}
	return result;
};


/*
 * Function used to interpret aValue as the given aDestType which is one of the supported data type classes
 * @param {*} aValue any value
 * @param {Class} aDestType Class used to interpret aValue
 * @return {*} aValue interpreted as destination type
 */
KojacModel.interpretValueAsType = function(aValue, aDestType) {
	var sourceType = KojacModel.getPropertyValueType(aValue);
	if (aDestType===sourceType)
		return aValue;
	switch (aDestType) {
		case KojacModel.Null:
			return aValue;
		case String:

			switch(sourceType) {
				case KojacModel.Int:
				case Number:
				case Boolean:
					return aValue.toString();
					break;
				case Date:
					var d = Date.parse(aValue);
					return d.toISOString();
				default:
				case KojacModel.Null:
					return null;
					break;
			}

			break;
		case Boolean:
			return _.toBoolean(aValue,null);
			break;

		case Number:

			switch(sourceType) {
				case KojacModel.Null:
				default:
					return null;
					break;
				case Boolean:
					return aValue ? 1 : 0;
					break;
				case KojacModel.Int:
					return aValue;
					break;
				case String:
					if (aValue.trim()=='')
						return null;
					var n = Number(aValue);
					return isFinite(n) ? n : null;
					break;
			}
			break;

		case KojacModel.Int:

			switch(sourceType) {
				case KojacModel.Null:
				default:
					return null;
					break;
				case Boolean:
					return aValue ? 1 : 0;
					break;
				case Number:
					return isFinite(aValue) ? Math.round(aValue) : null;
					break;
				case String:
					if (aValue.trim()=='')
						return null;
					var nv = Number(aValue);
					return isFinite(nv) ? Math.round(nv) : null;
					break;
			}

			break;
		case Date:
			switch(sourceType) {
				case String:
					return Date.parse(aValue);
					break;
				case Number:
					return new Date(aValue);
					break;
				case KojacModel.Null:
				default:
					return null;
					break;
			}
			break;
		case Object:
			return null;
			break;
		case Array:
			return null;
			break;
	}
	return null;
};


export default KojacModel;
