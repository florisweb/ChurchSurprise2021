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

		</style>
	</head>
	<body class='noselect'>
	

		
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
