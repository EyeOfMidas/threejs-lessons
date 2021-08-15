import * as THREE from './three.module.js'
import { Easing, Tween, TweenManager } from './Tween.js'
export class Game {
	constructor() {
		this.scene = new THREE.Scene()
		const fieldOfView = 70
		this.windowSize = {
			width: window.innerWidth,
			height: window.innerHeight
		}
		const aspectRatio = this.windowSize.width / this.windowSize.height
		this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio)
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
		})

		this.renderer.setSize(this.windowSize.width, this.windowSize.height)
		this.renderer.setAnimationLoop(this.animationLoop.bind(this));
		document.body.appendChild(this.renderer.domElement);
		window.addEventListener('resize', this.resize.bind(this))
		this.lastTime = 0

		this.tweenManager = new TweenManager()
		this.isSpinning = false
		this.spinClock = new THREE.Clock()
	}
	setup() {
		const group = new THREE.Group()

		const cube1 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 'crimson' })
		)
		cube1.position.set(-1.5, 0, 0)

		const cube2 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 'lime' })
		)
		cube2.position.set(0, 0, 0)

		const cube3 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 'cornflowerblue' })
		)
		cube3.position.set(1.5, 0, 0)

		group.add(cube1)
		group.add(cube2)
		group.add(cube3)
		group.position.set(0.6, -1, 0)
		group.scale.set(1, 1, 1)
		this.group = group
		this.scene.add(group)

		const axesHelper = new THREE.AxesHelper()
		this.scene.add(axesHelper)

		this.camera.position.set(0.5, 0.5, 5)
		this.camera.lookAt(this.group.position)

		this.scene.add(this.camera)
		setTimeout(() => {
		this.tweenManager.add(new Tween(this.group.position, { x: 5 }, 2000, Easing.Elastic.EaseOut, () => {
			this.tweenManager.add(new Tween(this.group.position, { x: 0 }, 2000, Easing.Back.EaseOut, () => {
				this.isSpinning = true
				this.spinClock.start()
			}))
		}))
		}, 3000)
	}

	animationLoop(time) {
		let delta = time - this.lastTime
		this.update(time, delta)
		this.lastTime = time
		this.draw()
	}

	update(time, delta) {
		if (this.isSpinning) {
			this.group.rotation.y += 0.001 * delta
			this.group.position.y = 0.5 * Math.sin(2 * this.spinClock.getElapsedTime()) - 1
		}
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
}