import React from "react";
import { Image } from "react-bootstrap";

// import ReactLogo from "../assets/img/technologies/react-logo-transparent.svg";
import Hive from "../assets/img/icons/hive-blue.svg";

export default (props) => {
  const { show } = props;

  return (
    <div
      className={`preloader bg-soft flex-column justify-content-center align-items-center ${
        show ? "" : "show"
      }`}
    >
      <Image
        className="loader-element animate__animated animate__jackInTheBox"
        src={Hive}
        height={40}
      />
    </div>
  );
};
