angular.module('starter.controllers', [])

.controller('homeCtrl', function($scope, $ionicModal, $timeout, $cordovaGeolocation, $http) {
	var map = {};
	var posOptions = {timeout: 10000, enableHighAccuracy: true};
	
	function getPlaces(http, pos) {
		var url = 'https://api.foursquare.com/v2/venues/search?client_id=FUZ3URZEP1H43O4SS3XRADFGJIOE2HWY3JVZASKUTHBVYRRI&client_secret=PJE0R5WD5BTZUBPOWKDAOE5JDSQ20U4Z44US4S1DHRRQUYXI&v= 20140806&m=foursquare&categoryId=4bf58dd8d48988d181941735&radius:5000';
		
		url += '&ll=' + pos.latitude + ',' + pos.longitude;
		
		return http.get(url);
		
	}
	
	function parseFsJson(json) {
		var result = [];
		
		for(var i in json.response.venues) {
			var newPlace = {};
			newPlace.name = json.response.venues[i].name;
			newPlace.id = json.response.venues[i].id;
			newPlace.lat = json.response.venues[i].location.lat;
			newPlace.lng = json.response.venues[i].location.lng;
			newPlace.address = json.response.venues[i].location.formattedAddress;
			
			var cat = json.response.venues[i].categories[0];
			
			if(cat) {
				if(cat.name.toUpperCase() === 'OFFICE') {
					continue;
				}
			} else {
				cat = 'Unknown';
			}
			
			
			newPlace.cat = cat.name;
			newPlace.checkinsCount = json.response.venues[i].stats.checkinsCount;
			result.push(newPlace);
		}
		
		var maxcheckin = 0;
		for(var i in result) {
			
			if(result[i].checkinsCount > maxcheckin) {
				maxcheckin = result[i].checkinsCount;
			}
		}
		
		var hotness = maxcheckin - (maxcheckin*0.8);
		var good = maxcheckin - (maxcheckin * 0.2);
		
		for(var i in result) {
			
			if(result[i].checkinsCount > hotness) {
				result[i].icon = '../img/hot.png';
			} else if(result[i].checkinsCount > good) {
				result[i].icon = '../img/good.png';
			} else {
				result[i].icon = '../img/dull.png';
			}
		}
		
		console.log(result);
		return result;
		
	}
	
	$cordovaGeolocation.getCurrentPosition(posOptions).then(function(data) {
		$scope.coOrdns = data.coords;
		console.log(data.coords);
		// var mapOptions = {
		// 	center: new google.maps.LatLng(data.coords.latitude, data.coords.longitude),
		// 	zoom: 18,
		// 	mapTypeId: google.maps.MapTypeId.ROADMAP
		// };
		// var map = new google.maps.Map(document.getElementById("map"), mapOptions);
		// addMarker(map, {
		// 	pos: new google.maps.LatLng($scope.coOrdns.latitude, $scope.coOrdns.longitude),
		// 	title: 'Your location'
		// });
		
		getPlaces($http, data.coords).
		success(function(data, status, headers, config) {
			// // this callback will be called asynchronously
			// // when the response is available
			// var result = parseFsJson(data);
			// for(var i in result) {
			// 	var marker = addMarker(map, {
			// 		pos: new google.maps.LatLng(result[i].lat, result[i].lng),
			// 		title: result[i].name,
			// 		icon: result[i].icon
			// 	});
			// 	google.maps.event.addListener(marker, 'click', function(e) {
			// 		showDetails(result, e, ngDialog, $rootScope);
			// 	});
			// }
			console.log('co ords', data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.error('ERRRROR');
		});
		
	}, function(err) {
		console.log(err);
	});
	
});