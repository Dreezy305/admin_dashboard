import React, { useState } from "react";
import {
  Button,
  Container,
  Content,
  FlexboxGrid,
  Panel,
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Icon,
  Alert,
} from "rsuite";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, setCookie] = useCookies(["a_auth"]);
  const router = useHistory();

  const authenticate = () => {
    if (!email) {
      Alert.error("Invalid email address!");
    } else if (password.length < 6) {
      Alert.error("Password should be minimum of 6 characters!");
    } else {
      const form = JSON.stringify({ email, password });
      const uri = `${process.env.API_URL}admin/login`;

      fetch(uri, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Basic " + process.env.API_KEY,
        },
        body: form,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const user = JSON.stringify({
              name: data.data.name,
              email: data.data.email,
              id: data.data.id,
              role: data.data.role,
            });
            setCookie("a_auth", user, {
              path: "/",
              sameSite: true,
              // expires: 60 * 120,
            });
            Alert.success(
              "Signed in successfully. Redirecting to dashboard...."
            );
            router.push("/");
          } else {
            Alert.error("Invalid email or password!");
          }
        });
    }
  };

  return (
    <div className="show-fake-browser login-page">
      <Container className="login">
        <Content>
          <FlexboxGrid justify="center">
            <FlexboxGrid.Item colspan={12}>
              <Panel header={<h3>Admin Login</h3>} bordered>
                <Form fluid>
                  <FormGroup>
                    <FormControl
                      className="input"
                      name="name"
                      placeholder="Email address"
                      onChange={(val) => setEmail(val)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControl
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="input"
                      onChange={(val) => setPassword(val)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button color="red" block onClick={() => authenticate()}>
                      Sign in
                    </Button>
                  </FormGroup>
                </Form>
              </Panel>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Content>
      </Container>
    </div>
  );
}
