import React, {
  Component
} from 'react';

import { compose, createStore } from 'redux';
import { connect } from 'react-redux';

import * as Table from 'reactabular-table';
import * as edit from 'react-edit';
import uuid from 'uuid';
import PropTypes from 'prop-types';

import { generateRows } from './../../helpers';

const propTypes = {};

class DnDTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns() // initial columns
    };
  }

  getColumns() {
    const editable = edit.edit({
      isEditing: ({columnIndex, rowData}) => columnIndex === rowData.editing,
      onActivate: ({columnIndex, rowData}) => {
        this.props.editRow(columnIndex, rowData.id);
      },
      onValue: ({value, rowData, property}) => {
        this.props.confirmEdit(property, value, rowData.id);
      }
    });

    return [
      {
        property: 'name',
        header: {
          label: 'Name'
        },
        cell: {
          transforms: [editable(edit.input())]
        }
      },
      {
        property: 'position',
        header: {
          label: 'Position'
        },
        cell: {
          transforms: [editable(edit.input())]
        }
      },
      {
        property: 'salary',
        header: {
          label: 'Salary'
        },
        cell: {
          transforms: [editable(edit.input({props: {type: 'number'}}))]
        }
      },
      {
        property: 'active',
        header: {
          label: 'Active'
        },
        cell: {
          transforms: [editable(edit.boolean())],
          formatters: [active => active && <span>&#10003;</span>]
        }
      },
      {
        props: {
          style: {
            width: 50
          }
        },
        cell: {
          formatters: [
            (value, {rowData}) => (
              <span
                className="remove"
                onClick={() => this.props.deleteRow(rowData.id)} style={{cursor: 'pointer'}}
              >
                &#10007;
              </span>
            )
          ]
        }
      }
    ];
  }

  render() {
    const {rows} = this.props;
    const {columns} = this.state;

    return (
      <div>
        <Table.Provider
          className="pure-table pure-table-striped"
          columns={columns}
        >
          <Table.Header />

          <tbody>
          <tr>
            <td>
              <button type="button" onClick={e => {
                e.preventDefault();

                this.props.createRow();
              }}>Add new
              </button>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </tbody>

          <Table.Body rows={rows} rowKey="id" />
        </Table.Provider>
      </div>
    );
  }
}

DnDTable.propTypes = propTypes;
DnDTable.defaultProps = {};

export default connect()(DnDTable);