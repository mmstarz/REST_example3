import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { SIGNUP_USER } from "../../queries/index";
import Spinner from '../loader/spinner';
// import Error from '../error/error';

const Signup = props => {
  const [isInvalid, setInvalid] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [signupInput, setSignupInput] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const { username, email, password, confirmPassword } = signupInput;

  useEffect(() => {
    // console.log("Component didMount");
    // console.log(signupInput);
    if (password !== confirmPassword) {
      setError("Passwords doesn`t match");
    } else {
      setError(null);
    }

    if (!username || !email || !password) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
    // console.log('isInvalid', isInvalid);
    return () => {
      //   console.log(signupInput);
    };
  }, [signupInput]);

  // const handleChangeClassWay = event => {
  //   const {name , value } = event.target;
  //   this.setState({ [name]: value })
  // }

  const handleClear = async () => {
    // event.pereventDefault();
    setSignupInput({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event, signupUser) => {
    await event.preventDefault();
    try {
      // await signupUser();
      const response = await signupUser();
      // console.log(response.data);
      const token = response.data.signupUser.token;
      await localStorage.setItem("token", token);
      await props.refetch();
      await setError(null);
      await setSuccess("Registered Successfully");
      await setSignupInput({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      props.history.push("/");
    } catch (err) {
      // console.log(err.message);
      await setSuccess(null);
      const error = err.message.split(":")[1];
      await setError(error);
    }
  };

  return (
    <div className="signup">
      <h2>Sign Up</h2>
      {error ? (
        <div className="error_message">
          <p>{error}</p>
        </div>
      ) : null}
      {success ? (
        <div className="success_message">
          <p>{success}</p>
        </div>
      ) : null}
      <Mutation
        mutation={SIGNUP_USER}
        variables={{
          username,
          email,
          password
        }}
      >
        {(signupUser, { data, loading, error }) => {
          if (loading) return <Spinner />;
          // if (error) setInvalid(true);

          return (
            <form
              className="form"
              onSubmit={event => handleSubmit(event, signupUser)}
            >
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={event =>
                  setSignupInput({
                    ...signupInput,
                    username: event.target.value
                  })
                }
                value={username}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={event =>
                  setSignupInput({ ...signupInput, email: event.target.value })
                }
                value={email}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={event =>
                  setSignupInput({
                    ...signupInput,
                    password: event.target.value
                  })
                }
                value={password}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={event =>
                  setSignupInput({
                    ...signupInput,
                    confirmPassword: event.target.value
                  })
                }
                value={confirmPassword}
              />
              <div className="form-actions">
                <button
                  type="button"
                  className="button-cancel"
                  onClick={handleClear}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={
                    isInvalid ? "button-primary-disabled" : "button-primary"
                  }
                  disabled={loading || isInvalid}
                >
                  Submit
                </button>
              </div>
            </form>
          );
        }}
      </Mutation>
    </div>
  );
};

export default withRouter(Signup);
