var app = angular.module('saguaro', []);

app.controller('MainCtrl', function($scope) {
	//var data = [{name:"goodbye"}];
	$.ajax({
		type: 'GET',
		url: '/users',
		data: {
				"name": "charlie"
			  },
		dataType: 'JSON',
		success: function(data) {
			console.log(data);
			//$scope.items = [{name:"hello"}];
		}
	});
	//$scope.items = data;
});
