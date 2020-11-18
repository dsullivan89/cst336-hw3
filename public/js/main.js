$(document).ready(function() {

	httpGet("/", updateDispay);
	
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

	function updateDispay(data)
	{
		console.log(data.id);
	}

}); // document ready