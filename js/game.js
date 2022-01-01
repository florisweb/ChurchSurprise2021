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
	this.drawer1;
	this.drawer2;


	this.inventory = new Inventory();
	this.finish = function() {
		finishPage.classList.remove('hide');
	}
}




function Inventory() {
	this.curItem = false;
	this.setItem = function(_item) {
		if (this.curItem) this.dropItem();
		this.curItem = _item;
		this.updateItem();
	}

	this.dropItem = function() {
		if (!this.curItem) return;
		this.curItem.drop();
		this.clearItem();
	}
	this.clearItem = function() {
		this.curItem = false;
		this.updateItem();
	}
	let riceStarted = false;
	this.clickOnPan = function(_pan) {
		switch (_pan.id)
		{
			case Game.furnace.ricePan.id:
				if (this.curItem.name != RiceItem.name) return;
				this.clearItem();
				_pan.setContentHeight(.7);
				_pan.setContentMaterial(customMaterials.waterRiceTexture);
				riceStarted = true;
				if (Game.furnace.wokPan.orderIndex == 3) setTimeout(Game.finish, 1000 * 3);
			break;
			case Game.furnace.wokPan.id:
				switch (Game.furnace.wokPan.orderIndex)
				{
					case 1: 
						if (this.curItem.name != GehaktItem.name) return;
						this.clearItem();
						_pan.setContentHeight(.5);
						Game.furnace.wokPan.orderIndex = 2;
						_pan.setContentMaterial(customMaterials.wokPanState2);
					break;
					case 2: 
						if (this.curItem.name != ChampignonItem.name) return;
						this.clearItem();
						_pan.setContentHeight(.7);
						Game.furnace.wokPan.orderIndex = 3;
						if (riceStarted) setTimeout(Game.finish, 1000 * 3);
						_pan.setContentMaterial(customMaterials.wokPanState3);
					break;

					default: 
						if (this.curItem.name != CourgetteItem.name) return;
						this.clearItem();
						_pan.setContentHeight(.3);
						Game.furnace.wokPan.orderIndex = 1;
						_pan.setContentMaterial(customMaterials.wokPanState1);
					break;
				}
			
				


				if (this.curItem.name != RiceItem.name) return;
				this.clearItem();
				_pan.setContentHeight(.7);
				_pan.setContentMaterial(customMaterials.waterRiceTexture);
			break;
		}
	}

	this.updateItem = function() {
		let html = document.querySelector('#inventoryOverlay .itemImage');
		let src = '';
		html.style.display = 'none';
		
		if (this.curItem) 
		{
			src = this.curItem.itemIconUrl;
			html.style.display = 'block';
		}
		html.setAttribute('src', src);
	}
}










