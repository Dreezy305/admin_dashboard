import React, { useState, useEffect } from "react";
import {
  Container,
  Content,
  Panel,
  Toggle,
  Input,
  Button,
  Alert,
} from "rsuite";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import DOMPurify from "dompurify";
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import Editor from "../components/Editor";

export default function AddContent() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [content, setEditor] = useState("");
  const [status, setStatus] = useState(false);
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

  const handleEditor = (value) => {
    value = DOMPurify.sanitize(value);
    setEditor(value);
  };

  const createContent = async (body) => {
    body = JSON.stringify(body);
    setLoading(true);
    const url = `${process.env.API_URL}content/create`;
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
          Alert.success("Content created successfully", 3000);
          router.push(`/static-content/${res.data.id}`);
        } else {
          Alert.error("Unable to create content", 3000);
        }
      });
  };

  const save = async () => {
    if (!title || title.length < 5) {
      Alert.error("Title is too short!");
    } else if (!description || description.length < 5) {
      Alert.error("Description is too short!");
    } else if (!url || url.length < 5) {
      Alert.error("URL is too short!");
    } else if (!content || content.length < 5) {
      Alert.error("Content is too short!");
    } else {
      const body = {
        title: title,
        description: description,
        content: content,
        url: url,
        status: status,
      };
      createContent(body);
    }
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Add content" />
          <Content className="container">
            <div className="inner">
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  <Toggle
                    size="lg"
                    checkedChildren="Status: Active"
                    unCheckedChildren="Status: Deactivate"
                    defaultChecked
                    onChange={setStatus}
                  />
                  <br />
                  <br />
                  <Input placeholder="Page title" onChange={setTitle} />
                  <br />
                  <Input
                    placeholder="Page description"
                    onChange={setDescription}
                  />
                  <br />
                  <Input placeholder="Page URL" onChange={setUrl} />
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
