import React, { useContext, useEffect, useRef, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import { API_URL, API_URL3 } from "../constants";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import { filterData, getNumberFromString } from "../utils/helper";
import useOnlineStatus from "../utils/useOnlineStatus";
import LocationContext from "../utils/LocationContext";
// import heroImg from "../../assets/hero-img.jpg";
import heroImg from "../../assets/hero-img.jpg";
import BodyShimmer from "./BodyShimmer";

const Body = () => {
  const [searchText, setSearchText] = useState("");
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setfilteredRestaurants] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const totalOpenRestaurants = useRef(0);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [filter, setFilter] = useState("RELEVANCE");
  const [searching, setSearching] = useState(false);

  const { locationGlobal } = useContext(LocationContext);
  const latitude = locationGlobal.coordinates.latitude;
  const longitude = locationGlobal.coordinates.longitude;

  async function getRestaurants(url) {
    try {
      //lat=22.814794130574803&lng=86.09871324151756
      const data = await fetch(`${url}lat=${latitude}&lng=${longitude}`);
      const json = await data.json();

      if (url === API_URL || offset === 0) {
        if (url === API_URL) {
          let gridWidget = json.data.cards
            .filter(
              (ele) =>
                ele.card.card["@type"] ===
                "type.googleapis.com/swiggy.gandalf.widgets.v2.GridWidget"
            )
            .filter(
              (ele) =>
                ele.card.card.gridElements.infoWithStyle["@type"] ===
                "type.googleapis.com/swiggy.presentation.food.v2.FavouriteRestaurantInfoWithStyle"
            )
            .flatMap(
              (ele) => ele.card.card.gridElements.infoWithStyle.restaurants
            );
          gridWidget = gridWidget.filter(
            (ele, idx) =>
              idx === gridWidget.findIndex((obj) => obj.info.id === ele.info.id)
          );
          setAllRestaurants(gridWidget);
          setfilteredRestaurants(gridWidget);
          totalOpenRestaurants.current = 300; // needs to be changed

          setTotalRestaurants(21); // needs to be changed
        } else {
          const arr = json.data.cards;
          const restaurantList = arr.map((item) => {
            return item.card.card.gridElements.infoWithStyle.restautants;
          });
          setfilteredRestaurants(restaurantList);
          setIsLoading(false);
        }
      } else {
        const arr = json.data.cards;
        let restaurantList = json.data.cards
          .filter(
            (ele) =>
              ele.card.card["@type"] ===
              "type.googleapis.com/swiggy.gandalf.widgets.v2.GridWidget"
          )
          .filter(
            (ele) =>
              ele.card.card.gridElements.infoWithStyle["@type"] ===
              "type.googleapis.com/swiggy.presentation.food.v2.FavouriteRestaurantInfoWithStyle"
          )
          .flatMap(
            (ele) => ele.card.card.gridElements.infoWithStyle.restaurants
          );
        setAllRestaurants([...allRestaurants, ...restaurantList]);
        setfilteredRestaurants([...filteredRestaurants, ...restaurantList]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("There was an error", error);
    }
  }

  const handelInfiniteScroll = async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 10 >=
          document.documentElement.scrollHeight &&
        offset + 16 <= totalOpenRestaurants.current &&
        !searching
      ) {
        setIsLoading(true);
        setOffset(offset + 16);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      getRestaurants(API_URL);
    }
    setOffset(0);
  }, [latitude, longitude]);

  function handleFilter(event) {
    if (event.target.tagName.toLowerCase() === "button") {
      if (event.target.dataset.filtertype === "RELEVANCE") {
        setfilteredRestaurants(allRestaurants);
      } else if (event.target.dataset.filtertype === "DELIVERY_TIME") {
        let rest = [...filteredRestaurants];
        rest.sort((a, b) => a.info.sla.deliveryTime - b.info.sla.deliveryTime);
        setfilteredRestaurants(rest);
      } else if (event.target.dataset.filtertype === "RATING") {
        let rest = [...filteredRestaurants];
        rest.sort((a, b) => b.info.avgRatingString - a.info.avgRatingString);
        setfilteredRestaurants(rest);
      } else if (event.target.dataset.filtertype === "COST_FOR_TWO_L2H") {
        let rest = [...filteredRestaurants];
        rest.sort(
          (a, b) =>
            getNumberFromString(a.info.costForTwo) -
            getNumberFromString(b.info.costForTwo)
        );
        setfilteredRestaurants(rest);
      } else if (event.target.dataset.filtertype === "COST_FOR_TWO_H2L") {
        let rest = [...filteredRestaurants];
        rest.sort(
          (a, b) =>
            getNumberFromString(b.info.costForTwo) -
            getNumberFromString(a.info.costForTwo)
        );
        setfilteredRestaurants(rest);
      }
    }
  }

  const onlineStatus = useOnlineStatus();

  //early return
  if (onlineStatus === false) {
    return <p className="font-bold text-center">You are offline ! 🔴</p>;
  }

  return allRestaurants.length === 0 ? (
    <BodyShimmer />
  ) : (
    <React.Fragment>
      <div className="w-[80vw] flex flex-col justify-center">
        <div className="bg-slate-50 flex  flex-col items-center justify-center ">
          <div className="hero-section  relative h-[30rem] flex  items-center w-full">
            <img
              src="https://b.zmtcdn.com/web_assets/81f3ff974d82520780078ba1cfbd453a1583259680.png"
              className="h-full w-full absolute object-cover "
              alt="food background image"
            ></img>

            {/* {search bar} */}
            <div className="my-12 flex flex-grow items-center justify-center  z-[2] ">
              <div className="flex justify-between w-1/3 border border-slate-600 border-1 focus:w-2/3 rounded-lg overflow-hidden   ">
                <input
                  data-testid="search-input"
                  type="text"
                  className="p-3 grow h-12 w-[90%] focus:outline-none"
                  placeholder="Search for restaurants"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    if (e.target.value === "") {
                      setfilteredRestaurants(allRestaurants);
                    }
                  }}
                />
                <button
                  data-testid="search-btn"
                  className="p-3 bg-black/80"
                  aria-label="search"
                  onClick={() => {
                    const filtedData = filterData(searchText, allRestaurants);
                    setfilteredRestaurants(filtedData);
                    setSearching(true);
                  }}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* restaurants */}
          <div className="">
            <div className="filterHeader lg:px-12 md:px-4 border-b-2 flex justify-between  my-8 ">
              <span className="text-[26px] font-semibold  text-gray-800 whitespace-nowrap">
                {totalRestaurants} restaurants
              </span>
              <div
                className="filterList flex gap-4 px-2   text-slate-600 whitespace-nowrap font-semibold"
                onClick={(e) => handleFilter(e)}
              >
                <button
                  className="hover:border-b border-black hover:text-black "
                  data-filtertype="RELEVANCE"
                >
                  Relevance
                </button>
                <button
                  className="hover:border-b border-black hover:text-black "
                  data-filtertype="DELIVERY_TIME"
                >
                  Delivery Time
                </button>
                <button
                  className="hover:border-b border-black hover:text-black "
                  data-filtertype="RATING"
                >
                  Rating
                </button>
                <button
                  className="hover:border-b border-black hover:text-black "
                  data-filtertype="COST_FOR_TWO_L2H"
                >
                  Cost: Low To High
                </button>
                <button
                  className="hover:border-b border-black hover:text-black"
                  data-filtertype="COST_FOR_TWO_H2L"
                >
                  Cost: High To Low
                </button>
              </div>
            </div>
            <div
              className="restaurant flex flex-wrap justify-center  "
              data-testid="res-list"
            >
              {filteredRestaurants.length === 0
                ? searchText && (
                    <p className="w-full font-bold text-center">
                      No Restaurants Found
                    </p>
                  )
                : filteredRestaurants.map((restaurant) => {
                    return (
                      <Link
                        to={"/restaurant/" + restaurant.info.id}
                        key={restaurant.info.id}
                      >
                        <RestaurantCard {...restaurant.info} c />
                      </Link>
                    );
                  })}
              {isLoading && searchText.length === 0 && <Shimmer />}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Body;
