import * as AT from '../constants/ActionTypes';

export function moveRow(sourceRowId, targetRowId, sourceTableId, destinationTableId){
  return function (dispatch) {
    dispatch({
      type: AT.MOVE_ROW,
      payload: { sourceRowId, targetRowId, sourceTableId, destinationTableId }
    })
  }
}