import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

const DragTypes = {
  ROW: 'row'
};
const rowSource = {
  canDrag({ rowId, onCanMove }) {
    return onCanMove ? onCanMove({ rowId }) : true;
  },
  beginDrag({ rowId, tableId, onMoveStart }) {
    onMoveStart && onMoveStart({ rowId });
    //console.log('Begin Drag: ' + tableId);
    return { rowId, tableId };
  },
  endDrag({ rowId, onMoveEnd }) {
    onMoveEnd && onMoveEnd({ rowId });
  },
  isDragging(props, monitor) {
    const item = monitor.getItem();
    const isDragging = props.rowId === item;
    // console.log('Is Draggin ');
    // console.log(props);
    // console.log(item);
    // console.log(isDragging);
    return isDragging;
  }
};
const rowTarget = {
  hover(targetProps, monitor) {
    const targetRowId = targetProps.rowId;
    const sourceProps = monitor.getItem();
    const sourceRowId = sourceProps.rowId;
    const canDrop = monitor.canDrop();
    const sourceTableId = sourceProps['tableId'];
    const destinationTableId = targetProps['tableId'];

    //console.log("canDrop: " + canDrop + " SourceRowId: " + sourceRowId + " TargetRowId: " + targetRowId + " sourceTable: " + sourceTableId + " destinationTable: " + destinationTableId);
    // TODO: check if sourceRowId and targetRowId are undefined -> warning
    if (sourceRowId !== targetRowId) {
      targetProps.onMove({ sourceRowId, targetRowId, sourceTableId, destinationTableId });
    }
  }
};

const dragSource = DragSource( // eslint-disable-line new-cap
  DragTypes.ROW, rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
);
const dropTarget = DropTarget( // eslint-disable-line new-cap
  DragTypes.ROW, rowTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  })
);
const DraggableRow = ({
  _parent,
  connectDragSource, connectDropTarget,
  onCanMove, onMoveStart, onMoveEnd, // eslint-disable-line no-unused-vars
  onMove, rowId, tableId, isDragging, ...props // eslint-disable-line no-unused-vars
}) => (
  // If you want to drag using a handle instead, then you need to pass
  // connectDragSource to a customized cell (DndCell) through React
  // context and wrap the handle there. You also need to annotate
  // this function using connectDragPreview.
  //
  // https://github.com/gaearon/react-dnd/releases/tag/v2.0.0 - ref trick
  React.createElement(
    _parent,
    {
      ...props,
      ref: (e) => {
        if (!e) {
          return;
        }

        const node = findDOMNode(e);

        //console.log('isDragging: ' + isDragging);

        // Chaining is not allowed
        // https://github.com/gaearon/react-dnd/issues/305#issuecomment-164490014
        connectDropTarget(node);
        connectDragSource(node);
      }
    }
  )
);
DraggableRow.propTypes = {
  _parent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node
  ]).isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  onMove: PropTypes.func.isRequired,
  onCanMove: PropTypes.func,
  onMoveStart: PropTypes.func,
  onMoveEnd: PropTypes.func,
  rowId: PropTypes.any.isRequired,
  tableId: PropTypes.any.isRequired
};

const SourceTargetDraggableRow = dragSource(dropTarget(DraggableRow));

const draggableRow = (_parent) => {
  function draggable(children) {
    return React.createElement(
      SourceTargetDraggableRow,
      {
        _parent,
        ...children
      }
    );
  }

  // Copy possible shouldComponentUpdate over or otherwise features
  // like virtualization won't work.
  draggable.shouldComponentUpdate = _parent.shouldComponentUpdate;

  return draggable;
};

export default draggableRow;
