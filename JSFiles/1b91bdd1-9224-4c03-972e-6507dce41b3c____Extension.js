import React from "react";
import PropType from "prop-types";
import "./Extension.scss";


const Extension = ({icon,browser,browserVersion,ctaText}) => {
    return (
        <li className="extension">
            <div className="extension__wrapper">
                <img className="extension__icon" src={icon} alt=""/>
                <h3 className="extension__browser">{browser}</h3>
                <p className="extension__browser-version">{browserVersion}</p>
                <a className="extension__cta" href="#">{ctaText}</a>
            </div>
        </li>
    );
}

Extension.prototype ={
    id: PropType.string.isRequired,
    icon: PropType.string.isRequired,
    browser: PropType.string.isRequired,
    varsion: PropType.string.isRequired,
    cta: PropType.string.isRequired,
}
 
Extension.defaultProps = {
    id:"",
    icons:"",
    browser:"",
    version: "",
    cta:"",
}

export default Extension;

