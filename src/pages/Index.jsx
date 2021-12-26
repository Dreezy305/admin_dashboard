import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";

export default function Index() {
  const [cookie, setCookie, removeCookie] = useCookies(["a_auth"]);
  const router = useHistory();

  useEffect(() => {
    cookie && cookie.a_auth ? router.push("/dashboard") : router.push("/login");
  }, []);

  return <></>;
}
