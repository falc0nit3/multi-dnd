import React, {
  Component
} from 'react';

import DnDTable from './DndTable';

const propTypes = {};

class DndTables extends Component {
  render() {
    return (
      <div>
        <DnDTable
          total={20}/>
        <DnDTable
          total={10}/>
      </div>
    );
  }
}

DndTables.propTypes = propTypes;
DndTables.defaultProps = {};

export default DndTables;
