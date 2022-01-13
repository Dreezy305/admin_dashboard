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
  InputPicker,
  DateRangePicker,
  TagPicker,
  Row,
  Col,
  Nav,
  Tag,
} from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import { TransactionData } from "../dummyData/transactions";

export default function Transactions() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(TransactionData);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [status, setStatus] = useState();
  const [role, setRole] = useState("");
  const [file, setFile] = useState("");
  const [date, setDate] = useState("");
  const [field, setField] = useState("");
  const router = useHistory();
  const [tab, setTab] = useState("table");
  const [graphInput, setGraphInput] = useState([
    moment().subtract(1, "year").format("YYYY-MM-DD"),
    moment().format("YYYY-MM-DD"),
  ]);
  const [graph, setGraph] = useState([0, 0, 0]);
  const [cookie] = useCookies(["a_auth"]);

  useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;
    setRole(user.role);
    user.role === "customer-service" || user.role === "media-marketing"
      ? router.push("/no-access")
      : null;
  }, []);

  useEffect(() => {
    // getTransactions();
    // graphTransaction();
  }, []);

  const handleStatus = (val) => {
    setStatus(val);
    setPage(1);
    searchTransaction(val);
  };

  const handleRange = (val) => {
    let from = moment(val[0]).format("YYYY-MM-DD");
    let to = moment(val[1]).format("YYYY-MM-DD");
    setPage(1);
    rangeTransaction(from, to);
  };

  const getTransactions = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}transactions?page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setTransactions(res.data);
          setLoading(false);
        }
      });
  };

  const searchTransaction = async (query) => {
    setLoading(true);
    const url = `${process.env.API_URL}transactions/search?query=${query}&page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setTransactions(res.data);
          setLoading(false);
        }
      });
  };

  const rangeTransaction = async (from, to) => {
    setLoading(true);
    const url = `${process.env.API_URL}transactions/range?from=${from}&to=${to}&page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setTransactions(res.data);
          setLoading(false);
        }
      });
  };

  const handleSearch = (val) => {
    val = val.trim();
    setPage(1);
    if (val) {
      searchTransaction(val);
    } else {
      getTransactions();
    }
  };

  const exportTransaction = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}payouts/export?date=${date}&fields=${field}`;
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
      searchTransaction(search);
    } else {
      setPage(pageNumber);
      getTransactions();
    }
  };

  const next = () => {
    let pageNumber = page + 1;
    setPage(pageNumber);
    if (search) {
      searchTransaction(search);
    } else {
      setPage(pageNumber);
      getTransactions();
    }
  };

  const handleGraph = (val) => {
    let from = moment(val[0]).format("YYYY-MM-DD");
    let to = moment(val[1]).format("YYYY-MM-DD");
    setGraphInput(val);
    graphTransaction(from, to);
  };

  const graphTransaction = async (date1, date2) => {
    let from, to;
    if (!date1 && !date2) {
      from = graphInput[0];
      to = graphInput[1];
    } else {
      from = date1;
      to = date2;
    }

    setLoading(true);
    const url = `${process.env.API_URL}transactions/graph?from=${from}&to=${to}`;
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
      labels: ["Pending", "Success", "Failure"],
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

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Transactions" />
          <Content className="container">
            <Nav
              activeKey={tab}
              onSelect={setTab}
              style={{ marginBottom: 20 }}
              appearance="subtle"
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
                      { label: "ID", value: "id" },
                      { label: "Amount", value: "amount" },
                      { label: "Status", value: "status" },
                      { label: "Player", value: "playerId" },
                      { label: "Narration", value: "narration" },
                      { label: "Provider", value: "provider" },
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
                    // onClick={exportTransaction}
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
                  <DateRangePicker size="lg" block onChange={handleRange} />
                </Col>
                <Col sm={24} lg={4}>
                  <InputPicker
                    data={[
                      { label: "Pending", value: "pending" },
                      { label: "Failure", value: "failure" },
                      { label: "Success", value: "success" },
                    ]}
                    placeholder="Status"
                    required
                    onChange={handleStatus}
                    className="transaction2"
                    block
                    size="lg"
                  />
                </Col>
                <Col sm={24} lg={8} lgOffset={4}>
                  <Input
                    size="lg"
                    type="search"
                    placeholder="Search by reference id, amount or status...."
                    onChange={handleSearch}
                  />
                </Col>
              </Row>

              <br />
              {/* <h4 className="top-heading">
                {transactions.length}
                {transactions.length <= 1 ? " Transaction" : " Transactions"}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </h4> */}

              <Table
                className="table"
                loading={loading}
                height={550}
                data={transactions}
                style={{ minHeight: 550 }}
              >
                <Column width={50} fixed>
                  <HeaderCell>No</HeaderCell>
                  <Cell>
                    {(rowData, key) => {
                      return <span>{key + 1}</span>;
                    }}
                  </Cell>
                </Column>

                <Column width={100} fixed>
                  <HeaderCell>Reference Id</HeaderCell>
                  <Cell dataKey="referenceId" />
                </Column>

                <Column width={150} fixed>
                  <HeaderCell>Amount</HeaderCell>
                  <Cell>
                    {(rowData) => {
                      return (
                        <b>
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          }).format(
                            rowData && rowData.amount ? rowData.amount : 0
                          )}
                        </b>
                      );
                    }}
                  </Cell>
                </Column>
                <Column width={150} fixed>
                  <HeaderCell>Player</HeaderCell>
                  <Cell dataKey="playerName" />
                </Column>
                <Column width={100} fixed>
                  <HeaderCell>Type</HeaderCell>
                  <Cell dataKey="type" />
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
                                  : rowData.status === "success"
                                  ? "green"
                                  : rowData.status === "failure"
                                  ? "red"
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
                            href={`/transaction/${rowData.id}`}
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
                  // disabled={transactions.length < 50 ? true : false}
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
