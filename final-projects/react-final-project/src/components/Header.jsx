import React from "react";
import {Link} from "react-router-dom";

export default function Header() {
  return (
      <>
          <Link to="/" className="link">Home</Link>
          <Link to="/quiz" className="link">Quiz</Link>

          <header>
              <h1>Which art theme embodies your tech vibe?</h1>
          </header>
      </>
  );
}