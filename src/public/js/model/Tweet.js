/**
 *  Tweet Model
 *  Creates additional 'country'
 */
define(
	['backbone'], 
	function(Backbone) {

		return Backbone.Model.extend({

            idAttribute : '_id',

            url : function() {
                return '/' + this.id
            }

		});

	});