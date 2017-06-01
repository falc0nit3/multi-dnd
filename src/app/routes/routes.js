import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

// Main Route Components
import Dnd from '../containers/Dnd/DndTables';

const Routes = () => (
  <Router>
    <div className="route-wrapper">
      <Route exact path="/" component={Dnd} />
    </div>
  </Router>
);

export default Routes;