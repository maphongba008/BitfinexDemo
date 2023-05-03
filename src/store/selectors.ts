import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ReduxState } from "./types";
import { store } from "./index";

type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<ReduxState> = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();
