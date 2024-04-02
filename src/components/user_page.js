import React, { useState } from "react";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pie } from 'react-chartjs-2';
import { useRef } from 'react';


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

  const handleCheckboxChange = (ticker) => {
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
  };

  const handleTotalAmountChange = (e) => {
    setTotalAmount(parseFloat(e.target.value));
  };


  const handleWeightChange = (ticker, weight) => {
    const totalWeight = Object.values(tickerWeights).reduce((acc, cur) => acc + parseFloat(cur || 0), 0);

    if (isNaN(weight) || weight < 0 || weight > 100 ) {
      setError("Weight must be a number between 0 and 100.");
      return;
    }

    if (totalWeight > 100) {
      setError("Total weight cannot exceed 100%.");
      return;
    }
  
    if (totalWeight - (tickerWeights[ticker] || 0) + weight > 100) {
      setError("Total weight of all tickers must sum up to 100%.");
      return;
    }

    setTickerWeights({ ...tickerWeights, [ticker]: weight });
    setError("");
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
    const category = categoryList.find((item) => item.Ticker === ticker)?.Category || '';

    if (category && !isNaN(parseFloat(tickerWeights[ticker]))) {
      if (!categoryWeights[category]) {
        categoryWeights[category] = 0;
      }
      categoryWeights[category] += parseFloat(tickerWeights[ticker]);
    }
  });

  return categoryWeights;
  };

  const generatePieChartData = () => {
    const categoryWeights = calculateCategoryWeights();
  
    return {
      labels: Object.keys(categoryWeights),
      datasets: [{
        data: Object.values(categoryWeights),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }],
    };
  };
  


  
  //Fetches data from a local server
  useEffect(() => {
    fetch("http://127.0.0.1:5000/predicted_return")
      .then((response) => response.json())
      .then((data) => {
        const tickerList = data.map((item) => item.Ticker);
        setTickers(tickerList);
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
                    placeholder="Weight"
                    value={tickerWeights[ticker] || ""}
                    onChange={(e) => handleWeightChange(ticker, parseFloat(e.target.value))}
                    className="form-control ml-auto"
                    style={{ width: "100px" }}
                  />
                  <span className="ml-2">%</span>
                  <span className="ml-2">${calculateInvestmentAmount(ticker)}</span>
                </div>
              </li>
            ))}
          </ul>
          {error && <div className="alert alert-danger">{error}</div>}

          <h3>Predicted Returns</h3>
            <ul className="list-group">
              {selectedTickers.map((ticker, index) => {
                const tickerWeight = tickerWeights[ticker] || 0;
                const predictedReturn = calculatePredictedReturn(ticker, tickerWeight, predictedReturns);
                
                return (
                  <li key={index} className="list-group-item">
                    <div className="d-flex align-items-center">
                      <span>Ticker: {ticker}</span>
                      <span className="ml-2">Predicted Return: {predictedReturn}</span>
                      
                    </div>
                  </li>
                );
              })}
            </ul>
          <h3>Portfolio 1 Analysis</h3>
            <div className="alert alert-primary">
              Industry Sector 
              {/* <ul className="list-group">
                {selectedTickers.map((ticker, index) => {
                  // Find the corresponding category for the current ticker
                  const category = categoryList.find(item => item.Ticker === ticker)?.Category || '';
                  
                  return (
                    <li key={index} className="list-group-item">
                      <div className="d-flex align-items-center">
                        <span>Ticker: {ticker}</span>
                        <span className="ml-2">Category: {category}</span>
                      </div>
                    </li>
                  );
               })}
              </ul> */}
              <ul className="list-group">
                {Object.entries(calculateCategoryWeights()).map(([category, weight], index) => (
                  <li key={index} className="list-group-item">
                    <div className="d-flex align-items-center">
                      <span>{category}</span>
                      <span className="ml-auto">Weight: {weight}%</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="alert alert-primary">
              
              Portfolio Predicted Return: {calculatePortfolioReturn()}%
            </div>
        </div>

      </div>
    </div>
  );
};

export default UserPage;
