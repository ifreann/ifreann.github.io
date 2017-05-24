(function (lib, img, cjs, ss, an) {

var p; // shortcut to reference prototypes
lib.ssMetadata = [];


// symbols:
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.box_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#0066CC").s().p("AnzH0IAAvnIPnAAIAAPng");
	this.shape.setTransform(50,50);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.box_1, new cjs.Rectangle(0,0,100,100), null);


// stage content:
(lib.box = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.box_1();
	this.instance.parent = this;
	this.instance.setTransform(100,150,1,1,0,0,0,50,50);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({x:100.4},0).wait(1).to({x:101.7},0).wait(1).to({x:103.7},0).wait(1).to({x:106.4},0).wait(1).to({x:109.8},0).wait(1).to({x:113.8},0).wait(1).to({x:118.6},0).wait(1).to({x:124},0).wait(1).to({x:130.1},0).wait(1).to({x:136.9},0).wait(1).to({x:144.6},0).wait(1).to({x:153},0).wait(1).to({x:162.5},0).wait(1).to({x:173.1},0).wait(1).to({x:185.1},0).wait(1).to({x:199},0).wait(1).to({x:215.7},0).wait(1).to({x:237.6},0).wait(1).to({x:289.5},0).wait(1).to({x:348.3},0).wait(1).to({x:372.9},0).wait(1).to({x:391.4},0).wait(1).to({x:406.8},0).wait(1).to({x:420},0).wait(1).to({x:431.5},0).wait(1).to({x:441.8},0).wait(1).to({x:450.9},0).wait(1).to({x:459},0).wait(1).to({x:466.3},0).wait(1).to({x:472.8},0).wait(1).to({x:478.5},0).wait(1).to({x:483.6},0).wait(1).to({x:487.9},0).wait(1).to({x:491.6},0).wait(1).to({x:494.6},0).wait(1).to({x:496.9},0).wait(1).to({x:498.6},0).wait(1).to({x:499.7},0).wait(1).to({x:500},0).wait(1).to({x:499.7},0).wait(1).to({x:498.7},0).wait(1).to({x:497.1},0).wait(1).to({x:494.8},0).wait(1).to({x:492},0).wait(1).to({x:488.5},0).wait(1).to({x:484.4},0).wait(1).to({x:479.6},0).wait(1).to({x:474.2},0).wait(1).to({x:468},0).wait(1).to({x:461.1},0).wait(1).to({x:453.3},0).wait(1).to({x:444.7},0).wait(1).to({x:435},0).wait(1).to({x:424},0).wait(1).to({x:411.5},0).wait(1).to({x:396.9},0).wait(1).to({x:379.2},0).wait(1).to({x:355.9},0).wait(1).to({x:300},0).wait(1).to({x:244.1},0).wait(1).to({x:220.8},0).wait(1).to({x:203.1},0).wait(1).to({x:188.5},0).wait(1).to({x:176},0).wait(1).to({x:165},0).wait(1).to({x:155.3},0).wait(1).to({x:146.7},0).wait(1).to({x:138.9},0).wait(1).to({x:132},0).wait(1).to({x:125.8},0).wait(1).to({x:120.4},0).wait(1).to({x:115.6},0).wait(1).to({x:111.5},0).wait(1).to({x:108},0).wait(1).to({x:105.2},0).wait(1).to({x:102.9},0).wait(1).to({x:101.3},0).wait(1).to({x:100.3},0).wait(1).to({x:100},0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(350,250,100,100);
// library properties:
lib.properties = {
	width: 600,
	height: 300,
	fps: 60,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [],
	preloads: []
};




})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{}, AdobeAn = AdobeAn||{});
var lib, images, createjs, ss, AdobeAn;