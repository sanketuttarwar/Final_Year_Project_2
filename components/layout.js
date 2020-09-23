import React from "react";
import Header from "./header";

export default (props) => {
  return (
      <div>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
        <Header />
        {props.children}
      </div>
  );
};
