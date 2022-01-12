/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Container,
  Content,
  Input,
  Button,
  Table,
  Row,
  Col,
  Nav,
  DateRangePicker,
  TagPicker,
  Alert,
  Modal,
} from "rsuite";
// import { PlayerData } from "../dummyData/player";
import { GameData } from "../dummyData/game";

const { Column, HeaderCell, Cell } = Table;
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import Heading from "../components/Heading";
import Menu from "../components/Menu";

export default function Games() {
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState(GameData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [notify, setNotify] = useState();
  const router = useHistory();
  const [role, setRole] = useState("");
  const [file, setFile] = useState("");
  const [date, setDate] = useState("");
  const [field, setField] = useState("");
  const [tab, setTab] = useState("table");
  const [graphInput, setGraphInput] = useState([
    moment().subtract(1, "year").format("YYYY-MM-DD"),
    moment().format("YYYY-MM-DD"),
  ]);
  const [graph, setGraph] = useState([0, 0]);
  const [cookie, setCookie, removeCookie] = useCookies(["a_auth"]);

  const [open, setOpen] = useState(false);
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;

    setRole(user.role);
    user.role === "media-marketing" ? router.push("/no-access") : null;
  }, []);

  useEffect(() => {
    // getPlayers();
    graphPlayer();
  }, []);

  const getPlayers = async () => {
    setLoading(true);
    // const url = `${process.env.API_URL}players?page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        if (res.success) {
          setPlayers(res.data);
          setLoading(false);
        } else {
          setNotify(res.error);
        }
      });
  };

  const searchPlayer = async (query) => {
    setLoading(true);
    const url = `${process.env.API_URL}players/search?query=${query}&page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          setPlayers(res.data);
          setLoading(false);
        } else {
          setNotify(res.error);
        }
      });
  };

  const exportPlayer = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}players/export?date=${date}&fields=${field}`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setFile(res.data);
          setLoading(false);
        } else {
          setLoading(false);
          Alert.error(res.error, 5000);
        }
      });
  };

  const handleExport = (val) => {
    setField(val);
  };

  const handleExportDate = (val) => {
    setDate(val);
  };

  const prev = () => {
    let pageNumber = page <= 1 ? 1 : page - 1;
    setPage(pageNumber);
    if (search) {
      searchPlayer(search);
    } else {
      setPage(pageNumber);
      getPlayers();
    }
  };

  const next = () => {
    let pageNumber = page + 1;
    setPage(pageNumber);
    if (search) {
      searchPlayer(search);
    } else {
      setPage(pageNumber);
      getPlayers();
    }
  };

  const handleSearch = (val) => {
    val = val.trim();

    if (val) {
      searchPlayer(val);
      setSearch(val);
    } else {
      getPlayers();
      setSearch("");
    }
  };

  const handleGraph = (val) => {
    let from = moment(val[0]).format("YYYY-MM-DD");
    let to = moment(val[1]).format("YYYY-MM-DD");
    setGraphInput(val);
    graphPlayer(from, to);
  };

  const graphPlayer = async (date1, date2) => {
    let from, to;
    if (!date1 && !date2) {
      from = graphInput[0];
      to = graphInput[1];
    } else {
      from = date1;
      to = date2;
    }

    setLoading(true);
    const url = `${process.env.API_URL}players/graph?from=${from}&to=${to}`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setGraph(res.data);
          setLoading(false);
        }
      });
  };

  const data = {
    series: graph,
    options: {
      chart: {
        width: 600,
        type: "pie",
      },
      labels: ["Standard Player", "Star Player"],
      responsive: [
        {
          breakpoint: 300,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Games" player="Howard Stern" />
          <Content className="container">
            {/* <Nav
              activeKey={tab}
              onSelect={setTab}
              style={{ marginBottom: 20 }}
              appearance="subtle"
            > */}
            {/* <Nav.Item eventKey="table">Table</Nav.Item> */}
            {/* <Nav.Item eventKey="graph">Graph</Nav.Item> */}
            {/* <Nav.Item eventKey="export">Export Data</Nav.Item> */}
            {/* </Nav> */}

            {/* EXPORT DATA */}
            <div style={{ display: tab === "export" ? "block" : "none" }}>
              <Row>
                <Col sm={24} lg={8}>
                  <DateRangePicker
                    size="lg"
                    format="DD-MM-YYYY"
                    block
                    onChange={handleExportDate}
                  />
                </Col>
                <Col sm={24} lg={8}>
                  <TagPicker
                    data={[
                      { label: "ID", value: "id" },
                      { label: "First name", value: "firstName" },
                      { label: "Last name", value: "lastName" },
                      { label: "Email", value: "email" },
                      { label: "Phone", value: "phone" },
                      // { label: "Birth date", value: "dob" },
                      // { label: "Role", value: "role" },
                      // { label: "Wallet balance", value: "walletBalance" },
                      { label: "Status", value: "banned" },
                    ]}
                    multi
                    placeholder="Select fields"
                    required
                    onChange={handleExport}
                    block
                    size="lg"
                  />
                </Col>
                <Col sm={24} lg={8}>
                  <Button
                    size="lg"
                    loading={loading}
                    color="blue"
                    onClick={exportPlayer}
                  >
                    Export Data
                  </Button>
                </Col>
              </Row>

              <div style={{ textAlign: "center", marginTop: 100 }}>
                {file ? (
                  <Button
                    color="green"
                    href={`${process.env.API_URL}static/csv/${file}`}
                    target="_blank"
                    size="lg"
                  >
                    ⇓ Download CSV
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>

            {/* SEARCH PLAYERS */}
            <div style={{ display: tab === "table" ? "block" : "none" }}>
              <div className="search">
                <Row>
                  <Col sm={24} lg={8}>
                    <Input
                      size="lg"
                      type="search"
                      placeholder="Search using id, status...."
                      // onChange={handleSearch}
                    />
                  </Col>
                </Row>
              </div>

              <h4 className="top-heading">
                {players.length}
                <span className="" style={{ marginLeft: "5px" }}>
                  {players.length <= 1 ? "Game" : "Games"}
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {/* <Button appearance="default" onClick={toggleModal}>
                  + Add player
                </Button> */}
              </h4>

              <Table
                className="table"
                loading={loading}
                height={600}
                data={players}
                style={{ minHeight: 600 }}
              >
                <Column width={50} fixed>
                  <HeaderCell>No</HeaderCell>
                  <Cell>
                    {(rowData, key) => {
                      {
                        /* console.log(rowData); */
                      }

                      return <span>{key + 1}</span>;
                    }}
                  </Cell>
                </Column>
                <Column width={150} fixed>
                  <HeaderCell>Type</HeaderCell>
                  <Cell>
                    {(rowData) => {
                      console.log(rowData);
                      return <span>{rowData.type}</span>;
                    }}
                  </Cell>
                </Column>
                <Column width={150} fixed>
                  <HeaderCell>Title</HeaderCell>
                  <Cell>
                    {(rowData) => {
                      console.log(rowData);
                      return <span>{rowData.title}</span>;
                    }}
                  </Cell>
                </Column>
                {/* <Column width={200} fixed>
                  <HeaderCell>Email</HeaderCell>
                  <Cell dataKey="email" />
                </Column> */}
                {/* <Column width={150} fixed>
                  <HeaderCell>Phone</HeaderCell>
                  <Cell dataKey="phone" />
                </Column> */}

                {/* <Column width={100} fixed>
                  <HeaderCell>Balance</HeaderCell>
                  <Cell>
                    {(rowData) => {
                      return (
                        <span>
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          }).format(
                            rowData && rowData.walletBalance
                              ? rowData.walletBalance
                              : 0
                          )}
                        </span>
                      );
                    }}
                  </Cell>
                </Column> */}
                {/* <Column width={100} fixed>
                  <HeaderCell>Role</HeaderCell>
                  <Cell dataKey="role" />
                </Column> */}
                <Column width={100} fixed>
                  <HeaderCell>Status</HeaderCell>
                  <Cell>
                    {(rowData, key) => {
                      return <span>{rowData.status}</span>;
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
                <Column width={150} fixed="right">
                  <HeaderCell>Action</HeaderCell>
                  <Cell>
                    {(rowData, key) => {
                      console.log(key);
                      return (
                        <>
                          <span>
                            <Button
                              size="xs"
                              appearance="ghost"
                              onClick={() => {
                                router.push({
                                  pathname: `/game/${key}`,
                                  state: key,
                                });
                                // handleOpen();
                                // setIsModal(true);
                              }}
                            >
                              {" "}
                              View
                            </Button>{" "}
                            &nbsp;
                          </span>
                          <span>
                            <Button size="xs" appearance="ghost">
                              {" "}
                              Edit
                            </Button>{" "}
                            &nbsp;
                          </span>
                        </>
                      );
                    }}
                  </Cell>
                </Column>
              </Table>

              <div style={{ textAlign: "center", marginTop: 20 }}>
                <Button
                  appearance="default"
                  // onClick={prev}
                  // disabled={players.length < 50 ? true : false}
                >
                  &larr; Prev
                </Button>
                <Button
                  appearance="default"
                  // onClick={next}
                  // disabled={players.length < 50 ? true : false}
                >
                  Next &rarr;
                </Button>
              </div>
            </div>

            {/* CHART/GRAPH */}
            <div style={{ display: tab === "graph" ? "block" : "none" }}>
              <Row>
                <Col sm={24} lg={8}>
                  <DateRangePicker
                    format="DD-MM-YYYY"
                    size="lg"
                    block
                    value={graphInput}
                    onChange={handleGraph}
                  />
                </Col>
              </Row>
              <div style={{ maxWidth: 500, margin: "0 auto", marginTop: 50 }}>
                {graph.length && tab === "graph" ? (
                  <ReactApexChart
                    options={data.options}
                    series={data.series}
                    type="pie"
                    width={480}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
}
