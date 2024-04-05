import React from "react";

const ticker_checkbox = ({index,ticker}) => {
  return (
    <>
      {" "}
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
    </>
  );
};

export default ticker_checkbox;
