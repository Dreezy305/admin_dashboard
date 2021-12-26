import React, { useState, useEffect } from "react";
import { Container, Content, Input, Button, Table, Row, Col } from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import moment from "moment";
import Heading from "../components/Heading";
import Menu from "../components/Menu";

export default function Notifications() {
  const [loading, setLoading] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState();
  const [role, setRole] = useState("");
  const router = useHistory();
  const [cookie] = useCookies(["a_auth"]);

  useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;
    setRole(user.role);
    user.role === "finance" || role === "accountant"
      ? router.push("/no-access")
      : null;
  }, []);

  React.useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}notifications?page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setNotifications(res.data);
          setLoading(false);
        }
      });
  };

  const searchNotification = async (query) => {
    setLoading(true);
    const url = `${process.env.API_URL}notifications/search?query=${query}&page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setNotifications(res.data);
          setLoading(false);
        }
      });
  };

  const handleSearch = (val) => {
    val = val.trim();
    setPage(1);
    if (val) {
      searchNotification(val);
    } else {
      getNotifications();
    }
  };

  const prev = () => {
    let pageNumber = page <= 1 ? 1 : page - 1;
    setPage(pageNumber);
    if (search) {
      searchNotification(search);
    } else {
      setPage(pageNumber);
      getNotifications();
    }
  };

  const next = () => {
    let pageNumber = page + 1;
    setPage(pageNumber);
    if (search) {
      searchNotification(search);
    } else {
      setPage(1);
      getNotifications();
    }
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Notifications" />
          <Content className="container">
            <div>
              <div className="search">
                <Row>
                  <Col sm={24} lg={8}>
                    <Input
                      size="lg"
                      type="search"
                      placeholder="Search using title, description...."
                      onChange={handleSearch}
                    />
                  </Col>
                </Row>
              </div>

              <h4 className="top-heading">
                {notifications.length}
                {notifications.length <= 1 ? " Notification" : " Notifications"}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button href="/notifications/add">+ New</Button>
              </h4>
            </div>
            <br />
            <Table
              className="table"
              loading={loading}
              height={600}
              data={notifications}
            >
              <Column width={50} fixed>
                <HeaderCell>No</HeaderCell>
                <Cell>
                  {(rowData, key) => {
                    return <span>{key + 1}</span>;
                  }}
                </Cell>
              </Column>
              <Column width={200} fixed>
                <HeaderCell>Title</HeaderCell>
                <Cell dataKey="title" />
              </Column>

              <Column width={200} fixed>
                <HeaderCell>Expiry</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <span>
                        {moment(rowData.expiry).format("MMM D, YYYY @ h:mm A")}
                      </span>
                    );
                  }}
                </Cell>
              </Column>

              <Column width={200} fixed>
                <HeaderCell>Date</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <span>
                        {moment(rowData.createdAt).format(
                          "MMM D, YYYY @ h:mm A"
                        )}
                      </span>
                    );
                  }}
                </Cell>
              </Column>
              <Column width={120} fixed="right">
                <HeaderCell>Action</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <span>
                        <Button
                          size="xs"
                          appearance="ghost"
                          href={`/notification/${rowData.id}`}
                        >
                          {" "}
                          Edit{" "}
                        </Button>
                      </span>
                    );
                  }}
                </Cell>
              </Column>
            </Table>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Button
                appearance="default"
                onClick={prev}
                disabled={page === 1 ? true : false}
              >
                &larr; Prev
              </Button>
              <Button
                appearance="default"
                onClick={next}
                disabled={notifications.length < 50 ? true : false}
              >
                Next&rarr;
              </Button>
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
}
