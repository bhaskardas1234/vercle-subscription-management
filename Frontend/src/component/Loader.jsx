import React from "react";
import { TailSpin} from "react-loader-spinner";
import classes from "./Loader.module.css"

const Loader = ({height, width}) => {
  return (
    <div className={classes["loader-container"]}>
      <TailSpin
      visible={true}
      color="#0c7df6"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{}}
      wrapperClass=""
      />
    </div>)
  
  
};

export default Loader;