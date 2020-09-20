class Head {
	constructor(string) {
		let parsed = Head.parse(string);
		let state = parsed[0];
		let location = parsed[1];
		this.update(state, location);
	}

	get status() {
		return `Estado atual do cabeçote: ${this.state}\nLocalização na fita: ${this.location}`;
	}

	update(state, location) {
		this.state = state;
		this.location = location;
	}

	static parse(string) {
		let parsed = string.split(" ");
		parsed[1] = parseInt(parsed[1]);
		return parsed;
	}
}

class Tape {
	constructor(string) {
		this.tape = Tape.parse(string);
	}

	get status() {
		return this.tape.join(" ");
	}

	extendLeft() {
		this.tape.unshift("&");
	}

	extendRight() {
		this.tape.push("&");
	}

	write(symbol, location) {
		this.tape[location] = symbol;
	}

	static parse(string) {
		return string.split(" ");
	}
}

class Machine {
	constructor(i, ruleset, tape, head, auxTapes = []) {
		this.id = i;
		this.ruleset = ruleset;
		this.tape = tape;
		this.head = head;
		this.numOfTransitions = 0;
		this.auxTapes = auxTapes;
	}

	get status() {
		let string =
			"> Fita Id " +
			this.id +
			"\n" +
			this.tape.status +
			"\n" +
			this.head.status;

		this.auxTapes.forEach((m) => {
			string +=
				"\n\n> Fita Id " +
				m.id +
				"\n" +
				m.tape.status +
				"\n" +
				m.head.status;
		});

		string += "\nNº de transições até o momento: " + this.numOfTransitions + "\n\n";

		return string;
	}

	shiftHead(step) {
		let move = step.toUpperCase();
		if (this.head.location == 0 && move == "L") {
			this.tape.extendLeft();
		} else if (
			this.head.location == this.tape.tape.length - 1 &&
			move == "R"
		) {
			this.tape.extendRight();
			this.head.location += 1;
		} else if (move == "L") {
			this.head.location -= 1;
		} else if (move == "R") {
			this.head.location += 1;
		}
	}

	// ====================================================================================================
	// Alterar regras para percorrer as rulesets e aceitar ou rejeitar entradas
	// ====================================================================================================
	stepLookup() {
		console.log("Step Lookup: ", this.ruleset);
		if (
			this.ruleset[this.head.state] &&
			this.ruleset[this.head.state][this.tape.tape[this.head.location]]
		) {
			return this.ruleset[this.head.state][
				this.tape.tape[this.head.location]
			];
		} else {
			return false;
		}
	}

	step(aux = false) {
		console.log("Step aux? ", aux);
		let new_state = this.stepLookup()[0];
		let new_symbol = this.stepLookup()[1];
		let move = this.stepLookup()[2];
		this.numOfTransitions++;

		this.tape.write(new_symbol, this.head.location);
		this.head.state = new_state;
		this.shiftHead(move);
	}

	run(stepByStep = false) {
		let count = 0;
		while (this.stepLookup()) {
			console.info("Maquina: ", this);
			console.log("Step: ", count);
			console.log("Status: ", this.status);

			if (stepByStep) Printer.print(this.status);
			this.step();
			this.auxTapes.forEach((m) => {
				let stepLookup = m.stepLookup();
				console.log("Check step lookup aux: ", stepLookup);
				if (stepLookup) {
					console.log("Iniciando step maquina secundária: ", m);
					m.step(true);
				}
			});
		}

		if (stepByStep) {
			Printer.print(this.status);
			Printer.print("~ FIM ~");
			document.getElementById("numOfTransitions").innerText =
				this.numOfTransitions + 1;
		}
		console.info("Maquina principal: ", this);

		return isFinalLabel(this.head.state);
	}
}

class Printer {
	static print(string) {
		let div = document.getElementById("div");
		let p = document.createElement("p");
		p.innerText = string;
		div.appendChild(p);
	}

	static clear() {
		let div = document.getElementById("div");
		div.innerHTML = `<h5 class="blue-text darken-3">Passo-a-Passo</h4>`;
	}
}
