$(document).ready(function() {

	let usTimeZones = [ "America/Los_Angeles", "America/New_York", "Australia/Melbourne" ];
	let euTimezones = [ "Europe/Paris" ];
	let krTimezones = [ "Asia/Seoul" ];

	$("#region").on("change", async function() {
		let region = $("#region").val();
		console.log(region);

		$("#timezone").empty();
		$("#regionValidation").html("");
			$("#regionValidation").css("css", "green");
		
		if(region == "us") {
			for(let i=0; i < usTimeZones.length; i++)
				$("#timezone").append(`<option value="${usTimeZones[i]}"> ${usTimeZones[i]} </option>`);
		} else if (region == "eu") {
			for(let i=0; i < euTimezones.length; i++)
				$("#timezone").append(`<option value="${euTimezones[i]}"> ${euTimezones[i]} </option>`);
		} else if (region == "kr") {
			for(let i=0; i < krTimezones.length; i++)
				$("#timezone").append(`<option value="${krTimezones[i]}"> ${krTimezones[i]} </option>`);
		} else if (region == "tw") {
			$("#regionValidation").html("Taiwan unavailable for query at this time. Defaulting to US");
			$("#regionValidation").css("color", "red");
			for(let i=0; i < usTimeZones.length; i++)
				$("#timezone").append(`<option value="${usTimeZones[i]}"> ${usTimeZones[i]} </option>`);
		} else if(region == "none") {
			$("#regionValidation").html("A region is required for this query.");
			$("#regionValidation").css("css", "red");
		}
		//console.log(data);
	}); // state

	$("#orderby").on('input', function() {
		
		let fields = [ "namespace", "locale", "status.type", "realms.timezone"];
		let value = $("#orderby").val();

		if(fields.indexOf(value) !== -1) 
		{
			$("#orderbyValidation").html("Valid");
			$("#orderbyValidation").css("color", "green");
		} else 
		{
			$("#orderbyValidation").html("Invalid");
			$("#orderbyValidation").css("color", "red");
		}
	}); 
}); // document ready
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

