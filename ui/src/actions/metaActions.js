import {createAction} from "redux-act";
import asyncActionCreator from "./asyncActionCreator";
import { endpoint } from 'src/app/api';

export const fetchMetadata = asyncActionCreator(() => async dispatch => {
  const response = await endpoint.get('metadata');
  return { metadata: response.data };
}, { name: 'FETCH_METADATA' });

export const fetchStatistics = asyncActionCreator(() => async dispatch => {
  const response = await endpoint.get('statistics');
  return { statistics: response.data };
}, { name: 'FETCH_STATISTICS' });

export const setLocale = createAction('SET_LOCALE');