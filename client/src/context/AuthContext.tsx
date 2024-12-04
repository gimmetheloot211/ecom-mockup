import {
  createContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface IUser {
  username: string;
  token: string;
  admin: boolean;
}

interface AuthState {
  user: IUser | null;
}

type AuthAction = { type: "LOGIN"; payload: IUser } | { type: "LOGOUT" };

interface AuthContextType extends AuthState {
  dispatch: React.Dispatch<AuthAction>;
  isLoading: boolean;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
