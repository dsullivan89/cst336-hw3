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
		// do something with the data
	 });

	 function updateBattleTagDisplay(battleTag) {
		 $("#battletagDisplay").html(battleTag);
	 }


}); // document ready