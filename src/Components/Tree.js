
import React from 'react';
import Tree from 'react-tree-graph';
import 'react-tree-graph/dist/style.css'
import "../CustomTree.css"
const TreeVIew = () => {
  let data = {
	name: 'Parent',
	children: [{
		name: 'Child One',
        children:[{
            name:"child3"
        }]
	}, {
		name: 'Child Two'
	}]
};

  return (
    <Tree
	data={data}
    nodeRadius={15}
    margins={{ top: 20, bottom: 10, left: 20, right: 200 }}
	height={700}
	width={1000}
	animated={true}/>
  );
}

export default TreeVIew;