(function () {
	let requestFullscreen = (element) => {
		element.requestFullscreen = element.requestFullscreen || element.webkitRequestFullscreen
		element.requestFullscreen()
	}
	let getFullscreenElement = () => {
		return window.document.fullscreenElement || window.document.webkitFullscreenElement
	}
	window.exitFullscreen = () => {
		if (document.exitFullscreen) {
			document.exitFullscreen()
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen()
		}
	}
	window.requestFullscreen = requestFullscreen
	window.getFullscreenElement = getFullscreenElement

})()