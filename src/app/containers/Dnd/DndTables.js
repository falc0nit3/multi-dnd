import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DnDTable from './DndTable';

const propTypes = {
  dndtables: PropTypes.object.isRequired
};

class DndTables extends Component {
  render() {
    const tables = this.props.dndtables.tables;
    return (
      <div>
        {
          Object.keys(tables).map(function (key) {
            const items = tables[key];
            return (
              <div key={key}>
              <DnDTable
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
export default connect(mapStateToProps)(DndTables);