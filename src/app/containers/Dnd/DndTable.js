import React, {
  Component
} from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import cloneDeep from 'lodash/cloneDeep';
import * as Table from 'reactabular-table';
import * as dnd from './../../../lib/custom-dnd';
import * as resolve from 'table-resolver';
import PropTypes from 'prop-types';


const propTypes = {
  rows: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  onMoveHandler: PropTypes.func.isRequired
};

@DragDropContext(HTML5Backend)
class DndTable extends Component {
  constructor(props) {
    super(props);

    //const rows = generateRows(this.props.total, schema );
    const rows = this.props.rows;

    this.state = {
      columns: [
        {
          property: 'id',
          props: {
            label: 'ID',
            style: {
              width: 200
            }
          },
          header: {
            label: 'ID',
            props: {
              label: 'ID',
              onMove: o => this.onMoveColumn(o)
            }
          },
        },
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
      rows,
      tableId: this.props.type
    };

    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
    this.onMoveColumn = this.onMoveColumn.bind(this);
    this.onMoveChildColumn = this.onMoveChildColumn.bind(this);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.rows !== nextProps.rows) {
      this.setState({rows: nextProps.rows});
    }
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
      onMove: this.onMoveRow,
      tableId: this.state.tableId
    };
  }
  onMoveRow({ sourceRowId, targetRowId, sourceTableId, destinationTableId }) {

    const { onMoveHandler } = this.props;
    onMoveHandler(sourceRowId, targetRowId, sourceTableId, destinationTableId);

    if (false) {
      const rows = dnd.moveRows({
        sourceRowId,
        targetRowId
      })(this.state.rows);

      if (rows) {
        this.setState({rows});
      }
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
