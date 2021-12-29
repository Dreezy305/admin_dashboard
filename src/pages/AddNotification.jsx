/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Container,
  Content,
  Panel,
  Input,
  Button,
  DatePicker,
  Alert,
} from "rsuite";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import DOMPurify from "dompurify";
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import Editor from "../components/Editor";

export default function AddNotification() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [expiry, setExpiry] = useState("");
  const [url, setUrl] = useState("");
  const [content, setEditor] = useState("");
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

  const handleEditor = (value) => {
    value = DOMPurify.sanitize(value);
    setEditor(value);
  };

  const createNotification = async (body) => {
    body = JSON.stringify(body);
    setLoading(true);
    const url = `${process.env.API_URL}notification/create`;
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
      body,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          Alert.success("Notification created successfully", 3000);
          router.push(`/notification/${res.data.id}`);
        } else {
          Alert.error("Unable to create notification", 3000);
        }
      });
  };

  const save = async () => {
    if (!title || title.length < 5) {
      Alert.error("Title is too short!");
    } else if (!expiry) {
      Alert.error("Expiry is too short!");
    } else if (!url || url.length < 5) {
      Alert.error("URL is too short!");
    } else if (!content || content.length < 5) {
      Alert.error("Notification is too short!");
    } else {
      const body = {
        title: title,
        expiry: expiry,
        content: content,
        url: url,
      };
      createNotification(body);
    }
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Add notification" />
          <Content className="container">
            <div className="inner">
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  <Input placeholder="Title" onChange={setTitle} />
                  <br />

                  <Input placeholder="URL" onChange={setUrl} />
                  <br />

                  <DatePicker
                    block
                    placeholder="Expiry date"
                    onChange={setExpiry}
                  />

                  <br />
                  <Editor placeholder="" onChange={handleEditor} />
                  <br />

                  <Button appearance="primary" onClick={save}>
                    Save
                  </Button>
                </div>
              </Panel>
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
}
