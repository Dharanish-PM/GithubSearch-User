import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

//Provider,Consumer-GithubContext.Provider
const GithubProvider = ({ children }) => {
  const [githubUser, setgithubUser] = useState(mockUser);
  const [repos, setrepos] = useState(mockRepos);
  const [followers, setfollowers] = useState(mockFollowers);
  //reqeust loading
  const [requests, setrequests] = useState(0);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState({ show: false, msg: "" });
  const searchGithubUser = async (user) => {
    toggleError();
    setloading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );

    if (response) {
      setgithubUser(response.data);
      const { login, followers_url } = response.data;
      axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((data) =>
        setrepos(data.data)
      );
      axios(`${followers_url}?per_page=100`).then((data) =>
        setfollowers(data.data)
      );
    } else {
      toggleError(true, "There is no user with that usename");
    }
    checkRequests();

    setloading(false);
  };
  //chek rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;

        setrequests(remaining);
        if (remaining === 0) {
          toggleError(
            true,
            "sorry,you have exceeded the rate limit for an hour"
          );
        }
      })
      .catch((err) => console.log(err));
  };
  function toggleError(show = false, msg = "") {
    seterror({ show, msg });
  }
  //error
  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};
export { GithubProvider, GithubContext };
