import { action, Action, thunk, Thunk } from "easy-peasy";
import axios from "axios";
import query from "query-string";

import { getAxiosConfig } from "../utils";
import { API, APIv2 } from "../consts";
import {Link} from "./links"
import { User } from "./users";

interface LinkTransfert {
  id: number;
  receiver_id: number;
  sender_id: number;
  link_id: string;//uuid
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  link: Link;
  receiver:User;
  sender:User;
}

export interface NewLinkTransfert {
  type: string;
  receiver_id?: number;
  sender_id?: number;
  link_id: string;
}

interface EditLinkTransfert {
  id: number;
  status: string;
}
export interface LinkTransfertRes {
  data: LinkTransfert[];
}

export interface LinkTransferts {
  items: LinkTransfert[];
  total: number;
  loading: boolean;
  get: Thunk<LinkTransferts>;
  submit: Thunk<LinkTransferts, NewLinkTransfert>;
  edit: Thunk<LinkTransferts, EditLinkTransfert>;
  update: Action<LinkTransferts, Partial<LinkTransfert>>;
  set: Action<LinkTransferts, LinkTransfertRes>;
}

export const linkTransferts: LinkTransferts = {
  items: [],
  total: 0,
  loading: true,
  get: thunk(async (actions, payload) => {
    const res = await axios.get(APIv2.LinkTransferts,getAxiosConfig());
    actions.set(res.data);
    return res.data;
  }),
  submit: thunk(async (actions, payload) => {
    const data = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== "")
    );
    const res = await axios.post(APIv2.LinkTransferts, data, getAxiosConfig());
    return res.data;
  }),
  edit: thunk(async (actions, { id, ...payload }) => {
    const res = await axios.patch(
      `${APIv2.LinkTransferts}/${id}`,
      payload,
      getAxiosConfig()
    );
    actions.update(res.data);
  }),
  update: action((state, payload) => {
    state.items = state.items.map(item =>
      item.id === payload.id ? { ...item, ...payload } : item
    );
  }),
  set: action((state, payload) => {
    state.items = payload.data;
  })

};
