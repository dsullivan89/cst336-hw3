$(document).ready(function() {

	$("#submit").click(function(){
		location.assign('/realmlist');
	});

	/*
	httpGet("/realmlist", updateList);
	
	function httpGet(url, callback)
	{
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.states == 200) {
				console.log(xhr.status);
				console.log(xhr.responseText);
				callback(xhr.responseText);
			}};

		xhr.open("GET", url, true);
		xhr.send(null);
	}

	function updateList(data)
	{
		console.log(data);
	}
	*/

}); // document ready