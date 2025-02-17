import { useState, useEffect } from "react";
import { FETCH_MENU_URL } from "../constants";

const useRestaurantDetails = (resId) => {
  
  const [restaurant, setRestaurant] = useState(null);

  //get data from API
  async function getRestaurantInfo(resId) {
    try {
      const data = await fetch(FETCH_MENU_URL + resId);
      const json = await data.json();
      setRestaurant(json.data.cards);
    } catch (err) {
      console.error("There was an error", err);
    }
  }
  useEffect(() => {
    getRestaurantInfo(resId);
  }, [resId]);

  return restaurant;
};

export default useRestaurantDetails;
