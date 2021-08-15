export class TweenManager {
	constructor() {
		this.clear()
	}

	add(tween) {
		tween.setId(this.tweenIdIndex++)
		this.activeTweens.push(tween);
		return tween.getId();
	}

	remove(tween) {
		this.activeTweens.splice(this.activeTweens.findIndex(t => t == tween), 1);
	}

	cancel(tweenId) {
		let tweenIndex = this.activeTweens.findIndex(t => t.getId() == tweenId);
		if(tweenIndex != -1) {
			this.activeTweens.splice(tweenIndex, 1)
		}
	}

	update() {
		let completedTweens = [];
		for(let i = 0; i < this.activeTweens.length; i++) {
			let tween = this.activeTweens[i];
			tween.update();
			if(tween.isComplete()) {
				completedTweens.push(tween);
			}
		}


		for(let i = 0; i < completedTweens.length; i++) {
			let tween = completedTweens[i];
			tween.onFinish();
			this.remove(tween);
		}
	}

	clear() {
		this.activeTweens = [];
		this.tweenIdIndex = 0;
	}
}

export class Tween {
	constructor(objToTween, targetProperties, duration, easing = Easing.Linear.EaseNone, onFinish = () => {}) {
		this.objectToTween = objToTween;
		this.startProperties = {};
		this.targetProperties = targetProperties;
		this.saveInitialValues(this.startProperties, objToTween, targetProperties);
		this.startTime = new Date().getTime()
		this.endTime = this.startTime + duration
		this.easing = easing;
		this.onFinish = onFinish;
		this.id = -1;
	}

	saveInitialValues(propertiesObj, obj, targetProperties) {
		for(let property in targetProperties) {
			let startValue = obj[property];
			if(typeof startValue == "object") {
				propertiesObj[property] = {};
				this.saveInitialValues(propertiesObj[property], obj[property], targetProperties[property]);
				continue;
			}
			propertiesObj[property] = startValue;
		}
	}

	update() {
		let currentTime = new Date().getTime();
		let runTime = currentTime - this.startTime;
		let duration = this.endTime - this.startTime;
		let percentageComplete = Math.min(1, runTime / duration);
		let valueToUpdate = this.easing(percentageComplete);
		this.updateProperties(this.objectToTween, this.startProperties, this.targetProperties, valueToUpdate);
	}

	updateProperties(obj, objStart, objTarget, valueToUpdate) {
		for(let property in objStart) {
			let startValue = objStart[property];
			if(typeof startValue == "object") {
				this.updateProperties(obj[property], objStart[property], objTarget[property], valueToUpdate);
				continue;
			}
			let endValue = objTarget[property];
			let delta = endValue - startValue;
			obj[property] = startValue + (delta * valueToUpdate);
		}
	}

	setId(newId){
		this.id = newId
	}

	getId() {
		return this.id
	}

	isComplete() {
		return this.endTime <= new Date().getTime()
	}
}

export class Easing {}

Easing.Linear = {};
Easing.Linear.EaseNone = (percentageComplete) => percentageComplete;

Easing.Quadratic = {};
Easing.Quadratic.EaseIn = (percentageComplete) => percentageComplete * percentageComplete;
Easing.Quadratic.EaseOut = (percentageComplete) => -percentageComplete * ( percentageComplete - 2 );
Easing.Quadratic.EaseInOut = (percentageComplete) => {
	if ( ( percentageComplete *= 2 ) < 1 ) return 0.5 * percentageComplete * percentageComplete;
	return - 0.5 * ( --percentageComplete * ( percentageComplete - 2 ) - 1 );
};
Easing.Cubic = {};
Easing.Cubic.EaseIn = (percentageComplete) => percentageComplete * percentageComplete * percentageComplete;
Easing.Cubic.EaseOut = (percentageComplete) => --percentageComplete * percentageComplete * percentageComplete + 1;
Easing.Cubic.EaseInOut = (percentageComplete) => {
	if ( ( percentageComplete *= 2 ) < 1 ) return 0.5 * percentageComplete * percentageComplete * percentageComplete;
	return 0.5 * ( ( percentageComplete -= 2 ) * percentageComplete * percentageComplete + 2 );
};
Easing.Quartic = {};
Easing.Quartic.EaseIn = (percentageComplete) => percentageComplete * percentageComplete * percentageComplete * percentageComplete;
Easing.Quartic.EaseOut = (percentageComplete) => -( --percentageComplete * percentageComplete * percentageComplete * percentageComplete - 1 );
Easing.Quartic.EaseInOut = (percentageComplete) => {
	if ( ( percentageComplete *= 2 ) < 1) return 0.5 * percentageComplete * percentageComplete * percentageComplete * percentageComplete;
	return - 0.5 * ( ( percentageComplete -= 2 ) * percentageComplete * percentageComplete * percentageComplete - 2 );
};
Easing.Quintic = {};
Easing.Quintic.EaseIn = (percentageComplete) => percentageComplete * percentageComplete * percentageComplete * percentageComplete * percentageComplete;
Easing.Quintic.EaseOut = (percentageComplete) => ( percentageComplete = percentageComplete - 1 ) * percentageComplete * percentageComplete * percentageComplete * percentageComplete + 1;
Easing.Quintic.EaseInOut = (percentageComplete) => {
	if ( ( percentageComplete *= 2 ) < 1 ) return 0.5 * percentageComplete * percentageComplete * percentageComplete * percentageComplete * percentageComplete;
	return 0.5 * ( ( percentageComplete -= 2 ) * percentageComplete * percentageComplete * percentageComplete * percentageComplete + 2 );
};
Easing.Sinusoidal = {};
Easing.Sinusoidal.EaseIn = (percentageComplete) => -Math.cos( percentageComplete * Math.PI / 2 ) + 1;
Easing.Sinusoidal.EaseOut = (percentageComplete) => Math.sin( percentageComplete * Math.PI / 2 );
Easing.Sinusoidal.EaseInOut = (percentageComplete) => -0.5 * ( Math.cos( Math.PI * percentageComplete ) - 1 );
Easing.Exponential = {};
Easing.Exponential.EaseIn = (percentageComplete) => {
	return percentageComplete == 0 ? 0 : Math.pow( 2, 10 * ( percentageComplete - 1 ) );
};

Easing.Exponential.EaseOut = (percentageComplete) => {
	return percentageComplete == 1 ? 1 : - Math.pow( 2, - 10 * percentageComplete ) + 1;
};

Easing.Exponential.EaseInOut = (percentageComplete) => {
	if ( percentageComplete == 0 ) return 0;
	if ( percentageComplete == 1 ) return 1;
	if ( ( percentageComplete *= 2 ) < 1 ) return 0.5 * Math.pow( 2, 10 * ( percentageComplete - 1 ) );
	return 0.5 * ( - Math.pow( 2, - 10 * ( percentageComplete - 1 ) ) + 2 );
};
Easing.Circular = {};
Easing.Circular.EaseIn = (percentageComplete) => -(Math.sqrt( 1 - percentageComplete * percentageComplete ) - 1);
Easing.Circular.EaseOut = (percentageComplete) => Math.sqrt( 1 - (--percentageComplete * percentageComplete) );
Easing.Circular.EaseInOut = (percentageComplete) => {
	if ( ( percentageComplete /= 0.5 ) < 1) return - 0.5 * ( Math.sqrt( 1 - percentageComplete * percentageComplete) - 1);
	return 0.5 * ( Math.sqrt( 1 - ( percentageComplete -= 2) * percentageComplete) + 1);
};
Easing.Elastic = {};
Easing.Elastic.EaseIn = (percentageComplete) => {
	var s, a = 0.1, p = 0.4;
	if ( percentageComplete == 0 ) return 0; if ( percentageComplete == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return - ( a * Math.pow( 2, 10 * ( percentageComplete -= 1 ) ) * Math.sin( ( percentageComplete - s ) * ( 2 * Math.PI ) / p ) );
};

Easing.Elastic.EaseOut = (percentageComplete) => {
	var s, a = 0.1, p = 0.4;
	if ( percentageComplete == 0 ) return 0; if ( percentageComplete == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return ( a * Math.pow( 2, - 10 * percentageComplete) * Math.sin( ( percentageComplete - s ) * ( 2 * Math.PI ) / p ) + 1 );
};

Easing.Elastic.EaseInOut = (percentageComplete) => {
	var s, a = 0.1, p = 0.4;
	if ( percentageComplete == 0 ) return 0; if ( percentageComplete == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	if ( ( percentageComplete *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( percentageComplete -= 1 ) ) * Math.sin( ( percentageComplete - s ) * ( 2 * Math.PI ) / p ) );
	return a * Math.pow( 2, -10 * ( percentageComplete -= 1 ) ) * Math.sin( ( percentageComplete - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
};
Easing.Back = {};
Easing.Back.EaseIn = (percentageComplete) => {
	var s = 1.70158;
	return percentageComplete * percentageComplete * ( ( s + 1 ) * percentageComplete - s );
};

Easing.Back.EaseOut = (percentageComplete) => {
	var s = 1.70158;
	return ( percentageComplete = percentageComplete - 1 ) * percentageComplete * ( ( s + 1 ) * percentageComplete + s ) + 1;
};

Easing.Back.EaseInOut = (percentageComplete) => {
	var s = 1.70158 * 1.525;
	if ( ( percentageComplete *= 2 ) < 1 ) return 0.5 * ( percentageComplete * percentageComplete * ( ( s + 1 ) * percentageComplete - s ) );
	return 0.5 * ( ( percentageComplete -= 2 ) * percentageComplete * ( ( s + 1 ) * percentageComplete + s ) + 2 );
};
Easing.Bounce = {};
Easing.Bounce.EaseIn = (percentageComplete) => 1 - Easing.Bounce.EaseOut( 1 - percentageComplete );
Easing.Bounce.EaseOut = (percentageComplete) => {
	if ( ( percentageComplete /= 1 ) < ( 1 / 2.75 ) ) {
		return 7.5625 * percentageComplete * percentageComplete;
	} else if ( percentageComplete < ( 2 / 2.75 ) ) {
		return 7.5625 * ( percentageComplete -= ( 1.5 / 2.75 ) ) * percentageComplete + 0.75;
	} else if ( percentageComplete < ( 2.5 / 2.75 ) ) {
		return 7.5625 * ( percentageComplete -= ( 2.25 / 2.75 ) ) * percentageComplete + 0.9375;
	} else {
		return 7.5625 * ( percentageComplete -= ( 2.625 / 2.75 ) ) * percentageComplete + 0.984375;
	}
};
Easing.Bounce.EaseInOut = (percentageComplete) => {
	if ( percentageComplete < 0.5 ) return Easing.Bounce.EaseIn( percentageComplete * 2 ) * 0.5;
	return Easing.Bounce.EaseOut( percentageComplete * 2 - 1 ) * 0.5 + 0.5;
}