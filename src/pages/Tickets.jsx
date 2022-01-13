/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Content,
  Input,
  Button,
  Table,
  InputPicker,
  TagPicker,
  DateRangePicker,
  Row,
  Col,
  Nav,
  Tag,
  Alert,
} from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import { TicketsData } from "../dummyData/tickets";

export default function Tickets() {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState(TicketsData);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [status, setStatus] = useState();
  const [role, setRole] = useState("");
  const [file, setFile] = useState("");
  const [date, setDate] = useState("");
  const [field, setField] = useState("");
  const [tab, setTab] = useState("table");
  const [graphInput, setGraphInput] = useState([
    moment().subtract(1, "year").format("YYYY-MM-DD"),
    moment().format("YYYY-MM-DD"),
  ]);
  const [graph, setGraph] = useState([0, 0, 0, 0]);
  const router = useHistory();
  const [cookie] = useCookies(["a_auth"]);

  useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;
    setRole(user.role);
    user.role === "media-marketing" ? router.push("/no-access") : null;
  }, []);

  useEffect(() => {
    getTickets();
    graphTicket();
  }, []);

  const handleStatus = (val) => {
    setStatus(val);
    setPage(1);
    searchTicket(val);
  };

  const handleRange = (val) => {
    let from = moment(val[0]).format("YYYY-MM-DD");
    let to = moment(val[1]).format("YYYY-MM-DD");
    setPage(1);
    rangeTicket(from, to);
  };

  const handleGraph = (val) => {
    let from = moment(val[0]).format("YYYY-MM-DD");
    let to = moment(val[1]).format("YYYY-MM-DD");
    setGraphInput(val);
    graphTicket(from, to);
  };

  const getTickets = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}tickets?page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setTickets(res.data);
          setLoading(false);
        }
      });
  };

  const searchTicket = async (query) => {
    setLoading(true);
    const url = `${process.env.API_URL}tickets/search?query=${query}&page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setTickets(res.data);
          setLoading(false);
        }
      });
  };

  const rangeTicket = async (from, to) => {
    setLoading(true);
    const url = `${process.env.API_URL}tickets/range?from=${from}&to=${to}&query=${status}&page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setTickets(res.data);
          setLoading(false);
        }
      });
  };

  const graphTicket = async (date1, date2) => {
    let from, to;
    if (!date1 && !date2) {
      from = graphInput[0];
      to = graphInput[1];
    } else {
      from = date1;
      to = date2;
    }

    setLoading(true);
    const url = `${process.env.API_URL}tickets/graph?from=${from}&to=${to}`;
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

  const handleSearch = (val) => {
    val = val.trim();
    setPage(1);
    if (val) {
      searchTicket(val);
    } else {
      getTickets();
    }
  };

  const exportTicket = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}tickets/export?date=${date}&fields=${field}`;
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
      searchTicket(search);
    } else {
      setPage(pageNumber);
      getTickets();
    }
  };

  const next = () => {
    let pageNumber = page + 1;
    setPage(pageNumber);
    if (search) {
      searchTicket(search);
    } else {
      setPage(pageNumber);
      getTickets();
    }
  };

  const data = useMemo(() => {
    return {
      series: graph,
      options: {
        chart: {
          width: 600,
          type: "pie",
        },
        labels: ["Booked", "Win", "Pending", "Lost"],
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
  });

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Tickets" />
          <Content className="container">
            <Nav
              activeKey={tab}
              onSelect={setTab}
              style={{ marginBottom: 20 }}
              appearance="subtle"
              // reversed
            >
              <Nav.Item eventKey="table">Table</Nav.Item>
              {/* <Nav.Item eventKey="graph">Graph</Nav.Item> */}
              <Nav.Item eventKey="export">Export Data</Nav.Item>
            </Nav>
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
                      { label: "Ticket ID", value: "ticketId" },
                      { label: "Amount", value: "amount" },
                      { label: "Type", value: "type" },
                      { label: "Status", value: "status" },
                      { label: "Player", value: "playerId" },
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
                    onClick={exportTicket}
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

            <div style={{ display: tab === "table" ? "block" : "none" }}>
              <Row>
                <Col sm={24} lg={8}>
                  <DateRangePicker
                    size="lg"
                    format="DD-MM-YYYY"
                    block
                    onChange={handleRange}
                  />
                </Col>
                <Col sm={24} lg={4}>
                  <InputPicker
                    data={[
                      { label: "Pending", value: "pending" },
                      { label: "Booked", value: "booked" },
                      { label: "Lost", value: "lost" },
                      { label: "Win", value: "win" },
                    ]}
                    placeholder="Status"
                    required
                    onChange={handleStatus}
                    className="ticket2"
                    block
                    size="lg"
                  />
                </Col>
                <Col sm={24} lg={8} lgOffset={4}>
                  <Input
                    size="lg"
                    type="search"
                    placeholder="Search amount or id...."
                    onChange={handleSearch}
                  />
                </Col>
              </Row>
              <Table
                className="table"
                loading={loading}
                height={600}
                data={tickets}
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
                  <HeaderCell>ID</HeaderCell>
                  <Cell dataKey="ticketId" />
                </Column>
                <Column width={200} fixed>
                  <HeaderCell>Amount</HeaderCell>
                  <Cell dataKey="amount" />
                </Column>
                <Column width={150} fixed>
                  <HeaderCell>Name</HeaderCell>
                  <Cell>
                    {(rowData) => {
                      return (
                        <span>
                          {rowData.player ? rowData.player.firstName : ""}{" "}
                          &nbsp;
                          {rowData.player ? rowData.player.lastName : ""}
                        </span>
                      );
                    }}
                  </Cell>
                </Column>
                <Column width={100} fixed>
                  <HeaderCell>Status</HeaderCell>
                  <Cell>
                    {(rowData) => {
                      return (
                        <span>
                          {
                            <Tag
                              color={
                                rowData.status === "pending"
                                  ? "orange"
                                  : rowData.status === "win" ||
                                    rowData.status === "cashout"
                                  ? "green"
                                  : rowData.status === "lost"
                                  ? "red"
                                  : rowData.status === "booked"
                                  ? "blue"
                                  : ""
                              }
                            >
                              <b style={{ textTransform: "capitalize" }}>
                                {rowData.status}
                              </b>
                            </Tag>
                          }
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
                            href={`/ticket/${rowData.ticketId}`}
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
                  // onClick={prev}
                  // disabled={page === 1 ? true : false}
                >
                  &larr; Prev
                </Button>
                <Button
                  appearance="default"
                  // onClick={next}
                  // disabled={tickets.length < 50 ? true : false}
                >
                  Next&rarr;
                </Button>
              </div>
            </div>

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
