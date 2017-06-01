import * as AT from '../constants/ActionTypes';
import { cloneDeep, findIndex } from 'lodash';
import { generateRows } from './../helpers';

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
    1: generateRows(20, schema ),
    2: generateRows(10, schema ),
  }
};
export default function tables(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}