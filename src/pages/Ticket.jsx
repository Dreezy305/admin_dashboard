/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Container, Content, Panel, Row, Col, Tag } from "rsuite";
import { useParams, useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import moment from "moment";
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import { sumOdd, parseCurrency } from "../components/Utils";

export default function Ticket() {
  const [loading, setLoading] = React.useState(false);
  const [ticket, setTicket] = useState({ games: [], status: "" });
  const param = useParams();
  const [role, setRole] = useState("");
  const router = useHistory();
  const [cookie] = useCookies(["a_auth"]);

  useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;
    setRole(user.role);
    user.role === "media-marketing" ? router.push("/no-access") : null;
  }, []);

  useEffect(() => {
    getTicket();
  }, []);

  const getTicket = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}ticket/${param.id}`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setTicket(res.data);
          setLoading(false);
        }
      });
  };

  const calculateResult = (id) => {
    let status;
    let count = ticket.result.filter((item) => item.odd === id);
    if (count.length === 1) {
      status = count[0].status;
    } else {
      status = "pending";
    }

    return status;
  };

  const totalResult = () => {
    let status;
    if (ticket.id) {
      let odds = ticket.games
        .map((item) => item.odds)
        .reduce((a, b) => [...a, ...b], []);

      let pending = ticket.result.filter((item) => item.status === "pending");
      let win = ticket.result.filter((item) => item.status === "win");
      let lost = ticket.result.filter(
        (item) =>
          (item.status === "lost" || item.status === "win") &&
          item.status !== "pending"
      );
      if (pending.length) {
        status = "pending";
      } else if (win.length === odds.length) {
        status = "win";
      } else if (lost.length === odds.length) {
        status = "lost";
      }

      return status;
    }
  };

  const calculateOdd = (games) => {
    let odds = games.filter((item) => item.odds.length !== 0),
      newOdds = [];

    if (odds.length) {
      odds = odds.map((item) => item.odds);
      odds = odds.forEach((item) => {
        let value = sumOdd(item);
        newOdds = [...newOdds, ...value];
      });
    }

    return newOdds;
  };

  const renderOddGroup = (group, gameId, name) => {
    return group.map((item, key) => (
      <tr id={`select-${item.oddId}`} key={key}>
        <td>{item.oddId}</td>
        <td>{gameId}</td>
        <td>{name}</td>
        <td>
          {item.oddName} &nbsp; ({item.oddGroup}) {item.odd}
        </td>
        <td>{moment(item.expiry).format("MMM D, YYYY @ h:mm A")}</td>
        <td>
          <Tag
            color={
              calculateResult(item.oddId) === "win" ||
              ticket.status === "cashout"
                ? "green"
                : calculateResult(item.oddId) === "lost"
                ? "red"
                : calculateResult(item.oddId) === "pending"
                ? "orange"
                : ""
            }
          >
            <b style={{ textTransform: "capitalize" }}>
              {ticket.status === "cashout"
                ? "Cashout"
                : calculateResult(item.oddId)}
            </b>
          </Tag>{" "}
        </td>
      </tr>
    ));
  };
  const games = ticket && ticket.games ? ticket.games : [];
  let totalOdds = calculateOdd(games);
  let oddLength = totalOdds.length;
  totalOdds = totalOdds.length ? totalOdds.reduce((a, b) => a * b) : 0;
  totalOdds = totalOdds.toFixed(2);

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading
            page={`Ticket ID: ${
              ticket && ticket.ticketId ? ticket.ticketId.toUpperCase() : ""
            }`}
          />
          <Content className="container">
            <div className="inners">
              <div className="form">
                <h3>
                  {ticket.player ? ticket.player.firstName : ""}{" "}
                  {ticket.player ? ticket.player.lastName : ""}
                </h3>
                <h4>
                  <span>
                    {" "}
                    Amount: {ticket.amount ? parseCurrency(ticket.amount) : 0}
                  </span>
                </h4>

                <div className="games large" style={{ marginBottom: 20 }}>
                  <div className="ticket-heading">
                    <Row>
                      <Col sm={12} lg={12}>
                        Ticket ID
                      </Col>
                      <Col sm={12} lg={12}>
                        <span style={{ textTransform: "uppercase" }}>
                          {ticket.ticketId}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} lg={12}>
                        Date
                      </Col>
                      <Col sm={12} lg={12}>
                        {moment(ticket.createdAt).format(
                          "MMM D, YYYY @ h:mm A"
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} lg={12}>
                        Bet type
                      </Col>
                      <Col sm={12} lg={12}>
                        {ticket.type}
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} lg={12}>
                        Amount
                      </Col>
                      <Col sm={12} lg={12}>
                        {parseCurrency(ticket.amount)}
                      </Col>
                    </Row>

                    <Row>
                      <Col sm={12} lg={12}>
                        <p>Status: </p>
                      </Col>
                      <Col sm={12} lg={12}>
                        <Tag
                          color={
                            totalResult() === "win" ||
                            ticket.status === "cashout"
                              ? "green"
                              : totalResult() === "lost"
                              ? "red"
                              : totalResult() === "pending"
                              ? "orange"
                              : ""
                          }
                        >
                          <b style={{ textTransform: "capitalize" }}>
                            {ticket.status === "cashout"
                              ? "Cashout"
                              : totalResult()}
                          </b>
                        </Tag>{" "}
                      </Col>
                    </Row>

                    <Row>
                      <Col sm={12} lg={12}>
                        Total Odds
                      </Col>
                      <Col sm={12} lg={12}>
                        {totalOdds}
                      </Col>
                    </Row>

                    <Row>
                      <Col sm={12} lg={12}>
                        Winnings
                      </Col>
                      <Col sm={12} lg={12}>
                        {parseCurrency(ticket.winnings)}
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} lg={12}>
                        Bonus
                      </Col>
                      <Col sm={12} lg={12}>
                        {parseCurrency(ticket.bonus)}
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} lg={12}>
                        Potential Winnings
                      </Col>
                      <Col sm={12} lg={12}>
                        {parseCurrency(ticket.bonus + ticket.winnings)}
                      </Col>
                    </Row>
                  </div>
                  <table className="ticket-table">
                    <tr>
                      <th>Selection ID</th>
                      <th>Event ID</th>
                      <th>Name</th>
                      <th>Odd</th>
                      <th>Match date</th>
                      <th>Status</th>
                    </tr>
                    {games
                      .filter((item) => item.odds.length !== 0)
                      .map((item, key) =>
                        renderOddGroup(item.odds, item.gameId, item.name)
                      )}
                  </table>
                </div>
              </div>
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
}
