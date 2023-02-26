import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsCart4 } from "react-icons/bs";
import { TbCurrentLocation } from "react-icons/tb";
import useGetAddress from "../utils/useGetAddress";
import { useContext, useState, useEffect, useRef } from "react";
import { HERE_MAP_API_KEY } from "../constants";
import LocationSideBar from "./LocationSideBar";
import AddressContext from "../utils/AddressContext";
import useClickOutside from "../utils/useClickOutside";

const Logo = () => {
  return (
    <a href="/">
      <img className="w-24 p-2" src={logo} alt="logo"></img>
    </a>
  );
};

const Header = () => {
  const [toggleLocationSideBar, setToggleLocationBar] = useState(false);
  const cartTotalCount = useSelector((store) => store.cart.totalItemCount);
  const { addressGlobal } = useContext(AddressContext);
  const locationSideBarRef = useClickOutside(() => setToggleLocationBar(false));

  return (
    <div className="flex justify-between items-center  shadow-md z-10">
      {/* {console.log("header re-render")} */}
      <div className="flex items-center">
        <Logo />
        <span className="font-poppins text-xs text-orange-400">
          {addressGlobal?.length > 50
            ? `${addressGlobal?.slice(0, 50)}...`
            : addressGlobal}
        </span>
      </div>
      <div>
        <ul className="flex list-none pr-14 font-poppins">
          <li className="p-3 mr-10">
            <Link to="/">Home</Link>
          </li>
          <li className="p-3 mr-10">
            <Link to="/about">About</Link>
          </li>
          <li className="p-3 mr-10">
            <Link to="/help">Help</Link>
          </li>
          <li className="pt-3 px-3 mr-10">
            <Link to="/cart" className="flex gap-1 items-center">
              <BsCart4 className="inline text-2xl text-orange-400" />
              <span className=" font-bold text-orange-400 p-[1px]">
                {cartTotalCount ? <div>{cartTotalCount}</div> : ""}
              </span>
            </Link>
          </li>
          <div ref={locationSideBarRef}>
            <li className="pt-3 px-3 mr-10">
              <button
                onClick={() => {
                  setToggleLocationBar(true);
                }}
                className="flex items-center"
              >
                <TbCurrentLocation className="text-xl text-orange-400" />
                <span>location</span>
              </button>
            </li>
            {/* <input
              className="border ml-3 pl-5"
              placeholder="enter your location"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                if (e.target.value.length > 2) getAutoCompletion(e.target.value);
              }}
            /> */}

            <LocationSideBar
              isVisible={toggleLocationSideBar}
              setToggle={(param) => setToggleLocationBar(param && true)}
            />
          </div>
        </ul>
      </div>
      {/* <button>login</button> */}
    </div>
  );
};
export default Header;
