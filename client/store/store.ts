import { Action, createStore, createTypedHooks, action } from "easy-peasy";

import { settings, Settings } from "./settings";
import { loading, Loading } from "./loading";
import { links, Links } from "./links";
import { users, Users } from "./users";
import { auth, Auth } from "./auth";
import { linkChangeOwners, LinkChangeOwners} from "./linkChangeOwner";

export interface StoreModel {
  auth: Auth;
  links: Links;
  loading: Loading;
  settings: Settings;
  reset: Action;
  users: Users;
  linkChangeOwners: LinkChangeOwners;
}

let initState: any = {};

export const store: StoreModel = {
  auth,
  links,
  loading,
  settings,
  reset: action(() => initState),
  users,
  linkChangeOwners
};

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export const initializeStore = (initialState?: StoreModel) => {
  initState = initialState;
  return createStore(store, { initialState });
};
