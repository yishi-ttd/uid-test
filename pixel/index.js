document.addEventListener('DOMContentLoaded', function(){
	var element = document.getElementById("submitBtn");
	element.addEventListener("click",function(e){
		e.preventDefault();
		console.log("click triggered");
	})

	var setIdBtn = document.getElementById("setIdBtn");
	setIdBtn.addEventListener("click",function(e){
		window.ttdPixelEventsLayer  = window.ttdPixelEventsLayer || [];
		window.ttdPixelEventsLayer.push(["identifier", {
			"type":"email",
			"identifier":"1@abc.com"
		}]);
	})
}, false);
