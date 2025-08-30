import LogoImage from "../../assets/logo.png";
import "./logo.css"; // Import the CSS file

function Logo() {
  return (
    <div className="logo-container">
      <img src={LogoImage} alt="logo" className="logo-image" />
      <span className="logo-text">localmart</span>
    </div>
  );
}

export default Logo;
