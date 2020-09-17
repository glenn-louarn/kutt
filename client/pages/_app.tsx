import App, { AppContext } from "next/app";
import { StoreProvider } from "easy-peasy";
import getConfig from "next/config";
import Router from "next/router";
import decode from "jwt-decode";
import cookie from "js-cookie";
import Head from "next/head";
import React from "react";
import styled from 'styled-components'

import { initGA, logPageView } from "../helpers/analytics";
import { initializeStore } from "../store";
import { TokenPayload } from "../types";
import i18n from '../../i18n'
import ThemeProvider from '../components/ThemeProvider'
import { linkTransferts, LinkTransfertRes } from '../store/linkTransferts'

const isProd = process.env.NODE_ENV === "production";

import { API, APIv2 } from "../consts";
import axios from "axios";
import { getAxiosConfig } from "../utils";

const { publicRuntimeConfig } = getConfig();


const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.background.main};
  font: 16px/1.45 "Nunito", sans-serif;
  color: ${({ theme }) => theme.text.main};
`

// TODO: types
class MyApp extends App<any> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    const store = initializeStore();
    const actions = store.getActions()


    ctx.store = store;

    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const token =
      ctx.req && (ctx.req as any).cookies && (ctx.req as any).cookies.token;
    const tokenPayload: TokenPayload = token ? decode(token) : null;
    const darkModeEnabled =
      ctx.req && (ctx.req as any).cookies && (ctx.req as any).cookies.darkModeEnabled === "true";

    if (tokenPayload) {

      store.dispatch.auth.add(tokenPayload);
      const options = {
        headers: {
          Authorization: token
        }
      }
      const res: LinkTransfertRes = await axios.get(`http://localhost:${process.env.PORT}${APIv2.LinkTransferts}`, options);
      actions.linkTransferts.set(res)
    }


    return { pageProps, tokenPayload, initialState: store.getState(), darkModeEnabled };

  }

  store: ReturnType<typeof initializeStore>;
  constructor(props) {
    super(props);
    this.store = initializeStore(props.initialState);
  }

  componentDidMount() {
    const { loading, auth } = this.store.dispatch;
    const token = cookie.get("token");

    if (token) {
      auth.renew().catch(() => {
        auth.logout();
      });
    }

    if (isProd) {
      initGA();
      logPageView();
    }

    Router.events.on("routeChangeStart", () => loading.show());
    Router.events.on("routeChangeComplete", () => {
      loading.hide();

      if (isProd) {
        logPageView();
      }
    });
    Router.events.on("routeChangeError", () => loading.hide());
  }

  render() {
    const { i18n, Component, pageProps, darkModeEnabled } = this.props || {};
    return (
      <>
        <Head>
          <title>
            {publicRuntimeConfig.SITE_NAME} | Modern Open Source URL shortener.
          </title>
        </Head>
        <ThemeProvider defaultValue={darkModeEnabled}>
          <StoreProvider store={this.store}>
            <PageWrapper className="styleBody">
              <Component {...pageProps} />
            </PageWrapper>
          </StoreProvider>
        </ThemeProvider>

      </>
    );
  }
}
export default i18n.appWithTranslation(MyApp);
