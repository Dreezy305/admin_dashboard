import React, { useState, useEffect } from "react";
import { Container, Content, Input, Button, Table, Row, Col } from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import moment from "moment";
import Heading from "../components/Heading";
import Menu from "../components/Menu";

export default function Banners() {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
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
    getBanners();
  }, []);

  const getBanners = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}banners?page=1&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setBanners(res.data);
          setLoading(false);
        }
      });
  };

  const searchBanner = async (query) => {
    setLoading(true);
    const url = `${process.env.API_URL}banners/search?query=${query}&page=1&limit=1000`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setBanners(res.data);
          setLoading(false);
        }
      });
  };

  const handleSearch = (val) => {
    val = val.trim();

    if (val) {
      searchBanner(val);
    } else {
      getBanners();
    }
  };

  const prev = () => {
    let pageNumber = page <= 1 ? 1 : page - 1;
    setPage(pageNumber);
    if (search) {
      searchBanner(search);
    } else {
      setPage(pageNumber);
      getBanners();
    }
  };

  const next = () => {
    let pageNumber = page + 1;
    setPage(pageNumber);
    if (search) {
      searchBanner(search);
    } else {
      setPage(pageNumber);
      getBanners();
    }
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Banners" />
          <Content className="container">
            <div>
              <div className="search">
                <Row>
                  <Col sm={24} lg={8}>
                    {/* <Input
                      size="lg"
                      type="search"
                      placeholder="Search using title, description...."
                      onChange={handleSearch}
                    /> */}
                  </Col>
                </Row>
              </div>

              <h4 className="top-heading">
                {banners.length}
                {banners.length <= 1 ? " Banner" : " Banners"}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button href="/banners/add">+ New</Button>
              </h4>
            </div>
            <br />
            <Table
              className="table"
              loading={loading}
              height={600}
              data={banners}
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
                <HeaderCell>Banner</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <img
                        src={`${process.env.API_URL}static/banners/${rowData.image}`}
                        height={20}
                      />
                    );
                  }}
                </Cell>
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

              <Column width={120} fixed="right">
                <HeaderCell>Action</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <span>
                        <Button
                          size="xs"
                          appearance="ghost"
                          href={`/banner/${rowData.id}`}
                        >
                          {" "}
                          Edit{" "}
                        </Button>
                        &nbsp;&nbsp;
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
                disabled={banners.length < 50 ? true : false}
              >
                &larr; Prev
              </Button>
              <Button
                appearance="default"
                onClick={next}
                disabled={banners.length < 50 ? true : false}
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
