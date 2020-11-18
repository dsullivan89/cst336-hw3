$(document).ready(function() {

	//have to generate a token as they expire in 24 hours
	async function generateToken() {
		let baseURL = "https://us.battle.net/oauth/token";
		let response = await fetch(baseURL,{
			 method:'POST',
			 headers: {
				  'Authorization':'Basic NGY0NDA4NWE5NGNhNDU5ZDlmNjlmZTUwNGMxMTE2Y2Y6SmJHSWxBc253VmpJY2NMRFhlQ2tiQjFDTDk1ZjZnNHk=',
				  'Host':'us.battle.net',
				  'Content-Type':'application/x-www-form-urlencoded',
				  'Accept':'application/json'
			 }, //headers
			 body:"grant_type=client_credentials"
		}); //fetch
		let data = await response.json();
		return data.access_token;
   } //generateToken
	init();

	$("#infoButton").click(function() {
		get_bnetData();
	});

	$("#battlenetLink").click(function() {
		auth_battlenet();
	});

	function auth_battlenet() {
		return new Promise((resolve, reject) => {
			var req = new XMLHttpRequest();
			req.open('GET', '/auth/bnet');
			req.send();
			// req.onload = () => resolve(req.response);
		 });
	}

	function get_bnetData() {
		return new Promise((resolve, reject) => {
		  var req = new XMLHttpRequest();
		  req.open('GET', '/bnet');
		  req.onload = () => resolve(req.response);
		});
	 }
	  // then to get the data, call the function

	 function init() {
		get_bnetData().then((data) => {
			var parsed = JSON.parse(data);
			updateBattleTagDisplay(data.battletag);
			console.log("updated battletag display. can you see it?");
		 });
	 }
	 
	 

	 function updateBattleTagDisplay(battletag) {
		 $("#battletagDisplay").html(battletag);
	 }


}); // document ready