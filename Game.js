import * as THREE from './three.module.js'
import { Easing, Tween, TweenManager } from './Tween.js'
import { OrbitControls } from './OrbitControls.js'
export class Game {
	constructor() {
		this.scene = new THREE.Scene()
		const fieldOfView = 70
		this.windowSize = {
			width: window.innerWidth,
			height: window.innerHeight
		}
		const aspectRatio = this.windowSize.width / this.windowSize.height
		const near = 0.1
		const far = 100
		this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, near, far)
		// this.camera = new THREE.OrthographicCamera(-3 * aspectRatio, 3 * aspectRatio, 3, -3, 1, 10)
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
		})
		this.renderer.setPixelRatio(window.devicePixelRatio)

		this.renderer.setSize(this.windowSize.width, this.windowSize.height)
		this.renderer.setAnimationLoop(this.animationLoop.bind(this));
		document.body.appendChild(this.renderer.domElement);
		window.addEventListener('resize', this.resize.bind(this))
		window.addEventListener('mousemove', this.onMouseMove.bind(this))
		window.addEventListener('keyup', this.onKeyUp.bind(this))
		window.addEventListener('dblclick', this.onDoubleClick.bind(this))
		this.lastTime = 0

		this.tweenManager = new TweenManager()
		this.isSpinning = false
		this.spinClock = new THREE.Clock()
		this.cursor = new THREE.Vector2()
		this.axesHelper = new THREE.AxesHelper()
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
	}
	setup() {
		const group = new THREE.Group()

		const cube1 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 'lime' })
		)
		cube1.position.set(-1.5, 0, 0)

		const cube2 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 'crimson' })
		)
		cube2.position.set(0, 0, 0)

		const cube3 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 'cornflowerblue' })
		)
		cube3.position.set(1.5, 0, 0)

		//group.add(cube1)
		group.add(cube2)
		//group.add(cube3)
		group.position.set(0, 0, 0)
		group.scale.set(1, 1, 1)
		this.group = group
		this.scene.add(group)

		// this.scene.add(this.axesHelper)

		this.camera.position.set(0, 0, 5)
		// this.camera.lookAt(group.position)
		this.controls.enableDamping = true
		this.controls.target = group.position


		this.scene.add(this.camera)
		// setTimeout(() => {
		// this.tweenManager.add(new Tween(this.group.position, { x: 5 }, 2000, Easing.Elastic.EaseOut, () => {
		// 	this.tweenManager.add(new Tween(this.group.position, { x: 0 }, 2000, Easing.Back.EaseOut, () => {
		// 		this.isSpinning = true
		// 		this.spinClock.start()
		// 	}))
		// }))
		// }, 1000)
		this.spinClock.stop()
	}

	animationLoop(time) {
		let delta = time - this.lastTime
		this.update(time, delta)
		this.lastTime = time
		this.draw()
	}

	update(time, delta) {
		// if (this.isSpinning) {
		// this.group.rotation.y += 0.001 * delta
		// this.group.position.y = 0.5 * Math.sin(2 * this.spinClock.getElapsedTime()) - 1
		// }
		// this.camera.lookAt(8 * this.cursor.x, -8 * this.cursor.y, 0)

		// this.camera.position.x = 4 * Math.cos(Math.PI * this.cursor.x)
		// this.camera.position.z = 4 * Math.sin(Math.PI * this.cursor.x)
		// this.camera.position.y = 2 * Math.sin(Math.PI * this.cursor.y)

		this.group.rotation.y = this.spinClock.getElapsedTime()

		// this.camera.lookAt(this.axesHelper.position)
		this.controls.update()
		this.tweenManager.update()
	}

	draw() {
		this.renderer.render(this.scene, this.camera)
	}

	resize() {
		this.windowSize.width = window.innerWidth
		this.windowSize.height = window.innerHeight

		this.camera.aspect = this.windowSize.width / this.windowSize.height
		this.camera.updateProjectionMatrix()

		this.renderer.setSize(this.windowSize.width, this.windowSize.height)
	}

	onMouseMove(event) {
		// this.cursor.x = event.clientX / this.windowSize.width - 0.5
		// this.cursor.y = event.clientY / this.windowSize.height - 0.5
	}

	onKeyUp(event) {
		switch (event.code) {
			case "KeyS":
				if (this.spinClock.running) {
					this.spinClock.stop()
				} else {
					this.spinClock.start()
				}
				break
			case "KeyF":
				if (!window.getFullscreenElement()) {
					window.requestFullscreen(this.renderer.domElement)
				} else {
					window.exitFullscreen()
				}
				break
		}
	}

	onDoubleClick(event) {
		if (!window.getFullscreenElement()) {
			window.requestFullscreen(this.renderer.domElement)
		} else {
			window.exitFullscreen()
		}

	}
}