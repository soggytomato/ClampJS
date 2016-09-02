// Constants
const R = 8.314;	// Universal gas constant in (J)(K^-1)(mol^-1)
const T = 293;		// Temperature in degrees K
const F = 96485;	// Faraday's constant in (C)(mol^-1)

// Settings fields
var NK = document.getElementById("NK");
var NNa = document.getElementById("NNa");
var gammaK = document.getElementById("gammaK");
var gammaNa = document.getElementById("gammaNa");
var KconcIn = document.getElementById("KconcIn");
var KconcOut = document.getElementById("KconcOut");
var NaconcIn = document.getElementById("NaconcIn");
var NaconcOut =	document.getElementById("NaconcOut");
var dTfield = document.getElementById("dTfield");
var canEditN = true;

// Buttons
var startStopButton = document.getElementById("startStopButton");
var editButton = document.getElementById("editButton");
var restartButton = document.getElementById("restartButton");
var stepButton = document.getElementById("stepButton");

// HUD text
var VmDisplay =	document.getElementById("VmDisplay");
var KC1Text = document.getElementById("KC1");
var KC2Text = document.getElementById("KC2");
var KC3Text = document.getElementById("KC3");
var KC4Text = document.getElementById("KC4");
var KOText = document.getElementById("KO");
var NaC1Text = document.getElementById("NaC1");
var NaC2Text = document.getElementById("NaC2");
var NaC3Text = document.getElementById("NaC3");
var NaOText = document.getElementById("NaO");
var NaI1Text = document.getElementById("NaI1");
var NaI2Text = document.getElementById("NaI2");
var NaI3Text = document.getElementById("NaI3");
var NaI4Text = document.getElementById("NaI4");
var dTText = document.getElementById("dT");
var EKText = document.getElementById("EK");
var ENaText = document.getElementById("ENa");
var alphanText = document.getElementById("alphan");
var betanText = document.getElementById("betan");
var alphamText = document.getElementById("alpham");
var betamText = document.getElementById("betam");
var alphahText = document.getElementById("alphah");
var betahText = document.getElementById("betah");
var currentText = document.getElementById("current");
var currentUnitsText = document.getElementById("currentUnits");

// Physiological variables
var EK = ((R * T) / (1 * F)) * Math.log(KconcOut.value / KconcIn.value) * 1000; // mV
var ENa = ((R * T) / (1 * F)) * Math.log(NaconcOut.value / NaconcIn.value) * 1000; // mV
var VmField = document.getElementById("Vm");
var Vm = VmField.value;

// Recording variables
var trace = document.getElementById("trace");
var ctx_trace = trace.getContext("2d");
var x1 = 50;
var x2 = 50;
var y1 = 250;
var y2 = 250;
var dt = dTfield.value / 1000000;
var dt_total = 0;
var dx = 0.2;
var current = 0; // pA
var traceData = [];
var sample = 0;
var startX = 0;

// Axis variables
var axis = document.getElementById("axis");
var ctx_axis = axis.getContext("2d");
var maxCurrent = 1000; // pA
var scalingFactor = 1;
var yAxisUnits = "pA";
var timer;

// Ion channel variables
var alpham = getAlpham(Vm);
var betam = getBetam(Vm);
var alphah = getAlphah(Vm);
var betah = getBetah(Vm);
var alphan = getAlphan(Vm);
var betan = getBetan(Vm);
// Na_array[i[j]] gives number of Na channels with i m-gates open and j h-gates open.
var Na_array = [[0, Math.round(NNa.value)], [0, 0], [0, 0], [0, 0]];
// K_array[i] gives number of K channels with i n-gates open.
var K_array = [Math.round(NK.value), 0, 0, 0, 0];
var lifetimeCounter = 0;
var cycleCounter = 0;

// protocol placeholders
var protocol = [[5, -120], [10, -120], [5, -120]];
var delta = [0, 10, 0];

/*
===========================================================================================
======== GENERAL FUNCTIONS ================================================================
===========================================================================================
*/

init();

function init() {
	ctx_axis.translate(0.5, 0.5);
	ctx_trace.translate(0.5, 0.5);
	ctx_trace.strokeStyle = "#0000ff";
	drawAxis();
	
	updateHUD();
}

function mainLoop() {
	update();
	drawTrace();
}

/*
===========================================================================================
======== RECORDING FUNCTIONS ==============================================================
===========================================================================================
*/

function update() {

	cycle();
	IK = K_array[4] * gammaK.value * (Vm - EK) / 1000; // pA
	INa = Na_array[3][1] * gammaNa.value * (Vm - ENa) / 1000; // pA
	current = IK + INa;

	dt_total += dt;
	sample += 1;
	updateHUD();

	// Store current data to array
	traceData[sample] = current;
	
	// Temporary solution for continuous recording
	if (sample > (trace.width - 100) / dx) {
		startX += 1;
	}
}

function drawTrace() {

	// The following two assignments prevent graphical bugs
	x2 = 50;
	y2 = 250 - toPixels(traceData[1 + startX]);

	ctx_trace.clearRect(-1, -1, trace.width + 1, trace.height + 1);
	ctx_trace.beginPath();

	for (i = 1; i <= sample - startX; i++) {
		x1 = x2;
		y1 = y2;
		x2 = 50 + (i * dx);
		y2 = 250 - toPixels(traceData[i + startX]);
		ctx_trace.moveTo(x1, y1);
		ctx_trace.lineTo(x1, y2);
		ctx_trace.moveTo(x1, y2);
		ctx_trace.lineTo(x2, y2);	
	}

	ctx_trace.stroke();
}

function updateTrace() {
	ctx_trace.clearRect(-1, -1, trace.width + 1, trace.height + 1);
	drawTrace();
}


/*
===========================================================================================
======== AXIS FUNCTIONS ===================================================================
===========================================================================================
*/

function drawAxis() {

	ctx_axis.beginPath();
	ctx_axis.strokeStyle = "#eaeaea";

	// Grid lines
	for (i = 0; i < 21; i++) {
		ctx_axis.moveTo(50, 10 + (240/10 * i));
		ctx_axis.lineTo(800, 10 + (240/10 * i));
	}
	ctx_axis.stroke();

	// X and Y axis
	ctx_axis.beginPath();
	ctx_axis.strokeStyle = "#000000";
	ctx_axis.moveTo(50, 0);
	ctx_axis.lineTo(50, 500);
	ctx_axis.moveTo(50, 500);
	ctx_axis.lineTo(800, 500);

	// Y axis markings
	ctx_axis.moveTo(48, 10);
	ctx_axis.lineTo(50, 10);
	ctx_axis.moveTo(48, 130);
	ctx_axis.lineTo(50, 130);
	ctx_axis.moveTo(48, 250);
	ctx_axis.lineTo(50, 250);
	ctx_axis.moveTo(48, 370);
	ctx_axis.lineTo(50, 370);
	ctx_axis.moveTo(48, 490);
	ctx_axis.lineTo(50, 490);

	// X axis markings
	for (i = 0; i < 15; i++) {
		ctx_axis.moveTo(50 + (50 * i), 500);
		ctx_axis.lineTo(50 + (50 * i), 502);
	}


	ctx_axis.stroke();

	ctx_axis.textAlign = "end";
	ctx_axis.textBaseline = "middle";
	ctx_axis.fillText(Math.round(maxCurrent/scalingFactor), 45, 10);
	ctx_axis.fillText(Math.round((maxCurrent/2)/scalingFactor), 45, 130);
	ctx_axis.fillText("0", 45, 250);
	ctx_axis.fillText(Math.round((-maxCurrent/2)/scalingFactor), 45, 370); 
	ctx_axis.fillText(Math.round(-maxCurrent/scalingFactor), 45, 490); 

	ctx_axis.rotate(-Math.PI/2);
	ctx_axis.textAlign = "center";
	ctx_axis.fillText("Current (" + yAxisUnits + ")", -250, 20); 
	ctx_axis.rotate(Math.PI/2);
}

function updateAxis() {
	updateYAxisUnits();
	ctx_axis.clearRect(-1, -1, axis.width + 1, axis.height + 1);
	drawAxis();
}

/*
	------------------
	SETTINGS FUNCTIONS
	------------------
*/

function updateSettings() {
	EK = ((R * T) / (1 * F)) * Math.log(KconcOut.value / KconcIn.value) * 1000;
	ENa = ((R * T) / (1 * F)) * Math.log(NaconcOut.value / NaconcIn.value) * 1000;
	stepVoltage();
	if (canEditN) {
		K_array[0] = Math.round(NK.value);
		Na_array[0][1] = Math.round(NNa.value);
	}
	dt = dTfield.value / 1000000;
	updateHUD();
}

function updateHUD() {
	KC1Text.innerHTML = K_array[0];
	KC2Text.innerHTML = K_array[1];
	KC3Text.innerHTML = K_array[2];
	KC4Text.innerHTML = K_array[3];
	KOText.innerHTML = K_array[4];
	NaC1Text.innerHTML = Na_array[0][1];
	NaC2Text.innerHTML = Na_array[1][1];
	NaC3Text.innerHTML = Na_array[2][1];
	NaOText.innerHTML = Na_array[3][1];
	NaI1Text.innerHTML = Na_array[0][0];
	NaI2Text.innerHTML = Na_array[1][0];
	NaI3Text.innerHTML = Na_array[2][0];
	NaI4Text.innerHTML = Na_array[3][0];

	dTText.innerHTML = Math.round(dt_total * 1000);
	EKText.innerHTML = EK.toFixed(1);
	ENaText.innerHTML = ENa.toFixed(1);
	alphanText.innerHTML = alphan.toFixed(4);
	betanText.innerHTML = betan.toFixed(4);
	alphamText.innerHTML = alpham.toFixed(4);
	betamText.innerHTML = betam.toFixed(4);
	alphahText.innerHTML = alphah.toFixed(4);
	betahText.innerHTML = betah.toFixed(4);
	currentText.innerHTML = scaleCurrent(current).toFixed(1);
}

/*
	--------------
	BUTTON ACTIONS
	--------------
*/

function start() {
	clearInterval(timer);
	timer = setInterval(mainLoop, dt * 1000);
	startStopButton.setAttribute("onclick", "stop();");
	startStopButton.setAttribute("class", "btn btn-default");
	startStopButton.innerHTML = '<span class="glyphicon glyphicon-pause"></span>';
	editButton.disabled = true;
	restartButton.disabled = true;
	canEditN = false;
}

function stop() {
	clearInterval(timer);
	startStopButton.setAttribute("onclick", "start();");
	startStopButton.setAttribute("class", "btn btn-success");
	startStopButton.innerHTML = '<span class="glyphicon glyphicon-play"></span>';
	editButton.disabled = false;
	restartButton.disabled = false;
}

function editSettings() {
	if (canEditN) {
		NK.disabled = false;
		NNa.disabled = false;
	}
	gammaK.disabled = false;
	gammaNa.disabled = false;
	KconcIn.disabled = false;
	KconcOut.disabled = false;
	NaconcIn.disabled = false;
	NaconcOut.disabled = false;
	dTfield.disabled = false;
	editButton.setAttribute("onclick", "doneSettings();");
	editButton.setAttribute("class", "btn btn-danger");
	editButton.innerHTML = "Done";
	startStopButton.disabled = true;
	restartButton.disabled = true;
	stepButton.disabled = true;
}

function enterDoneSettings(e) {
	if (e.keyCode == 13) {
		doneSettings();
	}
}

function doneSettings() {
	NK.disabled = true;
	NNa.disabled = true;
	gammaK.disabled = true;
	gammaNa.disabled = true;
	KconcIn.disabled = true;
	KconcOut.disabled = true;
	NaconcIn.disabled = true;
	NaconcOut.disabled = true;
	dTfield.disabled = true;
	editButton.setAttribute("onclick", "editSettings();");
	editButton.setAttribute("class", "btn btn-primary");
	editButton.innerHTML = "Edit";
	startStopButton.disabled = false;
	restartButton.disabled = false;
	stepButton.disabled = false;

	updateSettings();
}

function restart() {
	x1 = 50;
	x2 = 50;
	y1 = 250;
	y2 = 250;
	dt_total = 0;

	for (i = 0; i <= 4; i++) {
		K_array[i] = 0;
	}
	K_array[0] = Math.round(NK.value);

	for (i = 0; i <= 3; i++) {
		for (j = 0; j <= 1; j++) {
			Na_array[i][j] = 0;
		}
	}
	Na_array[0][1] = Math.round(NNa.value);

	current = 0;
	sample = 0;
	startX = 0;
	ctx_trace.clearRect(-1, -1, trace.width + 1, trace.height + 1);
	updateHUD();
	canEditN = true;
}

function yAxisPlus() {
	maxCurrent = nextMaxCurrent(false);
	updateAxis();
	updateTrace();
}

function yAxisMinus() {
	maxCurrent = nextMaxCurrent(true);
	updateAxis();
	updateTrace();
}

function enterStepVoltage(e) {
	if (e.keyCode == 13) {
		stepVoltage();
	}
}

function stepVoltage() {
	// temporary asymptote removal
	if (VmField.value > 9.99 && VmField.value < 10.01) {
		Vm = 9.99;
	} else if (VmField.value > 24.99 && VmField.value < 25.01) {
		Vm = 24.99;
	} else if (VmField.value == -60) {
		Vm = 59.99;
	} else {
		Vm = VmField.value;
	}
	VmDisplay.innerHTML = Math.round(Vm);
	alphan = getAlphan(Vm);
	betan = getBetan(Vm);
	alpham = getAlpham(Vm);
	betam = getBetam(Vm);
	alphah = getAlphah(Vm);
	betah = getBetah(Vm);
	lifetimeCounter = 0;
}

/*
	----------------
	HELPER FUNCTIONS
	----------------
*/

// User Interface 

function nextMaxCurrent(direction) {
	var nextCurrent;
	if (maxCurrent == 3) {
		nextCurrent = direction ? 10 : 3;
	} else if (maxCurrent == 10) {
		nextCurrent = direction ? 30 : 3;
	} else if (maxCurrent == 30) {
		nextCurrent = direction ? 100 : 10;
	} else if (maxCurrent == 100) {
		nextCurrent = direction ? 300 : 30;
	} else if (maxCurrent == 300) {
		nextCurrent = direction ? 1000 : 100;
	} else if (maxCurrent == 1000) {
		nextCurrent = direction ? 3000 : 300;
	} else if (maxCurrent == 3000) {
		nextCurrent = direction ? 10000 : 1000;
	} else if (maxCurrent == 10000) {
		nextCurrent = direction ? 30000 : 3000;
	} else if (maxCurrent == 30000) {
		nextCurrent = direction ? 100000 : 10000;
	} else if (maxCurrent == 100000) {
		nextCurrent = direction ? 300000 : 30000;
	} else if (maxCurrent == 300000) {
		nextCurrent = direction ? 1000000 : 100000;
	} else if (maxCurrent == 1000000) {
		nextCurrent = direction ? 1000000 : 300000;
	}
	return nextCurrent;
}
function scaleCurrent(current) {
	if (Math.abs(current) >= 1000000) {
		currentUnitsText.innerHTML = "&#181;A";
		return current / 1000000;
	} else if (Math.abs(current) >= 1000) {
		currentUnitsText.innerHTML = "nA";
		return current / 1000;
	} else {
		currentUnitsText.innerHTML = "pA";
		return current;
	}
}
function updateYAxisUnits() {
	if (maxCurrent >= 10000) {
		scalingFactor = 1000;
		yAxisUnits = "nA";
	} else if (maxCurrent >= 10) {
		scalingFactor = 1;
		yAxisUnits = "pA";
	} else {
		scalingFactor = 0.001;
		yAxisUnits = "fA";
	}
}
function toPixels(pA) {
	return (pA / maxCurrent) * 240;
}

// Rate Constants

function getAlphan(Vm) { return 0.01 * (-(Vm - (-70)) + 10) / (Math.exp((-(Vm - (-70)) + 10) / 10) - 1); }
function getBetan(Vm) { return 0.125 * Math.exp(-(Vm - (-70)) / 80); }
function getAlpham(Vm) { return 0.1 * (-(Vm - (-70)) + 25) / (Math.exp((-(Vm - (-70)) + 10) / 10) - 1); }
function getBetam(Vm) { return 4 * Math.exp(-(Vm - (-70)) / 18); }
function getAlphah(Vm) { return 0.07 * Math.exp(-(Vm - (-70)) / 20); }
function getBetah(Vm) { return 1 / (Math.exp((-(Vm - (-70)) + 30) / 10) + 1); }

// Channel Counts

function getNni(i) { return K_array[i]; }
function getNmihj(i, j) { return Na_array[i][j]; }

/*
	*-------------------------------------*
	* CNT Algorithm for State Transitions *
	*-------------------------------------*
*/

function cycle() {
	lambda = getEffectiveTransitionRate();
	if (lifetimeCounter <= dt) {
		lifetimeCounter += generateLifetime(lambda) / 1000;
	}
	while (lifetimeCounter <= dt) {
		cycleCounter += 1;
		performTransition(selectTransition(lambda));
		lifetimeCounter += generateLifetime(lambda) / 1000;
	}
	lifetimeCounter -= dt;
	console.log("Cycles performed in this step: " + cycleCounter);
	console.log("Lifetime spillover: " + lifetimeCounter);
	cycleCounter = 0;
}

function selectTransition(lambda) {
	random = Math.random();
	transitionProbability = [];
	transitionProbabilitySum = 0;
	for (i = 0; i <= 28; i++) {
		transitionProbabilitySum += (getStateTransitionEta(i) / lambda);
		transitionProbability[i] = transitionProbabilitySum;
	}
	for (i = 0; i <= 27; i++) {
		if (random >= transitionProbability[i] && random < transitionProbability[i + 1]) {
			return i;
		}
	}
	return -1;
}

function performTransition(i) {
	components = transitionData[i];
	if (i >= 0 && i <= 19) {
		m1 = components[0];
		h1 = components[1];
		m2 = components[2];
		h2 = components[3];
		Na_array[m1][h1] -= 1;
		Na_array[m2][h2] += 1;
	} else if (i > 19 && i <= 27) {
		n1 = components[0];
		n2 = components[1];
		K_array[n1] -= 1;
		K_array[n2] += 1;
	} else {

	}
}

function getStateTransitionEta(i) {
	components = etaData[i];
	if (i >= 0 && i <= 20) {
		return 	components[0] * 
				Math.pow(alpham, components[1]) * 
				Math.pow(betam, components[2]) * 
				Math.pow(alphah, components[3]) * 
				Math.pow(betah, components[4]) * 
				getNmihj(components[5], components[6]);
	} else if (i > 20 && i <= 28) {
		return 	components[0] * 
				Math.pow(alphan, components[1]) * 
				Math.pow(betan, components[2]) *
				getNni(components[3]);
	} else {
		console.log("ERROR");
		return 0;
	}
}

function getEscapeTransitionRate(i) {
	components = escapeData[i];
	if (i >= 0 && i <= 7) {
		return ((components[0] * alpham) + (components[1] * betam) + (components[2] * alphah) + (components[3] * betah));
	} else if (i > 7 && i <= 12) {
		return ((components[0] * alphan) + (components[1] * betan));
	} else {
		return 0;
	}
}

function getEffectiveTransitionRate() {
	rate = 0;
	for (i = 0; i <= 7; i++) {
		state = stateData[i];
		rate += (getNmihj(state[0], state[1]) * getEscapeTransitionRate(i));
	}
	for (i = 8; i <= 12; i++) {
		state = stateData[i];
		rate += (getNni(state) * getEscapeTransitionRate(i));
	}
	return rate;
}

function generateLifetime(lambda) {
	return -Math.log(Math.random()) / lambda;
}
