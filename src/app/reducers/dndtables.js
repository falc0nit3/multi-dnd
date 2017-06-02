import * as AT from '../constants/ActionTypes';
import { generateRows } from './../helpers';
import * as dnd from './../../lib/custom-dnd';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import includes from 'lodash/includes';
import { isEmptyObj }from '../utils/utils';

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

const initialState = {
  tables: {
    1: generateRows(20, schema),
    2: generateRows(10, schema),
    3: [],
  },
  changed: false
};
export default function tables(state = initialState, action) {
  switch (action.type) {
    case AT.MOVE_ROW: {
      const payload = action.payload;
      const sourceRowId = payload.sourceRowId;
      const targetRowId = payload.targetRowId;
      const sourceTableIndexREN = payload.sourceTableId;
      const targetTableIndexREN = payload.destinationTableId;

      const tables = state.tables;

      // Go through existing levels and get the highest level
      // Object.keys(newItems).map(function(key){
      //   if(parseInt(key) > highestCurrentLevel){
      //     highestCurrentLevel = key;
      //   }
      // });

      // const sourceTable = tables.filter(table => table.includes(sourceRowId))[0];
      // const targetTable = tables.filter(table => table.includes(targetRowId))[0];


      let sourceTableIndex = -1;
      let targetTableIndex = -1;
      // for (let i = 0; i < tables.length; i++) {
      //   const t = tables[i];
      //   const index = findIndex(t, {id: sourceRowId});
      //   if(index !== -1){
      //     st = t;
      //     sk = i;
      //     break;
      //   }
      // }

      // for (let i = 0; i < tables.length; i++) {
      //   const t = tables[i];
      //   const index = findIndex(t, {id: sourceRowId});
      //   if(index !== -1){
      //     st = t;
      //     sk = i;
      //     break;
      //   }
      // }

      Object.keys(tables).map(function(key){
        const t = tables[key];
        const sindex = findIndex(t, {id: sourceRowId});
        const tindex = findIndex(t, {id: targetRowId});
        if(sindex !== -1){
          sourceTableIndex = key;
        }

        if(tindex !== -1){
          targetTableIndex = key;
        }
      });

      // Object.keys(tables).map(function(key){
      //   const t = tables[key];
      //   const index = findIndex(t, {id: sourceRowId});
      //   if(index !== -1){
      //     st = t;
      //   }
      // });

      // tables.map((table) => {
      //   const index = findIndex(table, {id: sourceRowId});
      //   if(index !== -1){
      //     st = table;
      //   }
      //   return '1';
      // });

      //const tempSourceTable = tables.filter(table => includes(table, {id: sourceRowId}))[0];
      console.log('Temp Source Table!!!');
      console.log(sourceTableIndex);
      console.log(targetTableIndex);

      console.log('Attempting to move - sourceId: ' + sourceRowId + ' , targetId: ' + targetRowId);
      console.log('Attempting to move - sourceTable: ' + sourceTableIndex + ' , targetTable: ' + targetTableIndex);

      if (sourceTableIndex === targetTableIndex) {
        console.log('Moving Rows in Store');
        const newrows = dnd.moveRows({
          sourceRowId,
          targetRowId
        })(tables[sourceTableIndex]);

        console.log(newrows);

        const newTables = cloneDeep(state.tables);
        newTables[sourceTableIndex] = newrows;

        return Object.assign({}, state, {tables: newTables, changed: !state.changed});
      }
      else{
        // Different Table
        console.log('Different Table Move');
        const newTables = cloneDeep(state.tables);

        // Get rid of the source
        const sourceRowIndex = findIndex(newTables[sourceTableIndex], {id: sourceRowId});
        let toMoveObject = {};

        // If we find a valid row in the source table, we get rid of it first.
        if(sourceRowIndex !== -1){
          toMoveObject = newTables[sourceTableIndex].filter(row => row['id'] === sourceRowId)[0];
          newTables[sourceTableIndex].splice(sourceRowIndex, 1);
          console.log('SourceRowIndex: ' + sourceRowIndex);
          console.log(newTables[sourceTableIndex]);
        }

        // Add it to the new table
        const targetRowIndex = findIndex(newTables[targetTableIndex], {id: targetRowId});
        if (targetRowIndex !== -1 && !isEmptyObj(toMoveObject)) {
          console.log('targetRowIndex: ' + targetRowIndex);
          newTables[targetTableIndex].splice(targetRowIndex, 0, toMoveObject);
          console.log(newTables[targetTableIndex]);
        }

        return Object.assign({}, state, {tables: newTables, changed: !state.changed});
      }
    }
    case AT.ATTACH_ROW: {
      const payload = action.payload;
      const rowId = payload.sourceRowId;
      const tableId = payload.tableId;

      const tables = cloneDeep(state.tables);
      console.log('ATTACH_ROW!');

      let toMoveObject = {};
      Object.keys(tables).map(function(key){
        const table = tables[key];
        const rowIndex = findIndex(table, {id: rowId});

        // If we have found the table that contains this row, we remove it from there and add it to our destination table
        if (rowIndex !== -1) {
          toMoveObject = table.filter(row => row['id'] === rowId)[0];

          // Remove it from this table
          table.splice(rowIndex, 1);
        }
      });

      // Add the source row to the destination table
      if (!isEmptyObj(toMoveObject)){
        tables[tableId].push(toMoveObject);
      }

      return Object.assign({}, state, {tables: tables, changed: !state.changed});
    }
    default:
      return state;
  }
}