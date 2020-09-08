/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/

function json2xml(nodesData, edgeData, initialNode, finalNodes) {
   let xml = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
      '<structure>\n' +
      '<type>fa</type>\n' +
      '<automaton>\n';

   let nodes = nodesData._data;
   nodes.length = nodesData.length;
   console.warn(nodes);
   let edges = edgesData._data;
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
         };
         xml += `</state>\n`;
      }
      count--;
      if (count === 0) break;
   }

   count = edges.length;
   //adicionando transições
   for (var i in edges) {
      if (edges.hasOwnProperty(i)) {
         xml += `<transition>\n`;
         xml += `<from>${edges[i].from}</from>\n`;
         xml += `<to>${edges[i].to}</to>\n`;
         if (edges[i].label === "λ") {
            xml += `<read/>\n`;
         }
         else {
            xml += `<read>${edges[i].label}</read>\n`;
         }
         xml += `</transition>\n`;
      }

      count--;
      if (count === 0) break;
   };

   xml += '</automaton>\n';
   xml += '</structure>';

   return xml;
}