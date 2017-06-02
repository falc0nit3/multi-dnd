import React from 'react';
import {compose} from 'redux';
import {DropTarget} from 'react-dnd';
import { connect } from 'react-redux';
import * as TableActions from './../../actions/TableActions';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

const tableTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.rowId;
    const tableId = targetProps.tableId;


    if(!targetProps.rows.length) {
      console.log('AttachToTable!: ' + sourceId);
      //TableActions.attachRow(sourceId, tableId);
      targetProps.onAttachHandler(sourceId, tableId);
    }
  }
};

const DndTableTarget = ({
  connectDropTarget, rows, tableId, tableActions, dtables, onAttachHandler, ...props
}) => (
  connectDropTarget(
    <div className="table-target" {...props}>
    </div>
  )
);

const dropTarget = DropTarget('row', tableTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}));

DndTableTarget.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  tableId: PropTypes.string.isRequired,
  onAttachHandler: PropTypes.func.isRequired
};



function mapStateToProps(state) {
  return {
    dtables: state.dndtables
  };
}

function mapDispatchToProps(dispatch){
  return {
    tableActions: bindActionCreators(TableActions, dispatch)
  }
}

const TargetTable = compose(dropTarget, connect(mapStateToProps, mapDispatchToProps))(DndTableTarget);
export default TargetTable;

// const TargetTable = dropTarget(DndTableTarget);
// export default TargetTable;

// export default compose(
//   targetDndTable,
//   connect(({}) => ({}), {TableActions})
// )(DndTableTarget)

// export default compose(
//   dropTarget,
//   connect((dispatch) => ({tableActions: bindActionCreators(TableActions, dispatch)}))
// )(DndTableTarget)

//export default connect({}, mapDispatchToProps)(DndTableTarget);
//export default compose(targetDndTable, connect(mapStateToProps, mapDispatchToProps))(DndTableTarget)