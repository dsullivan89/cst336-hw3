$(document).ready(function() {

	
	function httpGet(url, callback)
	{
		url = "/initialData";

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

}); // document ready