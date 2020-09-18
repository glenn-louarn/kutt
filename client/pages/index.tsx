import React, { useCallback } from "react";
import Router from "next/router";

import { DISALLOW_ANONYMOUS_LINKS } from "../consts";
import NeedToLogin from "../components/NeedToLogin";
import Extensions from "../components/Extensions";
import LinksTable from "../components/Links/Links";
import AppWrapper from "../components/AppWrapper";
import Shortener from "../components/Shortener";
import Features from "../components/Features";
import RequestToLinkTransfert from "../components/RequestToLinkTransfert";
import Footer from "../components/Footer";
import { useStoreState } from "../store";

const Homepage = () => {
  const isAuthenticated = useStoreState(s => s.auth.isAuthenticated);

  if (
    !isAuthenticated &&
    DISALLOW_ANONYMOUS_LINKS &&
    typeof window !== "undefined"
  ) {
    Router.push("/login");
    return null;
  }

  return (
    <AppWrapper>
      <RequestToLinkTransfert />
      <Shortener />
      {!isAuthenticated && <NeedToLogin />}
      {isAuthenticated && <LinksTable />}
      <Features />
      <Extensions />
      <Footer />
    </AppWrapper>
  );
};


export default Homepage;
