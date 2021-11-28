import type {
  MiddlewareOrReducerType,
  MiddlewareType,
  NestedType,
} from "../types/utils/reducer.d";
import type { Reducer } from "react";

const withMiddleware = <STATE, ACTION>(
  originalReducer: Reducer<STATE, ACTION>,
  middlewareStack: MiddlewareType<STATE, ACTION>[],
): Reducer<STATE, ACTION> => {
  const combinedStack: MiddlewareOrReducerType<STATE, ACTION>[] = [
    ...middlewareStack,
  ];
  const reducerWithMiddleWare = combinedStack.reduce(
    (last, middlewareToApply) => {
      return (middlewareToApply as NestedType<STATE, ACTION>)(last);
    },
    originalReducer,
  );
  return reducerWithMiddleWare as Reducer<STATE, ACTION>;
};

export default withMiddleware;
