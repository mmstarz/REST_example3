import React, { useState, useEffect } from "react";
import { ApolloConsumer } from "react-apollo";
import { SEARCH_RECIPES } from "../../queries/index";
import SearchItem from "./searchItem";

const search = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // console.log(data);
  }, [data]);

  const handleChange = data => {
    // console.log(data);
    if (!data.search) {
      setSuccess(null);
      setError("No matches found");
    } else {
      setError(null);
      setSuccess("Check results");
    }
    setData(data.search);
  };

  return (
    <ApolloConsumer>
      {client => (
        <div className="search">
          <h2>Search</h2>
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
          <form className="form">
            <input
              type="search"
              placeholder="search"
              onChange={async event => {
                event.persist();
                const { data } = await client.query({
                  query: SEARCH_RECIPES,
                  variables: { term: event.target.value }
                });
                // console.log(data);
                handleChange(data);
              }}
            />
          </form>
          <div className="search-result">
            {data
              ? data.map(item => <SearchItem key={item._id} {...item} />)
              : null}
          </div>
        </div>
      )}
    </ApolloConsumer>
  );
};

export default search;
