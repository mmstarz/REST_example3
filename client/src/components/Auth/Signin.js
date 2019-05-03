import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { SIGNIN_USER } from "../../queries/index";
import Spinner from '../loader/spinner';

const Signin = props => {
  const [isInvalid, setInvalid] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [signinInput, setSigninInput] = useState({
    email: "",
    password: ""
  });
  const { email, password } = signinInput;

  useEffect(() => {
    // console.log("Component didMount");
    // console.log(signupInput);
    if (!email || password.length < 4) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
    // console.log(AuthData);
    return () => {
      //   console.log(signupInput);
    };
  }, [signinInput]);

  const handleClear = async () => {
    // event.pereventDefault();
    setSigninInput({
      email: "",
      password: ""
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event, signinUser) => {
    await event.preventDefault();
    try {
      const response = await signinUser();
      // console.log(data);
      const token = response.data.signinUser.token;
      await localStorage.setItem("token", token);      
      await props.refetch();
      await setError(null);
      await setSuccess("Logged Successfully");
      await setSigninInput({
        email: "",
        password: ""
      });
      // redirect
      props.history.push('/');
    } catch (err) {
      // console.log(err.message);
      await setSuccess(null);
      const error = err.message.split(":")[1];
      await setError(error);
    }
  };

  return (
    <div className="signin">
      <h2>Sign In</h2>
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
      <Mutation mutation={SIGNIN_USER} variables={{ email, password }}>
        {(signinUser, { data, loading, error }) => {
          if (loading) return <Spinner />;

          return (
            <form
              className="form"
              onSubmit={event => handleSubmit(event, signinUser)}
            >
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={event =>
                  setSigninInput({ ...signinInput, email: event.target.value })
                }
                value={email}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={event =>
                  setSigninInput({
                    ...signinInput,
                    password: event.target.value
                  })
                }
                value={password}
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

export default withRouter(Signin);
