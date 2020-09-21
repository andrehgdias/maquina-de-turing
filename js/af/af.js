// ---------- ---------- ---------- ---------- ---------- //
// Configurações //
let edges = {
	arrows: {
		to: { enabled: true },
	},
	arrowStrikethrough: true,
	color: {
		color: "#4a4a4a",
		highlight: "#4a4a4a",
		hover: "#4a4a4a",
		inherit: "from",
		opacity: 1.0,
	},
};

let nodes = {
	shape: "circle",
	size: 20,
	color: {
		border: "#2B7CE9",
		background: "#5faeE9",
		highlight: {
			border: "#000",
			background: "#fff",
		},
	},
};

let interaction = {
	hover: true,
	// hoverConnectedEdges: false,
	selectConnectedEdges: true,
};

let manipulation = {
	enabled: false,
	// initiallyActive: true
	addNode: function (nodeData, callback) {
		let maxId = nodesData.max("id");
		let id = maxId != null ? maxId.id + 1 : 1;
		nodeData.id = id;
		nodeData.label = "q" + id;
		callback(nodeData);
	},
	addEdge: async function (edgeData, callback) {
		let input = await Swal.fire({
			title: "Qual o simbolo que será validado?",
			input: "text",
			inputValidator: (value) => {
				if (value.split(";").length != 3) {
					//return "A fita precisa ser do formato: leitura;escrita;direção";
				}
			},
			type: "question",
		});

		let maxId = edgesData.max("id");
		let id = maxId != null ? maxId.id + 1 : 1;
		edgeData.label = input.value;
		edgeData.id = id;
		callback(edgeData);
	},
};

let physics = {
	enabled: true,
	barnesHut: {
		theta: 0.5,
		gravitationalConstant: -5000,
		centralGravity: 0.3,
		springLength: 175,
		springConstant: 0.04,
		damping: 0.09,
		avoidOverlap: 0
	  },
	maxVelocity: 2,
};

let options = {
	height: "100%",
	width: "100%",
	locale: "pt-br",
	clickToUse: true,
	edges,
	nodes,
	interaction,
	manipulation,
	physics,
};
// ---------- ---------- ---------- ---------- ---------- //
// Criando arrey de nós(estados)
let nodesData = new vis.DataSet();
let nodesAux = {
	initial: null,
	final: new Array(),
};
let clickedNode = null;

// Criando arrey de arestas(transições)
let edgesData = new vis.DataSet();

let container = document.getElementById("canvasvis");
let data = {
	nodes: nodesData,
	edges: edgesData,
};
let network = new vis.Network(container, data, options);
// ---------- ---------- ---------- ---------- ---------- //
// Controlando os botões
let addNodeButton = $("#addNode").tooltip();
let addEdgeButton = $("#addEdge").tooltip();
let deleteButton = $("#delete").tooltip();
let initialButton = $("#initial").tooltip();
let finalButton = $("#final").tooltip();

addNodeButton.on("click", () => {
	network.addNodeMode();
});

addEdgeButton.on("click", () => {
	network.addEdgeMode();
});

deleteButton.on("click", () => {
	network.deleteSelected();
});

initialButton.on("click", (event) => {
	if (nodesAux.initial) {
		let isFinal = nodesAux.final.filter((node) => {
			return node.id === nodesAux.initial.id;
		});
		if (isFinal.length) {
			nodesAux.initial.color = {
				border: "#ff0000",
				background: "#cc5555",
				highlight: {
					border: "#550000",
					background: "#aa2222",
				},
			};
		} else {
			nodesAux.initial.color = {
				border: "#2B7CE9",
				background: "#5faeE9",
				highlight: {
					border: "#000",
					background: "#fff",
				},
			};
		}
		nodesData.update(nodesAux.initial);
	}

	let isFinal = nodesAux.final.filter((node) => {
		return node.id === clickedNode.id;
	});
	if (isFinal.length) {
		clickedNode.color = {
			border: "#eba134",
			background: "#ffc570",
			highlight: {
				border: "#b56e04",
				background: "#ff9f12",
			},
		};
	} else {
		clickedNode.color = {
			border: "#555",
			background: "#ccc",
			highlight: {
				border: "#000",
				background: "#fff",
			},
		};
	}
	nodesAux.initial = clickedNode;
	nodesData.update(nodesAux.initial);
});

finalButton.on("click", (event) => {
	let toggle = nodesAux.final.filter((node) => {
		return node.id === clickedNode.id;
	});
	if (toggle.length) {
		let index;
		if (clickedNode.id === nodesAux.initial.id) {
			index = nodesAux.final.indexOf(nodesAux.initial);
			clickedNode.color = {
				border: "#555",
				background: "#ccc",
				highlight: {
					border: "#000",
					background: "#fff",
				},
			};
		} else {
			index = nodesAux.final.indexOf(toggle);
			clickedNode.color = {
				border: "#2B7CE9",
				background: "#5faeE9",
				highlight: {
					border: "#000",
					background: "#fff",
				},
			};
		}
		nodesData.update(clickedNode);
		nodesAux.final.splice(index, 1);
	} else {
		if (clickedNode.id === (nodesAux.initial ? nodesAux.initial.id : -1)) {
			clickedNode.color = {
				border: "#eba134",
				background: "#ffc570",
				highlight: {
					border: "#b56e04",
					background: "#ff9f12",
				},
			};
		} else {
			clickedNode.color = {
				border: "#ff0000",
				background: "#cc5555",
				highlight: {
					border: "#550000",
					background: "#aa2222",
				},
			};
		}
		nodesData.update(clickedNode);
		nodesAux.final.push(clickedNode);
	}
});

nodesData.on("*", function (event, properties, senderId) {});

initialButton.hide();
finalButton.hide();
network.on("click", function (properties) {
	var ids = parseInt(properties.nodes.toString());
	if (ids) {
		initialButton.show();
		finalButton.show();
		clickedNode = nodesData.get(ids);
	} else {
		initialButton.hide();
		finalButton.hide();
	}
});
// ---------- ---------- ---------- ---------- ---------- //
// Testando Strings
const inputStringUnica = $("#stringUnica");
const buttonStringUnica = $("#confirmaUnica");

const inputStringPassoAPasso = $("#stringPassoAPasso");
const buttonStringPassoAPasso = $("#confirmaPassoAPasso");

const inputString1 = $("#string1");
const inputString2 = $("#string2");
const inputString3 = $("#string3");
const inputString4 = $("#string4");

const buttonStringMultipla = $("#confirmaMultipla");

const validateString = (arreyString, stepByStep = false) => {
	// Se estiver validando apenas 1 string, o arrey terá apenas um item, se for para multipla, será 4 strings
	Printer.clear();

	let nodeInicial = nodesAux.initial;
	if (nodeInicial) {
		let nodesFinal = nodesAux.final;
		if (nodesFinal.length > 0) {
			if (stepByStep) {
				if (checkString(arreyString[0], nodeInicial.id, stepByStep))
					Swal.fire({
						title: "Uhuuuuuu",
						text: `Sua string ${arreyString[0]} foi aceita!`,
						type: "success",
					});
				else
					Swal.fire({
						title: "Ah, que pena!",
						text: `Sua string ${arreyString[0]} foi rejeitada :(`,
						type: "error",
					});
			} else if (arreyString.length === 1) {
				// Unica
				if (checkString(arreyString[0], nodeInicial.id))
					Swal.fire({
						title: "Uhuuuuuu",
						text: `Sua string ${arreyString[0]} foi aceita!`,
						type: "success",
					});
				else
					Swal.fire({
						title: "Ah, que pena!",
						text: `Sua string ${arreyString[0]} foi rejeitada :(`,
						type: "error",
					});
			} else if (arreyString.length === 4) {
				// Multipla
				let accepted = [];
				for (let string of arreyString) {
					if (checkString(string, nodeInicial.id)) {
						accepted.push(string);
					} else {
					}
				}
				if (accepted.length) {
					let text = "";
					text = accepted[0];
					if (accepted.length > 1)
						for (let i = 1; i < accepted.length; i++)
							text = text + ", " + accepted[i];

					Swal.fire({
						title: "Uhuuuuuu",
						text: `Suas strings ${text} foi aceita!`,
						type: "success",
					});
				} else {
					Swal.fire({
						title: "Ah, que pena!",
						text: `Suas strings foram rejeitadas :(`,
						type: "error",
					});
				}
			}
		} else {
			Swal.fire({
				title: "Sem estados finais!",
				text: "Defina ao menos um estado final",
				type: "error",
			});
		}
	} else {
		Swal.fire({
			title: "Sem estados iniciais!",
			text: "Defina um estado incial",
			type: "error",
		});
	}
};

buttonStringUnica.click(function () {
	validateString([inputStringUnica.val()]);
});

buttonStringMultipla.click(function () {
	validateString([
		inputString1.val(),
		inputString2.val(),
		inputString3.val(),
		inputString4.val(),
	]);
});

buttonStringPassoAPasso.click(function () {
	validateString([inputStringPassoAPasso.val()], true);
});

const hasTransition = (nodeId) => {
	let result = [];
	for (var i in edgesData._data) {
		let transition = edgesData._data[i];
		if (transition.from === nodeId) result.push(transition);
	}
	return result;
};

const isFinal = (nodeId) => {
	for (let i = 0; i < nodesAux.final.length; i++) {
		if (nodesAux.final[i].id === nodeId) return true;
	}
	return false;
};

const isFinalLabel = (label) => {
	for (let i = 0; i < nodesAux.final.length; i++) {
		if (nodesAux.final[i].label === label) return true;
	}
	return false;
};

const parseRuleset = (aux) => {
	let ruleset = {};
	for (var i in nodesData._data) {
		let node = nodesData._data[i];
		ruleset[node.label] = {};
		let transitions = hasTransition(node.id);
		if (transitions.length > 0)
			transitions.forEach((transition) => {
				let fitas = transition.label.split("|");
				let inputs = fitas[aux].split(";");
				ruleset[node.label][inputs[0]] = [
					nodesData._data[transition.to].label,
					inputs[1],
					inputs[2],
				];
			});
	}

	return ruleset;
};

const parseTape = (text) => {
	let string = "";
	for (let i = 0; i < text.length; i++) {
		string += text[i] + " ";
	}
	return string;
};

function contarQuantidadeFitas(id) {
	//let node = nodesData._data[0].id;
	let transitions = hasTransition(id);
	let quantFitas = 0;
	if (transitions.length > 0)
		quantFitas = transitions[0].label.split("|").length;
	return quantFitas;
}

const checkString = (text, nodeId, stepByStep = false) => {
	let quantFitas = contarQuantidadeFitas(nodeId);
	let ruleset = parseRuleset(0);
	let state = nodesData._data[nodeId].label;
	let tape = new Tape(parseTape(text));
	let head = new Head(state + " 0");
	let machines = [];

	for (let i = 0; i < quantFitas - 1; i++) {
		let ruleset = parseRuleset(i + 1);
		let tape = new Tape(parseTape("&"));
		machines[i] = new Machine(i + 1, ruleset, tape, new Head(state + " 0"));
	}

	m = new Machine(0, ruleset, tape, head, machines);

	return m.run(stepByStep);
};

const describe = () => {
	console.info("Describing");
	console.log("Nodes", nodesData);
	console.log("Edges", edgesData);
	console.warn("Edges data", edgesData._data);
	// let ids = nodesData.getIds();
	// console.log(ids);
	// nodesData.add({
	//   id: ids[ids.length - 1] + 1,
	//   label: "q" + (ids[ids.length - 1] + 1)
	// });
};

const exportAf = async (event) => {
	if (nodesData.length > 0) {
		let conteudo = json2xml(
			nodesData,
			edgesData,
			nodesAux.initial,
			nodesAux.final
		);
		let blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
		let input = await Swal.fire({
			title: "Qual o nome do arquivo?",
			input: "text",
			inputValidator: (value) => {
				if (!value.length) {
					return "Insira um nome";
				}
			},
			type: "question",
		});
		let titulo = input.value;
		saveAs(blob, titulo + ".jff");
	} else {
		Swal.fire({
			title: "Erro!",
			text: "Não há nenhuma máquina definida!",
			type: "error",
		});
	}
};

const openFile = (event) => {
	var input = event.target;

	var reader = new FileReader();
	reader.onload = function () {
		if (reader.result) {
			var text = reader.result;

			parser = new DOMParser();
			xmlDoc = parser.parseFromString(text, "text/xml");

			let json = JSON.parse(xml2json(xmlDoc, "    "));
			delete json.structure.automaton["#comment"];

			if (json.structure.type === "turing") {
				let nodes = json.structure.automaton.state;
				let edges = json.structure.automaton.transition;
				let numOfTapes = json.structure.tapes
					? json.structure.tapes
					: 1;

				if (numOfTapes > 1)
					edges.forEach((edge) => {
						let reads = [];
						let writes = [];
						let moves = [];
						let max = edge.read.length;
						for (let index = 0; index < max; index++) {
							let arreyRead = edge.read;
							let arreyWrite = edge.write;
							let arreyMove = edge.move;

							reads[index] = arreyRead[index]["#text"]
								? arreyRead[index]["#text"]
								: "&";
							writes[index] = arreyWrite[index]["#text"]
								? arreyWrite[index]["#text"]
								: "&";
							moves[index] = arreyMove[index]["#text"]
								? arreyMove[index]["#text"]
								: "S";
						}
						edge.read = reads;
						edge.write = writes;
						edge.move = moves;
					});

				buildMT(nodes, edges, numOfTapes);

				let jsonConvertedAsXml = json2xml(json, "");
			} else {
				Swal.fire({
					title: "Arquivo inválido!",
					text:
						"O arquivo selecionado não é uma MT exportada pelo JFLAP",
					type: "error",
				});
			}
		}
	};
	reader.readAsText(input.files[0]);
};

const buildMT = (nodes, edges, numOfTapes) => {
	nodes.forEach((node) => {
		nodesData.add({
			id: node["@id"],
			label: node["@name"],
			x: node.x,
			y: node.y,
		});

		if (node.hasOwnProperty("initial")) {
			if (node.hasOwnProperty("final")) {
				let config = {
					id: node["@id"],
					label: node["@name"],
					color: {
						border: "#eba134",
						background: "#ffc570",
						highlight: {
							border: "#b56e04",
							background: "#ff9f12",
						},
					},
				};
				nodesAux.final.push(config);
				nodesAux.initial = config;
			} else {
				nodesAux.initial = {
					id: node["@id"],
					label: node["@name"],
					color: {
						border: "#555",
						background: "#ccc",
						highlight: {
							border: "#000",
							background: "#fff",
						},
					},
				};
			}
			nodesData.update(nodesAux.initial);
		} else if (node.hasOwnProperty("final")) {
			nodesAux.final.push({
				id: node["@id"],
				label: node["@name"],
				color: {
					border: "#ff0000",
					background: "#cc5555",
					highlight: {
						border: "#550000",
						background: "#aa2222",
					},
				},
			});
			var index = nodesAux.final.findIndex(
				(nodeAux) => nodeAux.id === node["@id"]
			);
			nodesData.update(nodesAux.final[index]);
		}
	});
	let i = 1;
	edges.forEach((edge) => {
		var ids = edgesData.getIds();
		let label = "";

		if (numOfTapes > 1)
			for (let index = 0; index < numOfTapes; index++) {
				label +=
					(edge.read[index] !== null ? edge.read[index] : "&") +
					";" +
					(edge.write[index] !== null ? edge.write[index] : "&") +
					";" +
					edge.move[index] +
					(index + 1 < numOfTapes ? "|" : "");
			}
		else
			for (let index = 0; index < numOfTapes; index++) {
				label +=
					(edge.read !== null ? edge.read : "&") +
					";" +
					(edge.write !== null ? edge.write : "&") +
					";" +
					edge.move;
			}

		edgesData.update({
			id: ids.length > 0 ? ids[ids.length - 1] + 1 : i,
			from: edge.from,
			to: edge.to,
			label,
		});
		i++;
	});
};
