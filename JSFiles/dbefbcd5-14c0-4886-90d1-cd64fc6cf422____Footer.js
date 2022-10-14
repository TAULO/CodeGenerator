import React, { useState } from "react";

function Footer() {
  const year = new Date().getFullYear();

  const [shopAndLearnActive, setShopAndLearnActive] = useState(false);
  const [servicesActive, setServicesActive] = useState(false);
  const [accountActive, setAccountActive] = useState(false);
  const [appleStoreActive, setAppleStoreActive] = useState(false);
  const [forBusinessActive, setForBusinessActive] = useState(false);
  const [forEducationActive, setForEducationActive] = useState(false);
  const [forHealthcareActive, setForHealthcareActive] = useState(false);
  const [forGovernmentActive, setForGovernmentActive] = useState(false);
  const [appleValuesActive, setAppleValuesActive] = useState(false);
  const [aboutAppleActive, setAboutAppleActive] = useState(false);
  return (
    <section>
      <footer className="footer">
        <div className="initial-text">
          <p className="text-small">1. Apple Fitness+ is coming late 2020.</p>
          <p className="text-small">
            2. $9.99/month after free trial. No commitment. Plan automatically
            renews after trial until cancelled.
          </p>
          <p className="text-small">
            Apple TV+ is $4.99/month after free trial. One subscription per
            Family Sharing group. Offer good for 3 months after eligible device
            activation. Plan automatically renews until cancelled. Restrictions
            and other{" "}
            <span className="footer-title-mobile footer-link footer-legal">
              terms
            </span>{" "}
            apply.
          </p>
          <div className="br"></div>
        </div>
        <div className="footer-links">
          <div className="footer-columnn">
            <h4 className="footer-title unselectable-text">Shop and Learn</h4>
            <div className="footer-text-box">
              <p className="text-small footer-link">Mac</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">iPad</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">iPhone</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Watch</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">TV</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Music</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">AirPods</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">HomePod</p>
            </div>
            <p className="text-small footer-link">iPod Touch</p>

            <div className="footer-text-box">
              <p className="text-small footer-link">Accessories</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Gift Cards</p>
            </div>
          </div>
          <div className="footer-columnn">
            <h4 className="footer-title unselectable-text">Services</h4>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Music</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple TV+</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Fitness+</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple News+</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Arcade</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">iCloud</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple One</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Card</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Books</p>
            </div>

            <h4 className="footer-title u-margin-top-sm unselectable-text">
              Account
            </h4>

            <div className="footer-text-box">
              <p className="text-small footer-link">Manage Your Apple ID</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Store Account</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">iCloud.com</p>
            </div>
          </div>

          <div className="footer-columnn">
            <h4 className="footer-title unselectable-text">Apple Store</h4>
            <div className="footer-text-box">
              <p className="text-small footer-link">Find a Store</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Shop Online</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Genius Bar</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Today at Apple</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Camp</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Store App</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">
                Refurbished and Clearence
              </p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Financing</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Trade In</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Order Status</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Shopping Help</p>
            </div>
          </div>
          <div className="footer-columnn">
            <h4 className="footer-title unselectable-text">For Business</h4>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple and Business</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Shop for Business</p>
            </div>

            <h4 className="footer-title u-margin-top-sm unselectable-text">
              For Education
            </h4>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple and Education</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Shop for K-12</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Shop for College</p>
            </div>

            <h4 className="footer-title u-margin-top-sm unselectable-text">
              For Healthcare
            </h4>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple in Healthcare</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Health on Apple Watch</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Health Records on iPhone</p>
            </div>

            <h4 className="footer-title u-margin-top-sm unselectable-text">
              For Government
            </h4>
            <div className="footer-text-box">
              <p className="text-small footer-link">Shop for Government</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">
                Shop for Veterans and Military
              </p>
            </div>
          </div>
          <div className="footer-columnn">
            <h4 className="footer-title unselectable-text">Apple Values</h4>
            <div className="footer-text-box">
              <p className="text-small footer-link">Accessibility</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Education</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Enviroment</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Inclusion and Diversity</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Privacy</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Supplier Responsability</p>
            </div>

            <h4 className="footer-title u-margin-top-sm unselectable-text">
              About Apple
            </h4>
            <div className="footer-text-box">
              <p className="text-small footer-link">Newsroom</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Leadership</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Job Opportunities</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Investors</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Events</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Contact Apple</p>
            </div>
          </div>
        </div>
        <p className="text-small">
          More ways to shop: <span className="link">Find an Apple Store</span>{" "}
          or <span className="link">other retailer</span> near you. Or call
          1-800-MY-APPLE.
        </p>
        <div className="br br-margin-sm"></div>
        <div className="lower-footer">
          <p className="text-small u-margin-right-md">
            Copyright © {year} Apple Inc. All rights reserved.
          </p>
          <p className="text-small footer-link">Privacy Policy</p>
          <div className="separator"></div>
          <p className="text-small footer-link">Terms of Use</p>
          <div className="separator"></div>
          <p className="text-small footer-link">Sales and Refunds</p>
          <div className="separator"></div>
          <p className="text-small footer-link">Legal</p>
          <div className="separator"></div>
          <p className="text-small footer-link">Site Map</p>
          <p className="footer-link footer-country">United States</p>
        </div>
      </footer>
      <footer className="footer-mobile">
        <div className="initial-text">
          <p className="text-small">1. Apple Fitness+ is coming late 2020.</p>
          <p className="text-small">
            2. $9.99/month after free trial. No commitment. Plan automatically
            renews after trial until cancelled.
          </p>
          <p className="text-small">
            Apple TV+ is $4.99/month after free trial. One subscription per
            Family Sharing group. Offer good for 3 months after eligible device
            activation. Plan automatically renews until cancelled. Restrictions
            and other{" "}
            <span className="footer-title-mobile footer-link footer-legal">
              terms
            </span>{" "}
            apply.
          </p>
          <div className="br u-margin-bottom-md"></div>
        </div>
        <div className="links-section-mobile">
          <div
            className="clickable-section"
            id="shopAndLearnClickable"
            onClick={() => {
              const plus = document.getElementById("shopAndLearnPlus");
              const extension = document.getElementById(
                "shopAndLearnExtension"
              );
              const clickable = document.getElementById(
                "shopAndLearnClickable"
              );

              if (!shopAndLearnActive) {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(45deg)";
                extension.style.display = "block";

                setTimeout(() => {
                  extension.style.transform = "translateY(0)";
                  extension.style.opacity = "1";
                }, 5);
                setShopAndLearnActive(true);
              } else {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(0deg)";
                extension.style.transform = "translateY(-4rem)";
                extension.style.display = "none";
                extension.style.opacity = "0";
                setShopAndLearnActive(false);
              }
            }}
          >
            <div className="link-section-mobile">
              <h4 className="footer-title-mobile unselectable-text">
                Shop and Learn
              </h4>
              <i className="fas fa-plus plus-icon" id="shopAndLearnPlus"></i>
            </div>
          </div>
          <div className="link-section-extended" id="shopAndLearnExtension">
            <div className="footer-text-box">
              <p className="text-small footer-link">Mac</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">iPad</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">iPhone</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Watch</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">TV</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Music</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">AirPods</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">HomePod</p>
            </div>
            <p className="text-small footer-link">iPod Touch</p>

            <div className="footer-text-box">
              <p className="text-small footer-link">Accessories</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Gift Cards</p>
            </div>
          </div>

          <div
            className="clickable-section"
            id="servicesClickable"
            onClick={() => {
              const plus = document.getElementById("servicesPlus");
              const extension = document.getElementById("servicesExtension");
              const clickable = document.getElementById("servicesClickable");

              if (!servicesActive) {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(45deg)";
                extension.style.display = "block";

                setTimeout(() => {
                  extension.style.transform = "translateY(0)";
                  extension.style.opacity = "1";
                }, 5);
                setServicesActive(true);
              } else {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(0deg)";
                extension.style.transform = "translateY(-4rem)";
                extension.style.display = "none";
                extension.style.opacity = "0";
                setServicesActive(false);
              }
            }}
          >
            <div className="br br-link-mobile" id="shopAndLearnBr"></div>
            <div className="link-section-mobile">
              <h4 className="footer-title-mobile unselectable-text">
                Services
              </h4>
              <i className="fas fa-plus plus-icon" id="servicesPlus"></i>
            </div>
          </div>
          <div className="link-section-extended" id="servicesExtension">
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Music</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple TV+</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Fitness+</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple News+</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Arcade</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">iCloud</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple One</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Card</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Books</p>
            </div>
          </div>
          <div className="br br-link-mobile" id="shopAndLearnBr"></div>

          <div
            className="clickable-section"
            id="accountClickable"
            onClick={() => {
              const plus = document.getElementById("accountPlus");
              const extension = document.getElementById("accountExtension");
              const clickable = document.getElementById("accountClickable");

              if (!accountActive) {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(45deg)";
                extension.style.display = "block";

                setTimeout(() => {
                  extension.style.transform = "translateY(0)";
                  extension.style.opacity = "1";
                }, 5);
                setAccountActive(true);
              } else {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(0deg)";
                extension.style.transform = "translateY(-4rem)";
                extension.style.display = "none";
                extension.style.opacity = "0";
                setAccountActive(false);
              }
            }}
          >
            <div className="link-section-mobile">
              <h4 className="footer-title-mobile unselectable-text">Account</h4>
              <i className="fas fa-plus plus-icon" id="accountPlus"></i>
            </div>
          </div>
          <div className="link-section-extended" id="accountExtension">
            <div className="footer-text-box">
              <p className="text-small footer-link">Manage Your Apple ID</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Store Account</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">iCloud.com</p>
            </div>
          </div>
          <div className="br br-link-mobile" id="shopAndLearnBr"></div>

          <div
            className="clickable-section"
            id="appleStoreClickable"
            onClick={() => {
              const plus = document.getElementById("appleStorePlus");
              const extension = document.getElementById("appleStoreExtension");
              const clickable = document.getElementById("appleStoreClickable");

              if (!appleStoreActive) {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(45deg)";
                extension.style.display = "block";

                setTimeout(() => {
                  extension.style.transform = "translateY(0)";
                  extension.style.opacity = "1";
                }, 5);
                setAppleStoreActive(true);
              } else {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(0deg)";
                extension.style.transform = "translateY(-4rem)";
                extension.style.display = "none";
                extension.style.opacity = "0";
                setAppleStoreActive(false);
              }
            }}
          >
            <div className="link-section-mobile">
              <h4 className="footer-title-mobile unselectable-text">
                Apple Store
              </h4>
              <i className="fas fa-plus plus-icon" id="appleStorePlus"></i>
            </div>
          </div>
          <div className="link-section-extended" id="appleStoreExtension">
            <div className="footer-text-box">
              <p className="text-small footer-link">Find a Store</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Shop Online</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Genius Bar</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Today at Apple</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Camp</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Store App</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">
                Refurbished and Clearence
              </p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Financing</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Trade In</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Order Status</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Shopping Help</p>
            </div>
          </div>
          <div className="br br-link-mobile" id="shopAndLearnBr"></div>

          <div
            className="clickable-section"
            id="forBusinessClickable"
            onClick={() => {
              const plus = document.getElementById("forBusinessPlus");
              const extension = document.getElementById("forBusinessExtension");
              const clickable = document.getElementById("forBusinessClickable");

              if (!forBusinessActive) {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(45deg)";
                extension.style.display = "block";

                setTimeout(() => {
                  extension.style.transform = "translateY(0)";
                  extension.style.opacity = "1";
                }, 5);
                setForBusinessActive(true);
              } else {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(0deg)";
                extension.style.transform = "translateY(-4rem)";
                extension.style.display = "none";
                extension.style.opacity = "0";
                setForBusinessActive(false);
              }
            }}
          >
            <div className="link-section-mobile">
              <h4 className="footer-title-mobile unselectable-text">
                For Business
              </h4>
              <i className="fas fa-plus plus-icon" id="forBusinessPlus"></i>
            </div>
          </div>
          <div className="link-section-extended" id="forBusinessExtension">
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple and Business</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Shop for Business</p>
            </div>
          </div>
          <div className="br br-link-mobile" id="shopAndLearnBr"></div>

          <div
            className="clickable-section"
            id="forEducationClickable"
            onClick={() => {
              const plus = document.getElementById("forEducationPlus");
              const extension = document.getElementById(
                "forEducationExtension"
              );
              const clickable = document.getElementById(
                "forEducationClickable"
              );

              if (!forEducationActive) {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(45deg)";
                extension.style.display = "block";

                setTimeout(() => {
                  extension.style.transform = "translateY(0)";
                  extension.style.opacity = "1";
                }, 5);
                setForEducationActive(true);
              } else {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(0deg)";
                extension.style.transform = "translateY(-4rem)";
                extension.style.display = "none";
                extension.style.opacity = "0";
                setForEducationActive(false);
              }
            }}
          >
            <div className="link-section-mobile">
              <h4 className="footer-title-mobile unselectable-text">
                For Education
              </h4>
              <i className="fas fa-plus plus-icon" id="forEducationPlus"></i>
            </div>
          </div>
          <div className="link-section-extended" id="forEducationExtension">
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple and Education</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Shop for K-12</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Shop for College</p>
            </div>
          </div>
          <div className="br br-link-mobile" id="shopAndLearnBr"></div>

          <div
            className="clickable-section"
            id="forHealthcareClickable"
            onClick={() => {
              const plus = document.getElementById("forHealthcarePlus");
              const extension = document.getElementById(
                "forHealthcareExtension"
              );
              const clickable = document.getElementById(
                "forHealthcareClickable"
              );

              if (!forHealthcareActive) {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(45deg)";
                extension.style.display = "block";

                setTimeout(() => {
                  extension.style.transform = "translateY(0)";
                  extension.style.opacity = "1";
                }, 5);
                setForHealthcareActive(true);
              } else {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(0deg)";
                extension.style.transform = "translateY(-4rem)";
                extension.style.display = "none";
                extension.style.opacity = "0";
                setForHealthcareActive(false);
              }
            }}
          >
            <div className="link-section-mobile">
              <h4 className="footer-title-mobile unselectable-text">
                For Healthcare
              </h4>
              <i className="fas fa-plus plus-icon" id="forHealthcarePlus"></i>
            </div>
          </div>
          <div className="link-section-extended" id="forHealthcareExtension">
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple in Healthcare</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Health on Apple Watch</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Health Records on iPhone</p>
            </div>
          </div>
          <div className="br br-link-mobile" id="shopAndLearnBr"></div>

          <div
            className="clickable-section"
            id="forGovernmentClickable"
            onClick={() => {
              const plus = document.getElementById("forGovernmentPlus");
              const extension = document.getElementById(
                "forGovernmentExtension"
              );
              const clickable = document.getElementById(
                "forGovernmentClickable"
              );

              if (!forGovernmentActive) {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(45deg)";
                extension.style.display = "block";

                setTimeout(() => {
                  extension.style.transform = "translateY(0)";
                  extension.style.opacity = "1";
                }, 5);
                setForGovernmentActive(true);
              } else {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(0deg)";
                extension.style.transform = "translateY(-4rem)";
                extension.style.display = "none";
                extension.style.opacity = "0";
                setForGovernmentActive(false);
              }
            }}
          >
            <div className="link-section-mobile">
              <h4 className="footer-title-mobile unselectable-text">
                For Government
              </h4>
              <i className="fas fa-plus plus-icon" id="forGovernmentPlus"></i>
            </div>
          </div>
          <div className="link-section-extended" id="forGovernmentExtension">
            <div className="footer-text-box">
              <p className="text-small footer-link">Shop for Government</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">
                Shop for Veterans and Military
              </p>
            </div>
          </div>
          <div className="br br-link-mobile" id="shopAndLearnBr"></div>

          <div
            className="clickable-section"
            id="appleValuesClickable"
            onClick={() => {
              const plus = document.getElementById("appleValuesPlus");
              const extension = document.getElementById("appleValuesExtension");
              const clickable = document.getElementById("appleValuesClickable");

              if (!appleValuesActive) {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(45deg)";
                extension.style.display = "block";

                setTimeout(() => {
                  extension.style.transform = "translateY(0)";
                  extension.style.opacity = "1";
                }, 5);
                setAppleValuesActive(true);
              } else {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(0deg)";
                extension.style.transform = "translateY(-4rem)";
                extension.style.display = "none";
                extension.style.opacity = "0";
                setAppleValuesActive(false);
              }
            }}
          >
            <div className="link-section-mobile">
              <h4 className="footer-title-mobile unselectable-text">
                Apple Values
              </h4>
              <i className="fas fa-plus plus-icon" id="appleValuesPlus"></i>
            </div>
          </div>
          <div className="link-section-extended" id="appleValuesExtension">
            <div className="footer-text-box">
              <p className="text-small footer-link">Accessibility</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Education</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Enviroment</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Inclusion and Diversity</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Privacy</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Supplier Responsability</p>
            </div>
          </div>
          <div className="br br-link-mobile" id="shopAndLearnBr"></div>

          <div
            className="clickable-section"
            id="aboutAppleClickable"
            onClick={() => {
              const plus = document.getElementById("aboutApplePlus");
              const extension = document.getElementById("aboutAppleExtension");
              const clickable = document.getElementById("aboutAppleClickable");

              if (!aboutAppleActive) {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(45deg)";
                extension.style.display = "block";

                setTimeout(() => {
                  extension.style.transform = "translateY(0)";
                  extension.style.opacity = "1";
                }, 5);
                setAboutAppleActive(true);
              } else {
                clickable.style.backgroundColor = "rgba(0,113,227, 0.2)";
                setTimeout(() => {
                  clickable.style.backgroundColor = "transparent";
                }, 150);
                plus.style.transform = "rotate(0deg)";
                extension.style.transform = "translateY(-4rem)";
                extension.style.display = "none";
                extension.style.opacity = "0";
                setAboutAppleActive(false);
              }
            }}
          >
            <div className="link-section-mobile">
              <h4 className="footer-title-mobile unselectable-text">
                About Apple
              </h4>
              <i className="fas fa-plus plus-icon" id="aboutApplePlus"></i>
            </div>
          </div>
          <div className="link-section-extended" id="aboutAppleExtension">
            <div className="footer-text-box">
              <p className="text-small footer-link">Newsroom</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Apple Leadership</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Job Opportunities</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Investors</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Events</p>
            </div>
            <div className="footer-text-box">
              <p className="text-small footer-link">Contact Apple</p>
            </div>
          </div>
          <div className="br br-link-mobile" id="shopAndLearnBr"></div>
        </div>
        <p className="text-small u-margin-top-sm">
          More ways to shop: <span className="link">Find an Apple Store</span>{" "}
          or <span className="link">other retailer</span> near you. Or call
          1-800-MY-APPLE.
        </p>
        <p className="footer-title-mobile footer-link footer-country-mobile">
          United States
        </p>
        <p className="text-small">
          Copyright © {year} Apple Inc. All rights reserved.
        </p>
        <div className="lower-footer">
          <p className="text-small footer-link footer-legal">Privacy Policy</p>
          <div className="separator"></div>
          <p className="text-small footer-link footer-legal">Terms of Use</p>
          <div className="separator"></div>
          <p className="text-small footer-link footer-legal">
            Sales and Refunds
          </p>
          <div className="separator"></div>
          <p className="text-small footer-link footer-legal">Legal</p>
          <div className="separator"></div>
          <p className="text-small footer-link footer-legal">Site Map</p>
        </div>
      </footer>
    </section>
  );
}

export default Footer;
