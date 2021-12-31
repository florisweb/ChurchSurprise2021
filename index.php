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


			.pageOverlay {
				position: fixed;
				width: 100vw;
				height: 110vh;
				left:  0;
				top:  0;
				background: rgba(255, 255, 255, .3);
				transition: all .3s;
				z-index: 1000001;				
			}
			.pageOverlay .text {
				position: relative;
				text-align: center;
				width:  100%;
				top:  45vh;
				transform: translateY(-50%);
			}
			.pageOverlay.hide {
				transform: scale(1.2);
				opacity: 0;
				pointer-events: none;
			}

			#aLittleEarlyMessage.pageOverlay {
				background: #fff;
			}

		</style>
	</head>
	<body class='noselect'>
		<div class='pageOverlay' id='clickToStart'>
			<div class='text header'>Click to Enter</div>
			<div class='text'>Welkom in Jasmijns (Quirky) Wereld</div>
		</div>
		<div class='pageOverlay' id='aLittleEarlyMessage'>
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
