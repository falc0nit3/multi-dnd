import * as AT from '../constants/ActionTypes';
import { cloneDeep, findIndex } from 'lodash';

function editProperty(rows, index, values) {
  // Skip mutation, there's likely a neater way to achieve this
  const ret = cloneDeep(rows);

  Object.keys(values).forEach(v => {
    ret[index][v] = values[v];
  });

  return ret;
}

export default function tables(state = {}, action) {
  const row = action.row;
  const index = row && findIndex(state, {id: row.id});

  switch (action.type) {
    case AT.CREATE_ROW:
      return [row].concat(state);

    case AT.DELETE_ROW:
      if (index >= 0) {
        return state.slice(0, index).concat(state.slice(index + 1));
      }
      break;

    case AT.EDIT_ROW:
      if (index >= 0) {
        return editProperty(state, index, {
          editing: row.columnIndex
        });
      }
      break;

    case AT.CONFIRM_EDIT:
      if (index >= 0) {
        return editProperty(state, index, {
          [row.property]: row.value,
          editing: false
        });
      }
      break;

    default:
      return state;
  }
}