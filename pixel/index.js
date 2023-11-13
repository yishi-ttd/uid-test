document.addEventListener('DOMContentLoaded', function(){
	var element = document.getElementById("submitBtn");
	element.addEventListener("click",function(e){
		e.preventDefault();
		console.log("click triggered");
	})
}, false);
