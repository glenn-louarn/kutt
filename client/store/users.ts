import { action, Action, thunk, Thunk } from "easy-peasy";
import axios from "axios";
import query from "query-string";

import { getAxiosConfig } from "../utils";
import { API, APIv2 } from "../consts";


export interface User {
  id: string;
  email: string;
}


export interface UsersListRes {
  data: User[];
  limit: number;
  skip: number;
}
export interface UsersQuery {
  limit: string;
  skip: string;
}

export interface Users {
  items: User[];
  total: number;
  loading: boolean;
  getAll: Thunk<Users, UsersQuery>;
  set: Action<Users, UsersListRes>;
}

export const users: Users = {
  items: [],
  total: 0,
  loading: true,
  getAll: thunk(async (actions, payload) => {
    const res = await axios.get(
      `${APIv2.Users}/all?${query.stringify(payload)}`,
      getAxiosConfig()
    );
    actions.set(res.data);
    return res.data;
  }),
  set: action((state, payload) => {
    state.items = payload.data;
  })
};
