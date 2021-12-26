import React, { useState, useEffect } from "react";
import { Container, Content, Input, Button, Table, Row, Col } from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import moment from "moment";
import Heading from "../components/Heading";
import Menu from "../components/Menu";

export default function Bonuses() {
  const [loading, setLoading] = useState(false);
  const [bonus, setBonus] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [role, setRole] = useState("");
  const router = useHistory();
  const [cookie] = useCookies(["a_auth"]);

  useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;
    setRole(user.role);
    user.role === "accountant" ||
    user.role === "finance" ||
    user.role === "media-marketing" ||
    user.role === "accountant" ||
    user.role === "customer-service"
      ? router.push("/no-access")
      : null;
  }, []);

  useEffect(() => {
    getBonus();
  }, []);

  const getBonus = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}bonuses`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setBonus(res.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
  };

  const searchBonus = async (query) => {
    setLoading(true);
    const url = `${process.env.API_URL}bonus/search?query=${query}&page=1&limit=1000`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setBonus(res.data);
          setLoading(false);
        }
      });
  };

  const handleSearch = (val) => {
    val = val.trim();

    if (val) {
      searchBonus(val);
    } else {
      getBonus();
    }
  };

  const prev = () => {
    let pageNumber = page <= 1 ? 1 : page - 1;
    setPage(pageNumber);
    if (search) {
      searchBonu(search);
    } else {
      setPage(pageNumber);
      getBonus();
    }
  };

  const next = () => {
    page = page + 1;
    setPage(page);
    if (search) {
      searchBonus(search);
    } else {
      setPage(1);
      getBonus();
    }
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Bonus" />
          <Content className="container">
            <div>
              <h4 className="top-heading">
                {bonus.length}
                {bonus.length <= 1 ? " Bonus" : " Bonus"}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button href="/bonuses/add">+ New</Button>
              </h4>
            </div>
            <br />
            <Table
              className="table"
              loading={loading}
              height={600}
              data={bonus}
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
              <Column width={100} fixed>
                <HeaderCell>Type</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <span style={{ textTransform: "capitalize" }}>
                        {rowData.content && rowData.content.type
                          ? rowData.content.type
                          : "Not set"}
                      </span>
                    );
                  }}
                </Cell>
              </Column>

              <Column width={200} fixed>
                <HeaderCell>Frequency </HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <span>
                        {rowData.content && rowData.content.occurence
                          ? rowData.content.occurence
                          : "Not set"}
                      </span>
                    );
                  }}
                </Cell>
              </Column>

              <Column width={200} fixed>
                <HeaderCell>Expiration (in days)</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <span>
                        {rowData.content && rowData.content.expiration
                          ? rowData.content.expiration
                          : "Not set"}
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
                          href={`/bonus/${rowData.id}`}
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
                disabled={bonus.length < 50 ? true : false}
              >
                &larr; Prev
              </Button>
              <Button
                appearance="default"
                onClick={next}
                disabled={bonus.length < 50 ? true : false}
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
