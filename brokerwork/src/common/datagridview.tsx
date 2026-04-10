/*
* Abstraction of all datagrid based page
* */
import * as React from 'react';
import {Table, Pagination} from 'fooui';

class DataGridView extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'C1',
                    renderer: function () {

                    },
                    headerRenderer: function () {
                        return <input type="checkbox"/>
                    }
                }
            ],
            rowDatas: []
        }
    }
    render() {
        return (
            <div>
                <div className="filter-row">
                    <div className="normal-search"></div>
                    <div className="fuzy-search"></div>
                </div>
                <div className="table-row">
                    <Table columns={this.state.columns}
                        data={this.state.rowDatas}
                        />
                </div>
                <div className="pagination-row">
                    <Pagination/>
                </div>
            </div>
        )
    }
}

export {DataGridView}