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
import { useParams, useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import DOMPurify from "dompurify";
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import Editor from "../components/Editor";

export default function Notification() {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({});
  const [title, setTitle] = useState("");
  const [expiry, setExpiry] = useState("");
  const [url, setUrl] = useState("");
  const [content, setEditor] = useState("");
  const param = useParams();
  const [role, setRole] = useState("");
  const router = useHistory();
  const [cookie] = useCookies(["a_auth"]);

  useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;
    setRole(user.role);
    user.role === "finance" || user.role === "accountant"
      ? router.push("/no-access")
      : null;
  }, []);

  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}notification/${param.id}`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          let data = res.data;
          setNotification(data);
          setTitle(data.title);
          setExpiry(data.expiry);
          setUrl(data.url);
          setEditor(data.content);

          setLoading(false);
        } else {
          setNotify(res.error);
        }
      });
  };

  const handleEditor = (value) => {
    value = DOMPurify.sanitize(value);
    setEditor(value);
  };

  const updateNotification = async (body) => {
    body = JSON.stringify(body);
    setLoading(true);
    const url = `${process.env.API_URL}notification/update`;
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
          Alert.success("Notification updated successfully", 3000);
        } else {
          Alert.error("Unable to update notification", 3000);
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
        id: notification.id,
        title: title,
        expiry: expiry,
        content: content,
        url: url,
      };
      updateNotification(body);
    }
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Notification" />
          <Content className="container">
            <div className="inner">
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={setTitle}
                  />
                  <br />

                  <Input placeholder="URL" value={url} onChange={setUrl} />
                  <br />

                  <DatePicker
                    block
                    placeholder="Expiry date"
                    value={expiry}
                    onChange={setExpiry}
                  />

                  <br />
                  {content ? (
                    <Editor
                      placeholder=""
                      value={content}
                      onChange={handleEditor}
                    />
                  ) : (
                    ""
                  )}

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
