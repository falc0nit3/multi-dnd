import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DnDTable from './DndTable';
import { moveRow } from '../../actions/TableActions';
import { bindActionCreators } from 'redux';

const propTypes = {
  dndtables: PropTypes.object.isRequired,
  moveAction: PropTypes.func.isRequired
};

class DndTables extends Component {
  render() {
    const { dndtables, moveAction } = this.props;
    const tables = dndtables.tables;
    return (
      <div>
        {
          Object.keys(tables).map(function (key) {
            const items = tables[key];
            return (
              <div key={key}>
              <DnDTable
                onMoveHandler={moveAction}
                type={key}
                rows={items}/>
              </div>
            )
          })
        }
      </div>
    );
  }
}

DndTables.propTypes = propTypes;
DndTables.defaultProps = {};

function mapStateToProps(state) {
  return {
    dndtables: state.dndtables
  };
}

function mapDispatchToProps(dispatch){
  return {
    moveAction: bindActionCreators(moveRow, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DndTables);