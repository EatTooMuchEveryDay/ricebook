import * as React from 'react';

export default function NavBar() {
  return (
    <nav className="blue">
      <div className="nav-wrapper">
        {/* <a href="" className="brand-logo">Logo</a> */}
        <span className="material-icons brand-logo">face</span>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><a href="sass.html">Sass</a></li>
          <li><a href="badges.html">组件</a></li>
          <li><a href="collapsible.html">JavaScript</a></li>
        </ul>
      </div>
    </nav>
  );
}