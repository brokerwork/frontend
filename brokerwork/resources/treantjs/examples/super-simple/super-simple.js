
var simple_chart_config = {
	chart: {
		container: "#OrganiseChart-simple",
		connectors: {type: 'step'},
		node: {
            HTMLclass: 'nodeExample1'
        }
	},
	
	nodeStructure: {
		text: { name: "Parent node" },
		children: [
			{
				text: { name: "AAA" },
				children: [
					{ 
						text: {name: 'DDD'},
						children: [
							{text: {name: 'I'}},
				
							{text: {name: 'J'}}
						] 
					},
					{ text: {name: 'EEE'} },
					{ text: {name: 'FFF'} }
				]
			},
			{
				text: { name: "BBB" },
				children:[
					{ text: {name: 'G'} },
					{ text: {name: 'H'} },
				]
			},
			{
				text: { name: "CCC" }
			}
		]
	}
};

// // // // // // // // // // // // // // // // // // // // // // // // 

var config = {
	container: "#OrganiseChart-simple",
	connectors: {type: 'step'}
};

var parent_node = {
	text: { name: "Parent node" }
};

var first_child = {
	parent: parent_node,
	text: { name: "First child" }
};

var second_child = {
	parent: parent_node,
	text: { name: "Second child" }
};

// var simple_chart_config = [
// 	config, parent_node,
// 		first_child, second_child 
// ];
