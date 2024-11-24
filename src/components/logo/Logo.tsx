import LogoImage from "../../assets/logo.jpg";
import "./logo.css"; // Import the CSS file

function Logo() {
  return (
    <div className="logo-container">
      <img src={LogoImage} alt="logo" className="logo-image" />
      <span className="logo-text">EcoSpace</span>
    </div>
  );
}

export default Logo;
