import React from "react";
import Tree from "../components/Tree";
import { action } from "@storybook/addon-actions";

const TreeNode = Tree.TreeNode;
export default {
  chapters: [
    {
      sections: [
        {
          title: "树形控件",
          info: "树形控件",
          sectionFn: () => {
            
            return (
              <div>
                <Tree
                  defaultExpandedKeys={['0-0-0', '0-0-1']}
                  defaultSelectedKeys={['0-0-0', '0-0-1']}
                  defaultCheckedKeys={['0-0-0', '0-0-1']}
                  onSelect={this.onSelect}
                  onCheck={this.onCheck}
                >
                  <TreeNode title="parent 1" key="0-0">
                    <TreeNode title="parent 1-0" key="0-0-0" disabled>
                      <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
                      <TreeNode title="leaf" key="0-0-0-1" />
                    </TreeNode>
                    <TreeNode title="parent 1-1" key="0-0-1">
                      <TreeNode title="wgrhr" key="0-0-1-0" />
                    </TreeNode>
                  </TreeNode>
                </Tree>
                <Tree
                  checkable
                  defaultExpandedKeys={['0-0-0', '0-0-1']}
                  defaultSelectedKeys={['0-0-0', '0-0-1']}
                  defaultCheckedKeys={['0-0-0', '0-0-1']}
                  onSelect={this.onSelect}
                  onCheck={this.onCheck}
                >
                  <TreeNode title="parent 2" key="0-0">
                    <TreeNode title="parent 2-0" key="0-0-0" disabled>
                      <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
                      <TreeNode title="leaf" key="0-0-0-1" />
                    </TreeNode>
                    <TreeNode title="parent 2-1" key="0-0-1">
                      <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
                    </TreeNode>
                  </TreeNode>
                </Tree>  
              </div>
            );
          }
        }
      ]
    }
  ]
};
