import { action, Action, thunk, Thunk } from "easy-peasy";
import axios from "axios";
import query from "query-string";

import { getAxiosConfig } from "../utils";
import { API, APIv2 } from "../consts";

interface LinkChangeOwner {
  id: number;
  owner: number;
  newOwner: number;
  link_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface NewLinkChangeOwner {
  newOwner: number;
  link_id: string;
}

export interface LinkChangeOwnerQuery {
  newOwner: number;
}

export interface LinkChangeOwnerRes {
  data: LinkChangeOwner[];
  total: number;
  limit: number;
  skip: number;
}

export interface LinkChangeOwners {
  items: LinkChangeOwner[];
  total: number;
  loading: boolean;
  get: Thunk<LinkChangeOwners, LinkChangeOwnerQuery>;
  submit: Thunk<LinkChangeOwners, NewLinkChangeOwner>;
  set: Action<LinkChangeOwners, LinkChangeOwnerRes>;
}

export const linkChangeOwners: LinkChangeOwners = {
  items: [],
  total: 0,
  loading: true,
  get: thunk(async (actions, payload) => {
    const res = await axios.get(
      `${APIv2.LinkChangeOwners}?${query.stringify(payload)}`,
      getAxiosConfig()
    );
    actions.set(res.data);
    return res.data;
  }),
  submit: thunk(async (actions, payload) => {
    const data = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== "")
    );
    const res = await axios.post(APIv2.LinkChangeOwners, data, getAxiosConfig());
    return res.data;
  }),
  set: action((state, payload) => {
    state.items = payload.data;
  })

};
