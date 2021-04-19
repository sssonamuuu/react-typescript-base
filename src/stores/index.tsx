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
  switch (action.type) {
    case 'userinfo':
      return { ...state, userinfo: { ...state.userinfo, ...action.payload } as any };
    default:
      return state;
  }
};

export function useStore () {
  const { stores, reducer } = useContext(StoreContext);
  return {
    stores,
    setStoreUserinfo (userinfo: Partial<StoreProps['userinfo']>) {
      reducer({ type: 'userinfo', payload: userinfo });
    },
  };
}
