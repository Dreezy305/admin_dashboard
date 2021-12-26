import React, { useState, useEffect } from "react";
import {
  Container,
  Content,
  Panel,
  Row,
  Col,
  Nav,
  Input,
  Alert,
  InputPicker,
  Button,
  Modal,
  Table,
  InputNumber,
} from "rsuite";
import { useParams, useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import moment from "moment";
const { Column, HeaderCell, Cell } = Table;
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import { parseCurrency } from "../components/Utils";

export default function Player() {
  const [loading, setLoading] = React.useState(false);
  const [depositLoading, setDepositLoading] = React.useState(false);
  const [withdrawLoading, setWithdrawLoading] = React.useState(false);
  const [player, setPlayer] = useState({});
  const [notify, setNotify] = React.useState();
  const [tab, setTab] = React.useState("overview");
  const [modal, setModal] = React.useState(false);
  const [modal1, setModal1] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);
  const [tickets, setTickets] = React.useState([]);
  const [depositAmount, setDepositAmount] = React.useState(0);
  const [withdrawAmount, setWithdrawAmount] = React.useState(0);
  const router = useHistory();
  const param = useParams();
  const [role, setRole] = useState("");
  const [cookie] = useCookies(["a_auth"]);

  useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;
    setRole(user.role);
    user.role === "media-marketing" ? router.push("/no-access") : null;
  }, []);

  useEffect(() => {
    getPlayer();
  }, []);

  const handleTab = (val) => {
    setTab(val);
  };

  const getPlayer = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}player/${param.id}`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setPlayer(res.data);
          setLoading(false);
        }
      });
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleModal1 = () => {
    setModal1(!modal1);
  };

  const toggleModal2 = () => {
    setModal2(!modal2);
  };

  const handleRole = (value) => {
    player.role = value;
    setPlayer(player);
  };

  const handleFirst = (value) => {
    player.firstName = value;
    setPlayer(player);
  };

  const handleLast = (value) => {
    player.lastName = value;
    setPlayer(player);
  };

  const handleEmail = (value) => {
    player.email = value;
    setPlayer(player);
  };

  const handlePhone = (value) => {
    player.phone = value;
    setPlayer(player);
  };

  const handleStatus = (value) => {
    player.status = value;
    setPlayer(player);
  };

  const updatePlayer = async (form) => {
    setLoading(true);
    const url = `${process.env.API_URL}player/update`;
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          getPlayer();
          setPlayer({});
          toggleModal();
          Alert.success("Player detail updated", 5000);
        } else {
          setLoading(false);
        }
      });
  };

  const saveEdit = (e) => {
    e.preventDefault();

    let form = player;

    if (!form.firstName || form.firstName.length < 3) {
      setNotify("Firstname is too short !");
    } else if (!form.lastName || form.lastName.length < 3) {
      setNotify("Lastname is too short !");
    } else if (!form.email) {
      setNotify("Invalid email address!");
    } else if (!form.role) {
      setNotify("Choose a role!");
    } else {
      setNotify("");
      updatePlayer(form);
    }
  };

  const deposit = (e) => {
    e.preventDefault();

    if (Number(depositAmount) < 1) {
      Alert.error("Amount is too low !", 3000);
    } else {
      let form = {
        amount: depositAmount,
        balance: Number(player.walletBalance),
        playerId: player.id,
        narration: `Manual deposit for ${player.firstName} ${player.lastName}`,
        provider: "Manual deposit",
      };

      setDepositLoading(true);
      const url = `${process.env.API_URL}wallet/deposit`;
      fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Basic " + process.env.API_KEY,
        },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setDepositLoading(false);
            setDepositAmount(0);
            toggleModal1();

            Alert.success("Deposit processed successfully!", 5000);
            window.location.reload();
          } else {
            Alert.success(
              "Error processing deposit. Please try again later!",
              5000
            );
            setDepositLoading(false);
          }
        });
    }
  };

  const withdrawal = (e) => {
    e.preventDefault();

    if (Number(withdrawAmount) < 1) {
      Alert.error("Amount is too low !", 3000);
    } else {
      let form = {
        accountName: player.accountName,
        accountBank: player.accountBank,
        accountNumber: player.accountNumber,
        amount: withdrawAmount,
        walletBalance: Number(player.walletBalance),
        playerId: player.id,
        narration: `Manual deposit for ${player.firstName} ${player.lastName}`,
        provider: "Manual deposit",
      };

      setWithdrawLoading(true);
      const url = `${process.env.API_URL}payout/create`;
      fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Basic " + process.env.API_KEY,
        },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setWithdrawLoading(false);
            setWithdrawAmount(0);
            toggleModal2();

            Alert.success(
              "Withdrawal request processed. Please notify admin to approve!",
              5000
            );
            window.location.reload();
          } else {
            Alert.success(
              "Error processing withdrawal. Please try again later!",
              5000
            );
            setWithdrawLoading(false);
          }
        });
    }
  };

  const CustomNav = ({ active, onSelect, ...props }) => {
    return (
      <Nav
        {...props}
        activeKey={active}
        onSelect={onSelect}
        style={{ marginBottom: 30 }}
      >
        <Nav.Item eventKey="overview">Overview</Nav.Item>
        <Nav.Item eventKey="wallet">Wallet History</Nav.Item>
        <Nav.Item eventKey="ticket">Ticket history</Nav.Item>
      </Nav>
    );
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Modal size={"xs"} show={modal1} onHide={toggleModal1} backdrop="static">
        <form onSubmit={deposit}>
          <Modal.Header>
            <Modal.Title>Manual deposit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputNumber placeholder="Amount" onChange={setDepositAmount} />
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" color="blue" loading={loading}>
              Deposit
            </Button>
            <Button
              loading={depositLoading}
              onClick={toggleModal1}
              appearance="subtle"
            >
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal size={"xs"} show={modal2} onHide={toggleModal2} backdrop="static">
        <form onSubmit={withdrawal}>
          <Modal.Header>
            <Modal.Title>Manual withdrawal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputNumber placeholder="Amount" onChange={setWithdrawAmount} />
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" color="blue" loading={loading}>
              Withdrawal
            </Button>
            <Button onClick={toggleModal2} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal size={"xs"} show={modal} onHide={toggleModal} backdrop="static">
        <form onSubmit={saveEdit}>
          <Modal.Header>
            <Modal.Title>Edit user</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input
              placeholder="Firstname"
              name="firstName"
              onChange={handleFirst}
              defaultValue={player.firstName}
              className="user2"
            />
            <br />
            <Input
              placeholder="Lastname"
              name="lastName"
              onChange={handleLast}
              defaultValue={player.lastName}
              className="user2"
            />
            <br />
            <Input
              placeholder="Email"
              type="email"
              name="email"
              onChange={handleEmail}
              defaultValue={player.email}
              className="user2"
            />
            <br />
            <Input
              placeholder="Phone"
              type="tel"
              name="phone"
              onChange={handlePhone}
              defaultValue={player.phone}
              className="user2"
            />
            <br />

            <InputPicker
              data={[
                { label: "Role: Standard", value: "standard" },
                { label: "Role: Star player", value: "star" },
              ]}
              defaultValue={player.role}
              placeholder="Role"
              block
              required
              onChange={handleRole}
              className="user2"
            />
            <br />
            <InputPicker
              data={[
                { label: "Status: Active", value: false },
                { label: "Status: Banned", value: true },
              ]}
              defaultValue={player.banned}
              placeholder="Active or not active?"
              block
              required
              onChange={handleStatus}
              className="user2"
            />
            <br />

            <span style={{ color: "#cb0000" }}>{notify}</span>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" color="blue" loading={loading}>
              Save
            </Button>
            <Button onClick={toggleModal} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <Container>
        <Menu />
        <Container>
          <Heading page={"Player"} />
          <Content className="container">
            <div className="inner">
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  <h3>
                    {player.firstName} {player.lastName}
                  </h3>
                  <h4>
                    <span>
                      {" "}
                      Balance:{" "}
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(
                        player.walletBalance ? player.walletBalance : 0
                      )}
                    </span>
                    &nbsp;&nbsp;&nbsp;
                    <span>
                      Bonus:{" "}
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(player.bonusBalance ? player.bonusBalance : 0)}
                    </span>
                  </h4>
                  <div style={{ marginTop: 30 }}>
                    <Button appearance="ghost" onClick={toggleModal}>
                      Edit
                    </Button>{" "}
                    &nbsp;&nbsp;&nbsp;
                    <Button appearance="ghost" onClick={toggleModal1}>
                      Manual Deposit
                    </Button>{" "}
                    &nbsp;&nbsp;&nbsp;
                    <Button appearance="ghost" onClick={toggleModal2}>
                      Manual Withdrawal
                    </Button>
                  </div>

                  <br />
                  <CustomNav
                    appearance="subtle"
                    active={tab}
                    onSelect={handleTab}
                  />

                  <div
                    style={{ display: tab === "overview" ? "block" : "none" }}
                  >
                    <Row>
                      <Col sm={24} lg={12}>
                        {" "}
                        <h6> Date of birth: </h6>
                      </Col>
                      <Col sm={24} lg={12}>
                        <h6> {moment(player.dob).format("MMM D, YYYY")}</h6>
                      </Col>
                    </Row>
                    <Row>
                      <hr />
                      <Col sm={24} lg={12}>
                        {" "}
                        <h6> Email: </h6>
                      </Col>
                      <Col sm={24} lg={12}>
                        <h6> {player.email}</h6>
                      </Col>
                    </Row>
                    <Row>
                      <hr />
                      <Col sm={24} lg={12}>
                        {" "}
                        <h6> Phone: </h6>
                      </Col>
                      <Col sm={24} lg={12}>
                        <h6> {player.phone}</h6>
                      </Col>
                    </Row>
                    <Row>
                      <hr />
                      <Col sm={24} lg={12}>
                        {" "}
                        <h6> Role: </h6>
                      </Col>
                      <Col sm={24} lg={12}>
                        <h6>
                          {" "}
                          {player.role === "standard"
                            ? "Standard"
                            : "Super player"}
                        </h6>
                      </Col>
                    </Row>
                    <Row>
                      <hr />
                      <Col sm={24} lg={12}>
                        {" "}
                        <h6> Status: </h6>
                      </Col>
                      <Col sm={24} lg={12}>
                        <h6> {player.banned ? "banned" : "active"}</h6>
                      </Col>
                    </Row>
                    <Row>
                      <hr />
                      <Col sm={24} lg={12}>
                        {" "}
                        <h6>Date created: </h6>
                      </Col>
                      <Col sm={24} lg={12}>
                        <h6>
                          {" "}
                          {moment(player.createdAt).format(
                            "MMM D, YYYY @ h:mm A"
                          )}
                        </h6>
                      </Col>
                    </Row>
                    <Row>
                      <hr />
                      <Col sm={24} lg={12}>
                        {" "}
                        <h6>Last modification: </h6>
                      </Col>
                      <Col sm={24} lg={12}>
                        <h6>
                          {" "}
                          {moment(player.updatedAt).format(
                            "MMM D, YYYY @ h:mm A"
                          )}
                        </h6>
                      </Col>
                    </Row>
                  </div>
                  <div style={{ display: tab === "wallet" ? "block" : "none" }}>
                    <Table
                      className="table"
                      loading={loading}
                      height={450}
                      data={
                        player.walletHistory
                          ? player.walletHistory.sort(
                              (a, b) =>
                                new Date(b.createdAt) - new Date(a.createdAt)
                            )
                          : []
                      }
                    >
                      <Column width={50} fixed>
                        <HeaderCell>No</HeaderCell>
                        <Cell>{(rowData, key) => key + 1}</Cell>
                      </Column>
                      <Column width={100} fixed>
                        <HeaderCell>Balance</HeaderCell>
                        <Cell>
                          {(rowData) => {
                            return (
                              <span>
                                {new Intl.NumberFormat("en-NG", {
                                  style: "currency",
                                  currency: "NGN",
                                }).format(
                                  rowData && rowData.amount ? rowData.amount : 0
                                )}
                              </span>
                            );
                          }}
                        </Cell>
                      </Column>
                      <Column width={250} fixed>
                        <HeaderCell>Narration</HeaderCell>
                        <Cell dataKey="narration" />
                      </Column>
                      <Column width={100} fixed>
                        <HeaderCell>Status</HeaderCell>
                        <Cell dataKey="status" />
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
                    </Table>
                  </div>
                  <div style={{ display: tab === "ticket" ? "block" : "none" }}>
                    <Table
                      className="table"
                      loading={loading}
                      height={450}
                      data={
                        player.tickets
                          ? player.tickets.sort(
                              (a, b) =>
                                new Date(b.createdAt) - new Date(a.createdAt)
                            )
                          : []
                      }
                    >
                      <Column width={50} fixed>
                        <HeaderCell>No</HeaderCell>
                        <Cell>{(rowData, key) => key + 1}</Cell>
                      </Column>
                      <Column width={100} fixed>
                        <HeaderCell>Amount</HeaderCell>
                        <Cell>
                          {(rowData) => (
                            <span>{parseCurrency(rowData.amount)}</span>
                          )}
                        </Cell>
                      </Column>
                      <Column width={100} fixed>
                        <HeaderCell>Status</HeaderCell>
                        <Cell dataKey="status" />
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
                      <Column width={120} fixed>
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
                  </div>
                </div>
              </Panel>
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
}
