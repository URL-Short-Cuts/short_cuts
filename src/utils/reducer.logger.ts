import { isTest, isProduction } from "./env";
import type { ActionType } from "../types/utils/reducer.d";
import type { Reducer } from "react";

const reducerLoggingMiddleware = <STATE, ACTION extends ActionType>(
  reducer: Reducer<STATE, ACTION>
): Reducer<STATE, ACTION> => {
  const name = reducer.name;
  const logging: boolean = !isTest() && !isProduction();
  const wrappedReducer = (state: STATE, action: ACTION) => {
    if (logging)
      console.log(`** ${name} BEFORE ${action.type}:\n`, { state, action });
    state = reducer(state, action);
    if (logging)
      console.log(`** ${name} AFTER ${action.type}:\n`, { state, action });
    return state;
  };
  return wrappedReducer;
};

export default reducerLoggingMiddleware;
