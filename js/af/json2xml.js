/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/

function json2xml(nodesData, edgeData, initialNode, finalNodes) {
	let edges = edgeData._data;
	let numOfTapes = edges[1].label.split("|").length;
	let xml =
		'<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
		"<structure>\n" +
		"<type>turing</type>\n" +
		(numOfTapes > 1 ? `<tapes>${numOfTapes}</tapes>\n` : "") +
		"<automaton>\n";

	let nodes = nodesData._data;
	nodes.length = nodesData.length;
	console.warn(nodes);
	edges.length = edgesData.length;
	console.warn(edges);

	let count = nodes.length;
	//adicionando estados
	for (var i in nodes) {
		if (nodes.hasOwnProperty(i)) {
			xml += `<state id="${nodes[i].id}" name="${nodes[i].label}">\n`;
			xml += `<x>${nodes[i].x}</x>\n`;
			xml += `<y>${nodes[i].y}</y>\n`;
			if (initialNode.id === nodes[i].id) {
				xml += `<initial/>\n`;
			}

			let finals = [];
			for (var node in finalNodes) {
				if (finalNodes.hasOwnProperty(node)) {
					finals.push(finalNodes[node].id);
				}
			}
			for (let j = 0; j < finals.length; j++) {
				if (String(nodes[i].id) == finals[j]) {
					xml += `<final/>\n`;
					break;
				}
			}
			xml += `</state>\n`;
		}
		count--;
		if (count === 0) break;
	}

	//adicionando transições
	for (let index = 1; index <= edges.length; index++) {
		if (edges.hasOwnProperty(index)) {
			let fitas = edges[index].label.split("|");
			console.log(fitas);

			xml += `<transition>\n`;
			xml += `<from>${edges[index].from}</from>\n`;
			xml += `<to>${edges[index].to}</to>\n`;

			if (fitas.length > 1)
				for (let i = 0; i < fitas.length; i++) {
					regra = fitas[i].split(";");
					console.log(regra);
					xml +=
						regra[0] !== "&"
							? `<read tape = "${i + 1}">${regra[0]}</read>\n`
							: `<read tape = "${i + 1}"/>\n`;
					xml +=
						regra[1] !== "&"
							? `<write tape = "${i + 1}">${regra[1]}</write>\n`
							: `<write tape = "${i + 1}"/>\n`;
					xml += `<move tape = "${i + 1}">${regra[2]}</move>\n`;
				}
			else {
				regra = fitas[0].split(";");
				xml +=
					regra[0] !== "&"
						? `<read>${regra[0]}</read>\n`
						: `<read/>\n`;
				xml +=
					regra[1] !== "&"
						? `<write>${regra[1]}</write>\n`
						: `<write/>\n`;
				xml += `<move>${regra[2]}</move>\n`;
			}
			xml += `</transition>\n`;
		}
	}

	xml += "</automaton>\n";
	xml += "</structure>";

	return xml;
}
