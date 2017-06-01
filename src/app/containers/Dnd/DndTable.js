import React, {
  Component
} from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import cloneDeep from 'lodash/cloneDeep';
import * as Table from 'reactabular-table';
import * as dnd from './../../../lib/custom-dnd';
import * as resolve from 'table-resolver';
import { generateRows } from './../../helpers';
import PropTypes from 'prop-types';

const propTypes = {
  total: PropTypes.number.isRequired
};

const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    position: {
      type: 'string'
    },
    salary: {
      type: 'integer'
    },
    active: {
      type: 'boolean'
    }
  },
  required: ['id', 'name', 'position', 'salary', 'active']
};


@DragDropContext(HTML5Backend)
class DndTable extends Component {
  constructor(props) {
    super(props);

    const rows = generateRows(this.props.total, schema );

    this.state = {
      columns: [
        {
          property: 'name',
          props: {
            label: 'Name',
            style: {
              width: 100
            }
          },
          header: {
            label: 'Name',
            props: {
              label: 'Name',
              onMove: o => this.onMoveColumn(o)
            }
          },
        },
        {
          property: 'position',
          props: {
            label: 'Position',
            style: {
              width: 100
            }
          },
          header: {
            label: 'Position',
            props: {
              onMove: o => this.onMoveColumn(o)
            }
          }
        },
        {
          property: 'salary',
          props: {
            style: {
              width: 300
            }
          },
          header: {
            label: 'salary',
            props: {
              label: 'salary',
              onMove: o => this.onMoveColumn(o)
            }
          }
        }
      ],
      rows
    };

    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
    this.onMoveColumn = this.onMoveColumn.bind(this);
    this.onMoveChildColumn = this.onMoveChildColumn.bind(this);
  }
  render() {
    const components = {
      header: {
        cell: dnd.Header
      },
      body: {
        row: dnd.Row
      }
    };
    const { columns, rows } = this.state;
    const resolvedColumns = resolve.columnChildren({ columns });
    const resolvedRows = resolve.resolve({
      columns: resolvedColumns,
      method: resolve.nested
    })(rows);

    return (
      <Table.Provider
        components={components}
        columns={resolvedColumns}
      >
        <Table.Header
          headerRows={resolve.headerRows({ columns })}
        />

        <Table.Body
          rows={resolvedRows}
          rowKey="id"
          onRow={this.onRow}
        />
      </Table.Provider>
    );
  }
  onRow(row) {
    return {
      rowId: row.id,
      onMove: this.onMoveRow
    };
  }
  onMoveRow({ sourceRowId, targetRowId }) {
    const rows = dnd.moveRows({
      sourceRowId,
      targetRowId
    })(this.state.rows);

    if (rows) {
      this.setState({ rows });
    }
  }
  onMoveColumn(labels) {
    const movedColumns = dnd.moveLabels(this.state.columns, labels);

    if (movedColumns) {
      // Retain widths to avoid flashing while drag and dropping.
      const source = movedColumns.source;
      const target = movedColumns.target;
      const sourceWidth = source.props.style && source.props.style.width;
      const targetWidth = target.props.style && target.props.style.width;

      source.props.style = {
        ...source.props.style,
        width: targetWidth
      };
      target.props.style = {
        ...target.props.style,
        width: sourceWidth
      };

      this.setState({
        columns: movedColumns.columns
      });
    }
  }
  onMoveChildColumn(labels) {
    const movedChildren = dnd.moveChildrenLabels(this.state.columns, labels);

    if (movedChildren) {
      const columns = cloneDeep(this.state.columns);

      columns[movedChildren.target].children = movedChildren.columns;

      // Here we assume children have the same width.
      this.setState({ columns });
    }
  }
}

DndTable.propTypes = propTypes;
DndTable.defaultProps = {};

export default DndTable;
