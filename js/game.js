const CallManager = new function() {
	let started = false;
	this.showNextMessage = function() {

		let message = document.querySelector('#callOverlay .panel.hide:not(#callIndicator, #cookIndicator)');
		if (!message) 
		{
			for (let element of document.querySelectorAll("#callOverlay .panel")) element.classList.add('hide');
			return cookIndicator.classList.remove('hide');
		}
		message.classList.remove('hide');
		setTimeout(CallManager.showNextMessage, 1000 * 5);
	}

	this.startCall = function() {
		if (started) return;
		started = true;
		let callIndicator = document.querySelector('#callOverlay #callIndicator.panel');
		callIndicator.classList.add('hide');
		setTimeout(CallManager.showNextMessage, 1000);
	}
}













