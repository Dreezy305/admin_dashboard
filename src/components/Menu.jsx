import React, { useState, useEffect } from "react";
import { Navbar, Nav, Dropdown, Sidebar, Sidenav, Icon } from "rsuite";
import { useCookies } from "react-cookie";

const headerStyles = {
  padding: 18,
  fontSize: 16,
  height: 56,
  background: "#b90106",
  color: " #fff",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const iconStyles = {
  width: 56,
  height: 56,
  lineHeight: "56px",
  textAlign: "center",
};

const NavToggle = ({ expand, onChange }) => {
  return (
    <Navbar
      appearance="subtle"
      className="nav-toggle"
      style={{ height: "100%", background: "#fff" }}
    >
      <Navbar.Body style={{ position: "absolute", bottom: 0 }}>
        <Nav pullRight>
          <Nav.Item
            onClick={onChange}
            style={{ width: 56, textAlign: "center" }}
          >
            <Icon icon={expand ? "angle-left" : "angle-right"} />
          </Nav.Item>
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
};

export default function Menu({ activeKeys, active }) {
  const [cookie, setCookie, removeCookie] = useCookies(["a_auth"]);
  const [expand, setExpand] = useState(false);
  const [role, setRole] = useState("");

  React.useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;
    setRole(user.role);
  }, [cookie]);

  const handleToggle = () => {
    setExpand(!expand);
  };

  const customer = () => (
    <>
      <Nav.Item
        eventKey="1"
        href="/dashboard"
        icon={<Icon icon="dashboard" />}
        active={active === "1" ? active : false}
      >
        Dashboard
      </Nav.Item>
      <Nav.Item
        eventKey="2"
        href="/tickets"
        icon={<Icon icon="ticket" />}
        active={active === "2" ? active : false}
      >
        Tickets
      </Nav.Item>
      <Nav.Item
        eventKey="4"
        href="/payouts"
        icon={<Icon icon="credit-card" />}
        active={active === "4" ? active : false}
      >
        Payouts
      </Nav.Item>
      <Nav.Item
        eventKey="5"
        href="/players"
        icon={<Icon icon="group" />}
        active={active === "5" ? active : false}
      >
        Players
      </Nav.Item>
    </>
  );
  const marketing = () => (
    <>
      <Nav.Item
        eventKey="1"
        href="/site-analytics"
        icon={<Icon icon="globe" />}
        active={active === "0" ? active : false}
      >
        Site Analytics
      </Nav.Item>
      <Nav.Item
        eventKey="1"
        href="/dashboard"
        icon={<Icon icon="dashboard" />}
        active={active === "1" ? active : false}
      >
        Dashboard
      </Nav.Item>
      <Nav.Item
        eventKey="6"
        href="/banners"
        icon={<Icon icon="flag" />}
        active={active === "6" ? active : false}
      >
        Banners
      </Nav.Item>
      <Nav.Item
        eventKey="7"
        href="/notifications"
        icon={<Icon icon="bell" />}
        active={active === "7" ? active : false}
      >
        Notifications
      </Nav.Item>
      <Dropdown
        eventKey="10"
        trigger="hover"
        title="Site configurations"
        icon={<Icon icon="cog" />}
        placement="rightStart"
        active={active === "10" ? active : false}
      >
        <Dropdown.Item
          eventKey="10-1"
          href="/site-meta"
          active={active === "10-1" ? active : false}
        >
          Site meta
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="10-2"
          href="/static-contents"
          active={active === "10-2" ? active : false}
        >
          Static contents
        </Dropdown.Item>
      </Dropdown>
    </>
  );

  const finance = () => (
    <>
      <Nav.Item
        eventKey="1"
        href="/dashboard"
        icon={<Icon icon="dashboard" />}
        active={active === "1" ? active : false}
      >
        Dashboard
      </Nav.Item>
      <Nav.Item
        eventKey="2"
        href="/tickets"
        icon={<Icon icon="ticket" />}
        active={active === "2" ? active : false}
      >
        Tickets
      </Nav.Item>
      <Nav.Item
        eventKey="3"
        href="/transactions"
        icon={<Icon icon="money" />}
        active={active === "3" ? active : false}
      >
        Transactions
      </Nav.Item>
      <Nav.Item
        eventKey="4"
        href="/payouts"
        icon={<Icon icon="credit-card" />}
        active={active === "4" ? active : false}
      >
        Payouts
      </Nav.Item>
      <Nav.Item
        eventKey="5"
        href="/players"
        icon={<Icon icon="group" />}
        active={active === "5" ? active : false}
      >
        Players
      </Nav.Item>
    </>
  );

  const admin = () => (
    <>
      <Nav.Item
        eventKey="1"
        href="/site-analytics"
        icon={<Icon icon="globe" />}
        active={active === "0" ? active : false}
      >
        Site Analytics
      </Nav.Item>
      <Nav.Item
        eventKey="1"
        href="/dashboard"
        icon={<Icon icon="dashboard" />}
        active={active === "1" ? active : false}
      >
        Dashboard
      </Nav.Item>
      <Nav.Item
        eventKey="2"
        href="/tickets"
        icon={<Icon icon="ticket" />}
        active={active === "2" ? active : false}
      >
        Tickets
      </Nav.Item>
      <Nav.Item
        eventKey="3"
        href="/transactions"
        icon={<Icon icon="money" />}
        active={active === "3" ? active : false}
      >
        Transactions
      </Nav.Item>
      <Nav.Item
        eventKey="4"
        href="/payouts"
        icon={<Icon icon="credit-card" />}
        active={active === "4" ? active : false}
      >
        Payouts
      </Nav.Item>
      <Nav.Item
        eventKey="5"
        href="/players"
        icon={<Icon icon="group" />}
        active={active === "5" ? active : false}
      >
        Players
      </Nav.Item>
      <Nav.Item
        eventKey="6"
        href="/banners"
        icon={<Icon icon="flag" />}
        active={active === "6" ? active : false}
      >
        Banners
      </Nav.Item>
      <Nav.Item
        eventKey="7"
        href="/notifications"
        icon={<Icon icon="bell" />}
        active={active === "7" ? active : false}
      >
        Notifications
      </Nav.Item>
      <Nav.Item
        eventKey="8"
        href="/admin"
        icon={<Icon icon="user" />}
        active={active === "8" ? active : false}
      >
        Admin management
      </Nav.Item>

      <Dropdown
        eventKey="9"
        trigger="hover"
        title="Game configurations"
        icon={<Icon icon="gamepad" />}
        placement="rightStart"
        active={active === "9" ? active : false}
      >
        <Dropdown.Item
          eventKey="9-3"
          href="/bonuses"
          active={active === "9-3" ? active : false}
        >
          Bonus management
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="9-5"
          href="/exposure"
          active={active === "9-5" ? active : false}
        >
          Exposure management
        </Dropdown.Item>
      </Dropdown>
      <Dropdown
        eventKey="10"
        trigger="hover"
        title="Site configurations"
        icon={<Icon icon="cog" />}
        placement="rightStart"
        active={active === "10" ? active : false}
      >
        <Dropdown.Item
          eventKey="10-1"
          href="/site-meta"
          active={active === "10-1" ? active : false}
        >
          Site meta
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="10-2"
          href="/static-contents"
          active={active === "10-2" ? active : false}
        >
          Static contents
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="10-3"
          href="/payment"
          active={active === "10-3" ? active : false}
        >
          Payment management
        </Dropdown.Item>
      </Dropdown>
    </>
  );

  return (
    <Sidebar
      style={{ display: "flex", flexDirection: "column" }}
      width={expand ? 260 : 56}
      collapsible
    >
      <Sidenav
        expanded={expand}
        defaultOpenKeys={activeKeys ? activeKeys : []}
        appearance="subtle"
      >
        <Sidenav.Header>
          <div style={headerStyles}>
            <Icon icon="circle" size="lg" style={{ verticalAlign: 0 }} />
            <span style={{ marginLeft: 15 }}>
              {" "}
              <img src={require("../images/logo.png")} height="30" />
            </span>
          </div>
        </Sidenav.Header>
        <Sidenav.Body>
          <Nav>
            {role === "admin" || role === "risk-manager"
              ? admin()
              : role === "finance" || role === "accountant"
              ? finance()
              : role === "customer-service"
              ? customer()
              : role === "media-marketing"
              ? marketing()
              : ""}
          </Nav>
        </Sidenav.Body>
      </Sidenav>
      <NavToggle expand={expand} onChange={handleToggle} />
    </Sidebar>
  );
}
