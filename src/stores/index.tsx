import React, { useContext } from 'react';

interface StoreProps {
  userinfo: null | { name: string; age: string };
}

type StoreReducer<K extends keyof StoreProps = keyof StoreProps> = React.Reducer<StoreProps, {
  type: K;
  payload: Partial<StoreProps[K]>;
}>;

export const StoreContext = React.createContext<{ stores: StoreProps; reducer: React.Dispatch<React.ReducerAction<StoreReducer>> }>(null as any);

export const storeDefaultValue: StoreProps = {
  userinfo: null,
};

export const storeReducer: StoreReducer = (state, action): StoreProps => {
  const nextState = { ...state };
  nextState[action.type] = action.payload as any;
  return nextState;
};

export function useStore () {
  const { stores, reducer } = useContext(StoreContext);
  const result = {
    stores,
  };

  Object.keys(storeDefaultValue).forEach(key => {
    result[`set${key.replace(/^([a-z])(.*)$/, (_, $1, $2) => $1.toUpperCase() + $2)}`] = function (value: any) {
      reducer({ type: key as any, payload: value });
    };
  });

  return result;
}
