import React from 'react';

interface UseModel {
  name: string;
  id: number;
}

const defaultValue: UseModel = { } as unknown as UseModel;

const Context = createContext(defaultValue);

interface Action {type: 'set'; payload: UseModel}
function reducer (state: UseModel, action: Action) {
  switch (action.type) {
    case 'set':
      return action.payload;
    default:
      return state;
  }
}

export function UserProvider ({ children }: PropsWithChildren<{}>) {
  const [user, dispatch] = useReducer(reducer, defaultValue);
  return <Context.Provider value={{ user, dispatch } as any}>{children}</Context.Provider>;
}

export function useUser () {
  const { user, dispatch } = useContext(Context) as unknown as { user: UseModel; dispatch: Dispatch<Action> };

  return {
    user,
    setUser (user: UseModel) {
      dispatch({ type: 'set', payload: user });
    },
  };
}
