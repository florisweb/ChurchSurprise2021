<!DOCTYPE html>
<html>
	<head>
		<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' name='viewport'/>
		<title>Jasmijns fantastische superquirky surprise</title>
		<style>
			body {
				position: fixed;
				margin: none;
				padding: none;
				background: #000;
				height: 100vh;
				overflow: hidden;
			}

			canvas {
				position: fixed;
				left:  0;
				top: 0;
			}
			
			.noselect {
			  -webkit-touch-callout: none; /* iOS Safari */
			    -webkit-user-select: none; /* Safari */
			     -khtml-user-select: none; /* Konqueror HTML */
			       -moz-user-select: none; /* Firefox */
			        -ms-user-select: none; /* Internet Explorer/Edge */
			            user-select: none; /* Non-prefixed version, currently
			                                  supported by Chrome and Opera */
			}


			.crossair {
				position: fixed;
				left: calc(50vw - 2px);
				top: calc(50vh - 2px);
				width: 4px;
				height: 4px;
				background: rgba(200, 200, 200, .9);
				z-index: 1000000;
			}

			.text {
				font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
				color: #777;
				font-size: 15px;
			}
			.text.header {
				font-size: 25px;
			}

			.overlayPage {
				position: fixed;
				width: 100vw;
				height: 110vh;
				left:  0;
				top:  0;
				background: #fff;
				transition: all .3s;
				z-index: 1000001;				
			}
			.overlayPage .text {
				position: relative;
				text-align: center;
				width:  100%;
				top:  45vh;
				transform: translateY(-50%);
			}
			.overlayPage.hide {
				transform: scale(1.2);
				opacity: 0;
				pointer-events: none;
			}

			#aLittleEarlyMessage.overlayPage {
				background: #fff;
			}




			#callOverlay.overlay {
				position: fixed;	
				top:  0;
				right: 0;
				padding:  20px;
				width: 300px;
				height: 100vh;
				z-index: 10000;
			}

			#callOverlay.overlay .specialPanel.panel {
				height: 40px;
				padding: 15px 20px;
			}
			#callOverlay.overlay #callIndicator.panel:not(.hide) {
				animation: callOverlay_beingCalled .7s infinite;
			}

			@keyframes callOverlay_beingCalled {
			    0% {
			        left: 0;
			    }
			    25% {
			        left: 0;
			    }
			    33% {
			        left: -3%;
			    }
			    41% {
			        left: 3%;
			    }
			 
			    50% {
			       left: 0;
			    }
			    100% {
			       left: 0;
			    }
			}


			#callOverlay.overlay .panel.specialPanel .icon {
				float: left;
				padding: 10px;
				border-radius: 10px;
				width: 25px;
				height: auto;
			}
			#callOverlay.overlay #callIndicator.panel.specialPanel .icon {
				background: rgb(100, 210, 100);
			}
			#callOverlay.overlay #cookIndicator.panel.specialPanel .icon {
				background: rgb(241, 153, 55);	
				padding: 5px;
				width: 35px;
			}
			#callOverlay.overlay .panel.specialPanel .text.header {
				float: left;
				height: 45px;
				line-height: 45px;
				margin-left: 15px;
				font-size: 16px;
			}


			#callOverlay.overlay .panel {
				position: relative;
				padding: 20px;
				width: calc(100% - 20px * 2);
				height: auto;
				background: rgb(250, 250, 250);
				box-shadow: 5px 5px 20px 10px rgba(0, 0, 0, .1);
				margin-bottom: 20px;
				transition: all .3s;
			}
			#callOverlay.overlay .panel.hide {;
				transform: scale(.8) translateX(50px);
				opacity: 0;
				pointer-events: none;
			}
			#callOverlay.overlay .panel.specialPanel.hide {
				margin-top: -85px;
				transform: none;
				opacity: 0;
				pointer-events: none;
			}

			#callOverlay.overlay .panel.buyer {
				background: rgb(100, 210, 100);
			}
			#callOverlay.overlay .panel.buyer .text {
				color:  #fff;
			}

			#callOverlay.overlay .panel .header {
				font-weight: bolder;
				font-size: 12px;
				margin-bottom: 5px;
			}
		</style>
	</head>
	<body class='noselect'>
		<div class='overlay' id='callOverlay'>
			<div class="panel specialPanel" id='callIndicator'>
				<img src='images/phoneIcon.png' class='icon'>
				<div class='text header'>Incoming call...</div>
			</div>
			<div class="panel hide specialPanel" id='cookIndicator'>
				<img src='images/cookIcon.png' class='icon'>
				<div class='text header'>4 x Bibimbap: 15 min</div>
			</div>
			<div class="panel hide">
				<div class='text header'>Le restaurant de Jasmin </div>
				<div class='text'>Goedenavond, u spreekt met Jasmijns 10/10 restaurant, waar kan ik u mee helpen?</div>
			</div>
			<div class="panel buyer hide">
				<div class='text header'>+06 12345678</div>
				<div class='text'>Wij zouden graag 4 x Bibimbap bestellen, kan dat?</div>
			</div>
			<div class="panel hide">
				<div class='text header'>Le restaurant de Jasmin </div>
				<div class='text'>Uiteraard, 4 x Bibimbap staat over 15 minuten voor u klaar. Wilt u het laten bezorgen of afhalen?</div>
			</div>
			<div class="panel buyer hide">
				<div class='text header'>+06 12345678</div>
				<div class='text'>Ik kom het ophalen, tot zo.</div>
			</div>
		</div>

		<script>
			const CallManager = new function() {
				let finished = false;
				this.showNextMessage = function() {
					if (finished) return;
					let message = document.querySelector('#callOverlay .panel.hide:not(#callIndicator, #cookIndicator)');
					if (!message) 
					{
						for (let element of document.querySelectorAll("#callOverlay .panel")) element.classList.add('hide');
						finished = true;
						return cookIndicator.classList.remove('hide');
					}
					message.classList.remove('hide');
					setTimeout(CallManager.showNextMessage, 1000 * 5);
				}

				this.startCall = function() {
					let callIndicator = document.querySelector('#callOverlay #callIndicator.panel');
					callIndicator.classList.add('hide');
					setTimeout(CallManager.showNextMessage, 1000);
				}
			}
			
		</script>


		<div class='overlayPage' id='clickToStart'>
			<div class='text header'>Click to Enter</div>
			<div class='text'>Welkom in Jasmijns (Quirky) Wereld</div>
		</div>
		<div class='overlayPage' id='aLittleEarlyMessage'>
			<div class='text header'>Hey there</div>
			<div class='text'>A little early don't you think?</div>
		</div>
		<script>
			if ((new Date().getFullYear() == 2022 && new Date().getHours() >= 20) || localStorage.aLittleEarlyMessageSupressor)
			{
				aLittleEarlyMessage.classList.add('hide');
			}
		</script>





		<div class='crossair'></div>
		<script src='js/three.js'></script>
		<script src='js/controls/deviceOrientationControls.js'></script>
		<script src='js/controls/mouseControls.js'></script>

		<script src='js/perlin.js'></script>
		<script src='js/vector.js'></script>

		<script src='js/mapData.js'></script>
		<script src='js/inputHandler.js'></script>
		<script src='js/worldGenerator.js'></script>
		<script src='js/world.js'></script>
		<script src='js/camera.js'></script>
		<script src='js/main.js'></script>
	</body>
</html>
