import * as AT from '../constants/ActionTypes';
import uuid from 'uuid';

export function updateFilteredTools(filteredItems) {
  return function (dispatch) {
    dispatch({
      type: AT.FETCH_DATA,
      payload: filteredItems
    })
  }
}

export function createRow() {
  return function (dispatch) {
    dispatch({
      type: AT.CREATE_ROW,
      row: { name: 'John Doe', id: uuid.v4() }
    })
  }
}

export function deleteRow() {
  return function (dispatch) {
    dispatch({
      type: AT.DELETE_ROW,
      row: { id }
    })
  }
}

export function editRow() {
  return function (dispatch) {
    dispatch({
      type: AT.EDIT_ROW,
      row: { columnIndex, id }
    })
  }
}

export function confirmEdit() {
  return function (dispatch) {
    dispatch({
      type: AT.CONFIRM_EDIT,
      row: { property, value, id }
    })
  }
}