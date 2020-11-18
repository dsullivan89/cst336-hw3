$(document).ready(function() {

	function get() {
		return new Promise((resolve, reject) => {
		  var req = new XMLHttpRequest();
		  req.open('GET', '/data');
		  req.onload = () => resolve(req.response);
		});
	 }           
	  // then to get the data, call the function
	 
	 get().then((data) => {
		var parsed = JSON.parse(data);
		updateBattleTagDisplay(data.battletag);
	 });

	 function updateBattleTagDisplay(battletag) {
		 $("#battletagDisplay").html(battletag);
	 }


}); // document ready