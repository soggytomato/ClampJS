function stepK() {

	// KC1 transitions
	for (i = 0; i < KC1; i++) {
		var rand = Math.random();
		var right = dt * 4 * alphan;
		if (rand < right) {
			KC1toC2 += 1;
		}
	}

	// KC2 transitions
	for (i = 0; i < KC2; i++) {
		var rand = Math.random();
		var left = dt * betan;
		var right = dt * 3 * alphan;
		if (rand < left) {
			KC2toC1 += 1;
		} else if (rand >= left && rand < left + right) {
			KC2toC3 += 1;
		}
	}

	// KC3 transitions
	for (i = 0; i < KC3; i++) {
		var rand = Math.random();
		var left = dt * 2 * betan;
		var right = dt * 2 * alphan;
		if (rand < left) {
			KC3toC2 += 1;
		} else if (rand >= left && rand < left + right) {
			KC3toC4 += 1;
		}
	}

	// KC4 transitions
	for (i = 0; i < KC4; i++) {
		var rand = Math.random();
		var left = dt * 3 * betan;
		var right = dt * alphan;
		if (rand < left) {
			KC4toC3 += 1;
		} else if (rand >= left && rand < left + right) {
			KC4toO += 1;
		}
	}

	// KO transitions
	for (i = 0; i < KO; i++) {
		var rand = Math.random();
		var left = dt * 4 * betan;
		if (rand < left) {
			KOtoC4 += 1;
		}
	}

	KC1 += KC2toC1;
	KC2 += KC1toC2;
	KC2 += KC3toC2;
	KC3 += KC2toC3;
	KC3 += KC4toC3;
	KC4 += KC3toC4;
	KC4 += KOtoC4;
	KO += KC4toO;
	KC1 -= KC1toC2;
	KC2 -= KC2toC1;
	KC2 -= KC2toC3;
	KC3 -= KC3toC2;
	KC3 -= KC3toC4;
	KC4 -= KC4toC3;
	KC4 -= KC4toO;
	KO -= KOtoC4;
	KC1toC2 = 0;
	KC2toC3 = 0;
	KC3toC4 = 0;
	KC4toO = 0;
	KC2toC1 = 0;
	KC3toC2 = 0;
	KC4toC3 = 0;
	KOtoC4 = 0;
}

function stepNa() {

	// NaC1 transitions
	for (i = 0; i < NaC1; i++) {
		var rand = Math.random();
		var right = dt * 3 * alpham;
		var up = dt * betah;
		if (rand < right) {
			NaC1toC2 += 1;
		} else if (rand >= right && rand < right + up) {
			NaC1toI1 += 1;
		}
	}

	// NaC2 transitions
	for (i = 0; i < NaC2; i++) {
		var rand = Math.random();
		var left = dt * betam;
		var right = dt * 2 * alpham;
		var up = dt * betah;
		if (rand < left) {
			NaC2toC1 += 1;
		} else if (rand >= left && rand < left + right) {
			NaC2toC3 += 1;
		} else if (rand >= left + right && rand < left + right + up) {
			NaC2toI2 += 1;
		}
	}

	// NaC3 transitions
	for (i = 0; i < NaC3; i++) {
		var rand = Math.random();
		var left = dt * 2 * betam;
		var right = dt * alpham;
		var up = dt * betah;
		if (rand < left) {
			NaC3toC2 += 1;
		} else if (rand >= left && rand < left + right) {
			NaC3toO += 1;
		} else if (rand >= left + right && rand < left + right + up) {
			NaC3toI3 += 1;
		}
	}

	// NaO transitions
	for (i = 0; i < NaO; i++) {
		var rand = Math.random();
		var left = dt * 3 * betam;
		var up = dt * betah;
		if (rand < left) {
			NaOtoC3 += 1;
		} else if (rand >= left && rand < left + up) {
			NaOtoI4 += 1;
		}
	}

	// NaI1 transitions
	for (i = 0; i < NaI1; i++) {
		var rand = Math.random();
		var right = dt * 3 * alpham;
		var down = dt * alphah;
		if (rand < right) {
			NaI1toI2 += 1;
		} else if (rand >= right && rand < right + down) {
			NaI1toC1 += 1;
		}
	}

	// NaI2 transitions
	for (i = 0; i < NaI2; i++) {
		var rand = Math.random();
		var left = dt * betam;
		var right = dt * 2 * alpham;
		var down = dt * alphah;
		if (rand < left) {
			NaI2toI1 += 1;
		} else if (rand >= left && rand < left + right) {
			NaI2toI3 += 1;
		} else if (rand >= left + right && rand < left + right + down) {
			NaI2toC2 += 1;
		}
	}

	// NaI3 transitions
	for (i = 0; i < NaI3; i++) {
		var rand = Math.random();
		var left = dt * 2 * betam;
		var right = dt * alpham;
		var down = dt * alphah;
		if (rand < left) {
			NaI3toI2 += 1;
		} else if (rand >= left && rand < left + right) {
			NaI3toI4 += 1;
		} else if (rand >= left + right && rand < left + right + down) {
			NaI3toC3 += 1;
		}
	}

	// NaI4 transitions
	for (i = 0; i < NaI4; i++) {
		var rand = Math.random();
		var left = dt * 3 * betam;
		var down = dt * alphah;
		if (rand < left) {
			NaI4toI3 += 1;
		} else if (rand >= left && rand < left + down) {
			NaI4toO += 1;
		}
	}

	NaC1 += (NaC2toC1 + NaI1toC1);
	NaC2 += (NaC1toC2 + NaC3toC2 + NaI2toC2);
	NaC3 += (NaC2toC3 + NaOtoC3 + NaI3toC3);
	NaO += (NaC3toO + NaI4toO);
	NaI1 += (NaC1toI1 + NaI2toI1);
	NaI2 += (NaI1toI2 + NaI3toI2 + NaC2toI2);
	NaI3 += (NaI2toI3 + NaI4toI3 + NaC3toI3);
	NaI4 += (NaI3toI4 + NaOtoI4);

	NaC1 -= (NaC1toC2 + NaC1toI1);
	NaC2 -= (NaC2toC1 + NaC2toC3 + NaC2toI2);
	NaC3 -= (NaC3toC2 + NaC3toO + NaC3toI3);
	NaO -= (NaOtoC3 + NaOtoI4);
	NaI1 -= (NaI1toI2 + NaI1toC1);
	NaI2 -= (NaI2toI1 + NaI2toI3 + NaI2toC2);
	NaI3 -= (NaI3toI2 + NaI3toI4 + NaI3toC3);
	NaI4 -= (NaI4toI3 + NaI4toO);

	NaC1toC2 = 0;
	NaC2toC3 = 0;
	NaC3toO = 0;
	NaC2toC1 = 0;
	NaC3toC2 = 0;
	NaOtoC3 = 0;
	NaI1toI2 = 0;
	NaI2toI3 = 0;
	NaI3toI4 = 0;
	NaI2toI1 = 0;
	NaI3toI2 = 0;
	NaI4toI3 = 0;
	NaC1toI1 = 0;
	NaC2toI2 = 0;
	NaC3toI3 = 0;
	NaOtoI4 = 0;
	NaI1toC1 = 0;
	NaI2toC2 = 0;
	NaI3toC3 = 0;
	NaI4toO = 0;
}