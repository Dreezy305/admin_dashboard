/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Container, Content, Input, Button, Table, Row, Col } from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import moment from "moment";
import Heading from "../components/Heading";
import Menu from "../components/Menu";

export default function Contents() {
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [role, setRole] = useState("");
  const router = useHistory();
  const [cookie] = useCookies(["a_auth"]);

  useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;
    setRole(user.role);
    user.role === "finance" ||
    user.role === "accountant" ||
    user.role === "customer-service"
      ? router.push("/no-access")
      : null;
  }, []);

  useEffect(() => {
    getContents();
  }, []);

  const getContents = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}contents?page=${page} setPage(1);&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setContents(res.data);
          setLoading(false);
        }
      });
  };

  const searchContent = async (query) => {
    setLoading(true);
    const url = `${process.env.API_URL}contents/search?query=${query}&page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setContents(res.data);
          setLoading(false);
        }
      });
  };

  const handleSearch = (val) => {
    val = val.trim();
    setPage(1);
    if (val) {
      searchContent(val);
    } else {
      getContents();
    }
  };

  const prev = () => {
    let pageNumber = page <= 1 ? 1 : page - 1;
    setPage(pageNumber);
    if (search) {
      searchContent(search);
    } else {
      setPage(pageNumber);
      getContents();
    }
  };

  const next = () => {
    let pageNumber = page + 1;
    setPage(page);
    if (search) {
      searchContent(search);
    } else {
      setPage(pageNumber);
      getContents();
    }
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Static contents" />
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
                {contents.length}
                {contents.length <= 1 ? " Content" : " Contents"}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button href="/static-contents/add">+ New page</Button>
              </h4>
            </div>
            <br />
            <Table
              className="table"
              loading={loading}
              height={600}
              data={contents}
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
              <Column width={250} fixed>
                <HeaderCell>Description</HeaderCell>
                <Cell dataKey="description" />
              </Column>
              <Column width={100} fixed>
                <HeaderCell>Status</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <span>{rowData.active ? "active" : "disabled"}</span>
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
              <Column width={200} fixed>
                <HeaderCell>Last edit</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <span>
                        {moment(rowData.updatedAt).format(
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
                          href={`/static-content/${rowData.id}`}
                        >
                          {" "}
                          Edit{" "}
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          size="xs"
                          appearance="ghost"
                          target="_blank"
                          href={`${process.env.FRONTEND_URL}c/${rowData.url}`}
                          color="green"
                        >
                          {" "}
                          View{" "}
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
                disabled={contents.length < 50 ? true : false}
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
