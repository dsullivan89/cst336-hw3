$(document).ready(function() {

	init();

	function get() {
		return new Promise((resolve, reject) => {
		  var req = new XMLHttpRequest();
		  req.open('GET', '/bnet');
		  req.onload = () => resolve(req.response);
		});
	 }           
	  // then to get the data, call the function

	 function init() {
		get().then((data) => {
			var parsed = JSON.parse(data);
			updateBattleTagDisplay(data.battletag);
			console.log("updated battletag display. can you see it?");
		 });
	 }
	 
	 

	 function updateBattleTagDisplay(battletag) {
		 $("#battletagDisplay").html(battletag);
	 }


}); // document ready