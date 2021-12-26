import React, { useState, useEffect } from "react";
import { Container, Content, Panel, Row, Col, Loader } from "rsuite";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import Heading from "../components/Heading";
import Menu from "../components/Menu";

export default function SiteMeta() {
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState();
  const [logo, setLogo] = useState("");
  const [favicon, setFavicon] = useState("");
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
    getMeta();
  }, []);

  const getMeta = async () => {
    const url = `${process.env.API_URL}configuration/site-meta`;
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
      body: JSON.stringify({ title: "site-meta" }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          let data = res.data;
          let content = data.content;
          setMeta(data);
          setLogo(content.logo);
          setFavicon(content.favicon);
        }
      });
  };

  const updateMeta = async (data) => {
    setLoading(true);
    const content = data.logo
      ? { logo: data.logo, favicon: favicon }
      : { logo: logo, favicon: data.favicon };
    let form = meta;
    form.content = content;
    setMeta(form);

    const url = `${process.env.API_URL}configuration/update`;
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
        }
      });
  };

  const uploadLogo = async (e) => {
    e.preventDefault();
    setLoading(true);

    let upload = document.querySelector(".file");

    let form = new FormData();
    form.append("file", upload.files[0]);

    const url = `${process.env.API_URL}upload/image`;
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + process.env.API_KEY,
      },
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLogo(res.file);
          updateMeta({ logo: res.file });
          setLoading(false);
        }
      });
  };

  const uploadFavicon = async (e) => {
    e.preventDefault();
    setLoading(true);

    let upload = document.querySelector(".fav");

    let form = new FormData();
    form.append("file", upload.files[0]);

    const url = `${process.env.API_URL}upload/image`;
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + process.env.API_KEY,
      },
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setFavicon(res.file);

          updateMeta({ favicon: res.file });
          setLoading(false);
        }
      });
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Site meta" user="Howard Stern" />
          <Content className="container">
            <div className="inner">
              <center style={{ display: loading ? "block" : "none" }}>
                <Loader size={"md"} content="Uploading image..." />
                <br />
                <br />
              </center>
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  <Row>
                    <Col sm={24} lg={12}>
                      <h4>Site logo</h4>
                      <br />

                      <div className="upload-btn-wrapper">
                        <button className="btn">Upload a file</button>
                        <input
                          type="file"
                          className="file"
                          name="logo"
                          onChange={uploadLogo}
                        />
                      </div>
                      <br />
                      <br />
                      <br />
                    </Col>
                    <Col sm={24} lg={12}>
                      {logo ? (
                        <span
                          style={{
                            backgroundColor: "#ccc",
                            float: "right",
                            marginTop: 40,
                          }}
                        >
                          <img
                            src={`${process.env.API_URL}static/images/${logo}`}
                            height={50}
                          />
                        </span>
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={24} lg={12}>
                      <h4>Site favicon</h4>
                      <br />
                      <div className="upload-btn-wrapper">
                        <button className="btn">Upload a file</button>
                        <input
                          type="file"
                          className="fav"
                          name="favicon"
                          onChange={uploadFavicon}
                        />
                      </div>
                      <br />
                      <br />
                      <br />
                    </Col>
                    <Col sm={24} lg={12}>
                      {favicon ? (
                        <span
                          style={{
                            backgroundColor: "#ccc",
                            float: "right",
                            marginTop: 40,
                          }}
                        >
                          <img
                            src={`${process.env.API_URL}static/images/${favicon}`}
                            height={40}
                          />
                        </span>
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>
                </div>
              </Panel>
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
}
