/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { Dropdown, Icon, Header } from "rsuite";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";

export default function Heading({ page }) {
  const [user, setUser] = useState("");
  const [cookie, setCookie, removeCookie] = useCookies(["a_auth"]);
  const router = useHistory();

  useEffect(() => {
    cookie && cookie.a_auth
      ? setUser(cookie.a_auth.name)
      : router.push("/login");
  }, []);

  const logout = () => {
    removeCookie("a_auth", null, {
      path: "/",
      sameSite: true,
      // expires: 60 * 120,
    });
    router.push("/login");
  };

  return (
    <Header>
      <div className="heading">
        <title>{page}</title>
        <Dropdown
          trigger="hover"
          title={user}
          icon={<Icon icon="user" />}
          className="menu"
        >
          <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
        </Dropdown>
        <h3>{page}</h3>
      </div>
    </Header>
  );
}
