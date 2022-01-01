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

const Game = new function() {
	this.furnace = new function() {
		
	}
	this.fridge;

	this.inventory = new Inventory();
}




function Inventory() {
	this.curItem = false;
	this.setItem = function(_item) {
		if (this.curItem) return false;
		this.curItem = _item;
	}

	this.dropItem = function() {
		if (!this.curItem) return;
		this.curItem.drop();
		this.clearItem();
	}
	this.clearItem = function() {
		this.curItem = false;
	}

	this.clickOnPan = function(_pan) {
		switch (_pan.id)
		{
			case Game.furnace.ricePan.id:
				if (this.curItem.name != RiceItem.name) return;
				this.clearItem();
				_pan.setContentHeight(.7);
				_pan.setContentMaterial(customMaterials.waterRiceTexture);
			break;
		}

	}
}










