import React, { useState } from "react";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const UserPage = () => {
  //initiate variables
  const [tickers, setTickers] = useState([]);
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [userName] = useState("John Doe"); // Sample user name
  const [tickerWeights, setTickerWeights] = useState({});
  const [totalAmount, setTotalAmount] = useState("");
  const [error, setError] = useState("");
  const [predictedReturns, setPredictedReturns] = useState({});
  const [categoryList, setCategory] = useState({});
  const [isTickerLoading, setIsTickerLoading] = useState(true);
  const [tickerToggle, setTickerToggle] = useState(false);
  const [colors, setColors] = useState([
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ]);
  const [pieData, setPieData] = useState([]);

  const handleCheckboxChange = (ticker) => {
    let timer;

    clearTimeout(timer);

    timer = setTimeout(() => {
      if (selectedTickers.includes(ticker)) {
        setSelectedTickers(
          selectedTickers.filter((selectedTicker) => selectedTicker !== ticker)
        );
        const updatedWeights = { ...tickerWeights };
        delete updatedWeights[ticker];
        setTickerWeights(updatedWeights);
      } else {
        setSelectedTickers([...selectedTickers, ticker]);
        if (!tickerWeights.hasOwnProperty(ticker)) {
          setTickerWeights({ ...tickerWeights, [ticker]: "" });
        }
      }
    });
  };

  const handleTotalAmountChange = (e) => {
    setTotalAmount(parseFloat(e.target.value));
  };

  const calculateValues = () => {
    let checkboxes = document.querySelectorAll('input[name="selectedTickers"]');
    let sum = 0;

    if (checkboxes) {
      checkboxes.forEach((element) => {
        sum += Number(element.value);
      });
    }

    if (sum < 100) {
      setError("Cannot be lower than 100");
    }
    if (sum == 100) {
      setError("");
    }
    if (sum > 100) {
      setError("Cannot be higher than 100");
    }

    let weight = calculateCategoryWeights();
    var keys = Object.keys(weight);
    let data = [];

    if (keys) {
      keys.forEach((k) => {
        data.push({
          name: k,
          value: weight[k],
        });
      });

      setPieData(data);
    }
  };

  const handleWeightChange = (ticker, weight) => {
    let timer;
    clearTimeout(timer);
    timer = setTimeout(calculateWeightandValues(ticker, weight), 1000);
  };

  const calculateWeightandValues = (ticker, weight) => {
    setTickerWeights({ ...tickerWeights, [ticker]: weight });
  };

  const calculateInvestmentAmount = (ticker) => {
    const weightPercentage = parseFloat(tickerWeights[ticker]) || 0;
    return ((weightPercentage / 100) * totalAmount).toFixed(2);
  };

  const calculatePredictedReturn = (ticker, tickerWeight) => {
    const tickerData = predictedReturns.find((item) => item.Ticker === ticker);
    if (tickerData) {
      const predictedReturn = tickerData["Predicted Return"] || 0;
      return (tickerWeight / 100) * predictedReturn;
    }
    return 0;
  };

  const calculatePortfolioReturn = () => {
    let portfolioReturn = 0;
    selectedTickers.forEach((ticker) => {
      const tickerWeight = parseFloat(tickerWeights[ticker]) || 0;
      portfolioReturn += calculatePredictedReturn(ticker, tickerWeight);
    });
    return portfolioReturn.toFixed(2);
  };

  // Calculate weights for each category
  const calculateCategoryWeights = () => {
    const categoryWeights = {};

    selectedTickers.forEach((ticker) => {
      const category =
        categoryList.find((item) => item.Ticker === ticker)?.Category || "";

      if (category && !isNaN(parseFloat(tickerWeights[ticker]))) {
        if (!categoryWeights[category]) {
          categoryWeights[category] = 0;
        }
        categoryWeights[category] += parseFloat(tickerWeights[ticker]);
      }
    });

    return categoryWeights;
  };

  const toogleTickerList = () => {
    if (tickerToggle) {
      setTickerToggle(false);
    } else {
      setTickerToggle(true);
    }
  };

  //Fetches data from a local server
  useEffect(() => {
    fetch("http://127.0.0.1:5000/predicted_return")
      .then((response) => response.json())
      .then((data) => {
        setIsTickerLoading(true);
        const tickerList = data.map((item) => item.Ticker);
        setTickers(tickerList);
        setIsTickerLoading(false);
        setPredictedReturns(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/symbols")
      .then((response) => response.json())
      .then((data) => {
        setCategory(data);
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
          {isTickerLoading && <h3>Tickers are loading...</h3>}
          <ul className="list-group">
            {tickers.map.length > 10 ||
              (!tickerToggle &&
                tickers.slice(0, 10).map((ticker, index) => (
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
                )))}
            {tickerToggle &&
              tickers.map((ticker, index) => (
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
          <button
            type="button"
            onClick={toogleTickerList}
            className="btn btn-primary mt-2"
          >
            {tickerToggle ? "Less" : "More"}
          </button>
        </div>
        <div className="col-md-8">
          <h3>Portfolio Details</h3>
          <div className="form-group">
            <label htmlFor="totalAmount">Total Amount in Portfolio</label>
            <input
              type="number"
              id="totalAmount"
              className="form-control"
              placeholder="Enter total amount"
              value={totalAmount}
              onChange={handleTotalAmountChange}
            />
          </div>
          <h3>Selected Tickers</h3>
          <ul className="list-group">
            {selectedTickers.map((ticker, index) => (
              <li key={index} className="list-group-item">
                <div className="d-flex align-items-center">
                  <span>{ticker}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="selectedTickers"
                    placeholder="Weight"
                    value={tickerWeights[ticker] || ""}
                    onChange={(e) =>
                      handleWeightChange(ticker, parseFloat(e.target.value))
                    }
                    className="form-control ml-auto"
                    style={{ width: "100px" }}
                  />
                  <span className="ml-2">%</span>
                  <span className="ml-2">
                    ${calculateInvestmentAmount(ticker)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={calculateValues}
            className="btn btn-primary mt-2"
          >
            Calculate
          </button>

          {error && <div className="alert alert-danger">{error}</div>}

          <h3>Predicted Returns</h3>
          <ul className="list-group">
            {selectedTickers.map((ticker, index) => {
              const tickerWeight = tickerWeights[ticker] || 0;
              const predictedReturn = calculatePredictedReturn(
                ticker,
                tickerWeight,
                predictedReturns
              );

              return (
                <li key={index} className="list-group-item">
                  <div className="d-flex align-items-center">
                    <span>Ticker: {ticker}</span>
                    <span className="ml-2">
                      Predicted Return: {predictedReturn}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          {error.length == 0 && (
            <>
              <h3>Portfolio 1 Analysis</h3>
              <div className="alert alert-primary">
                Industry Sector
                <PieChart width={500} height={200}>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {" "}
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
                <ul className="list-group">
                  {Object.entries(calculateCategoryWeights()).map(
                    ([category, weight], index) => (
                      <li key={index} className="list-group-item">
                        <div className="d-flex align-items-center">
                          <span>{category}</span>
                          <span className="ml-auto"> Weight: {weight}%</span>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              </div>{" "}
              <div className="alert alert-primary">
                Portfolio Predicted Return: {calculatePortfolioReturn()}%
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
