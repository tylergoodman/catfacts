import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import * as actions from './actions';


export enum TypeKeys {
  INC = "INC",
  DEC = "DEC",
  OTHER_ACTION = "__any_other_action_type__"
}

export interface OtherAction {
  type: TypeKeys.OTHER_ACTION;
}

export type Actions =
  OtherAction;


export type State = {
  readonly form: any;
};

const makeStore = (initialState: any) => createStore(
  combineReducers<State, Actions>({
    form: formReducer,
  }),
  initialState,
  compose(
    applyMiddleware(
      thunk,
      logger,
    ),
  ),
);

export default makeStore;
