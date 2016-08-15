var app = angular.module('saguaro', []);

app.controller('MainCtrl', function($scope) {
	var data = [{name:"goodbye"}];
	$.ajax({
		type: 'POST',
		url: '/crud/readvendor',
		data: { 'query': '{}' }, //get all vendors
		dataType: 'JSON',
		success: function(data) {
			console.log(data);
			$scope.items = [{name:"hello"}];
			console.log("msg");
		}
	});
	$scope.items = data;
});


data = {'request': 'update',
		'model':   'vendor',
		'query':   '{}',
		'updated': newVendor}