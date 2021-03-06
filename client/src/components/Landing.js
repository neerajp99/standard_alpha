import React, { Component } from "react";
import tickers from "../utils/symbols.json";
import escapeRegExp from "escape-string-regexp";
import EnhancedTableHead from "./tables/Tables";
import StickyHeadTable from "./tables/Table";
import RiskProfile from "./graphs/RiskProfile";
import axios from "axios";
import keys from "../config";
import qs from "qs";
// import setAuthToken from "./utils/setAuthToken";

class Landing extends Component {
  state = {
    ticker: "",
    currentTicker: "BANKNIFTY"
  };

  // on click ticker function to make the changes to the styles
  onClickTicker = event => {
    // Send a requst to get the expiration for the given ticker
    const token = "Bearer <Token>";
    axios.defaults.headers.common["Authorization"] = token;
    axios({
      method: "GET",
      url: "https://sandbox.tradier.com/v1/markets/options/expirations",
      headers: {
        "content-type": "application/json"
      },
      params: {
        symbol: `VXX`,
        // Change the above with the below, if you are using a broker account and not a sandbox
        // symbol: event.currentTarget.dataset.id,
        includeAllRoots: "true",
        strikes: "true"
      }
    })
      .then(response => {
        const expiry = response.data.expirations.expiration[0].date;
        axios({
          method: "GET",
          url: "https://sandbox.tradier.com/v1/markets/options/chains",
          headers: {
            "content-type": "application/json"
          },
          params: {
            symbol: `VXX`,
            expiration: expiry,
            greeks: "true"
          }
        })
          .then(response => {
          console.log(response.data)
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
    // request(
    //   {
    //     method: "get",
    //     url: "https://sandbox.tradier.com/v1/markets/options/expirations",
    //     qs: {
    //       symbol: event.currentTarget.dataset.id,
    //       includeAllRoots: "true",
    //       strikes: "true"
    //     },
    //     headers: {
    //       Authorization: `Bearer ${keys.key}`,
    //       Accept: "application/json"
    //     }
    //   },
    //   (error, response, body) => {
    //     console.log(response.statusCode);
    //     console.log("EXPIRy", body);
    //   }
    // );

    console.log(event.currentTarget.dataset.id);
    this.setState({
      currentTicker: event.currentTarget.dataset.id
    });
  };

  // If a user search something, change the query state
  onChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  // On click function to fetch option chain details

  showlingTickers = () => {};
  render() {
    // Check if the user asks for a query, and filter them out, else tickers
    const { ticker } = this.state;
    let showingTickers;
    if (ticker) {
      const match = new RegExp(escapeRegExp(ticker), "i");
      showingTickers = tickers.filter(tick => match.test(tick["SYMBOL"]));
    } else {
      showingTickers = tickers;
    }
    return (
      <div className="wrapper">
        <div className="col-md-2 landing_left">
          <form className="form-inline my-2 my-lg-0">
            <input
              className="form-control mr-sm-2 ticker_input"
              type="search"
              placeholder="Search"
              aria-label="Search"
              name="ticker"
              onChange={this.onChange}
            />
            <button
              className="ticker_button btn btn-outline-success my-2 my-sm-0 "
              type="submit"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 17 18"
                className=""
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="#fff" fillRule="evenodd">
                  <path
                    className="_2BhAHa"
                    d="m11.618 9.897l4.225 4.212c.092.092.101.232.02.313l-1.465 1.46c-.081.081-.221.072-.314-.02l-4.216-4.203"
                  />
                  <path
                    className="_2BhAHa"
                    d="m6.486 10.901c-2.42 0-4.381-1.956-4.381-4.368 0-2.413 1.961-4.369 4.381-4.369 2.42 0 4.381 1.956 4.381 4.369 0 2.413-1.961 4.368-4.381 4.368m0-10.835c-3.582 0-6.486 2.895-6.486 6.467 0 3.572 2.904 6.467 6.486 6.467 3.582 0 6.486-2.895 6.486-6.467 0-3.572-2.904-6.467-6.486-6.467"
                  />
                </g>
              </svg>
            </button>
          </form>
          <ul className="tickers_list list-group">
            {showingTickers.map((ticker, index) => {
              return (
                <li
                  key={index}
                  className="ticker_list_item list-group-item active"
                  name={ticker["SYMBOL"]}
                  data-id={ticker["SYMBOL"]}
                  onClick={this.onClickTicker}
                >
                  {ticker["SYMBOL"]}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-md-10 landing_right">
          <div className="landing_right_top_main">
            <nav>
              <div
                className="nav nav-tabs nav-fill full-nav-item"
                id="nav-tab"
                role="tablist"
              >
                <a
                  className="nav-item nav-link active nav_item_text"
                  id="nav-home-tab"
                  data-toggle="tab"
                  href="#chains"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                >
                  Chain & Greeks
                </a>

                <a
                  className="nav-item nav-link nav_item_text"
                  id="nav-contact-tab"
                  data-toggle="tab"
                  href="#spreads"
                  role="tab"
                  aria-controls="nav-contact"
                  aria-selected="false"
                >
                  Spreads
                </a>
                <a
                  className="nav-item nav-link nav_item_text"
                  id="nav-contact-tab"
                  data-toggle="tab"
                  href="#lab"
                  role="tab"
                  aria-controls="nav-contact"
                  aria-selected="false"
                >
                  Lab
                </a>
                <a
                  className="nav-item nav-link nav_item_text"
                  id="nav-contact-tab"
                  data-toggle="tab"
                  href="#test"
                  role="tab"
                  aria-controls="nav-contact"
                  aria-selected="false"
                >
                  Test
                </a>
              </div>
            </nav>

            <div className="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
              <div
                className="tab-pane fade show active mafia_main_content"
                id="chains"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
              >
                <EnhancedTableHead />
              </div>

              <div
                className="tab-pane fade mafia_main_content"
                id="spreads"
                role="tabpanel"
                aria-labelledby="nav-contact-tab"
              >
                <RiskProfile />
              </div>
              <div
                className="tab-pane fade mafia_main_content"
                id="lab"
                role="tabpanel"
                aria-labelledby="nav-contact-tab"
              >
                Coming soon..
              </div>
              <div
                className="tab-pane fade mafia_main_content"
                id="test"
                role="tabpanel"
                aria-labelledby="nav-contact-tab"
              >
                Coming soon..
              </div>
            </div>
          </div>
          <div className="landing_right_bottom_main">
            <button className="ticker_name_button" onClick={this.onClick}>
              {this.state.currentTicker}
            </button>
            <h5 className="positions_tasks_heading">
              Positions and Simulated Tasks
            </h5>
            /*{<hr className="positions_tasks_hr" />}*/
            <br />
            <StickyHeadTable />;
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
