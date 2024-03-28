import React, { useState } from "react";
import { useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

const UserPage = () => {

 const [tickers, setTickers] = useState([]);
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [userName] = useState("John Doe"); // Sample user name

  const handleCheckboxChange = (ticker) => {
    if (selectedTickers.includes(ticker)) {
      setSelectedTickers(
        selectedTickers.filter((selectedTicker) => selectedTicker !== ticker)
      );
    } else {
      setSelectedTickers([...selectedTickers, ticker]);
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:5000/predicted_return")
      .then((response) => response.json())
      .then((data) => {
        const tickerList = data.map((item) => item.Ticker);
        setTickers(tickerList);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container col-md-10">
      <div className="row">
        <div className="col-md-12 mb-4">
          <div className="d-flex align-items-center">
            <img
              src={require("../assets/user_profile.png")}
              alt="Profile"
              className="rounded-circle mr-2"
              style={{ width: "50px", height: "50px" }}
            />
            <h2 className="m-0">{userName}</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <h3>Tickers</h3>
          <ul className="list-group">
            {tickers.map((ticker, index) => (
              <li key={index} className="list-group-item">
                <input
                  type="checkbox"
                  id={ticker}
                  checked={selectedTickers.includes(ticker)}
                  onChange={() => handleCheckboxChange(ticker)}
                />
                <label htmlFor={ticker} className="ml-2">
                  {ticker}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-8">
          {selectedTickers.length > 0 ? (
            <h3>Selected Tickers</h3>
          ) : (
            <h3>Select a ticker to show your data </h3>
          )}

          <ul className="list-group">
            {selectedTickers.map((ticker, index) => (
              <li key={index} className="list-group-item">
                {ticker}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
