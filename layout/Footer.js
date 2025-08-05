import Link from "next/link";

const Footer = ({ footer = 3 }) => {
  switch (footer) {
    case 1:
      return <DefaultFooter />;
    case 2:
      return <Footer2 />;
    case 3:
      return <Footer3 />;
    case 5:
      return <Footer5 />;
    case 6:
      return <Footer6 />;
    default:
      return <DefaultFooter />;
  }
};
export default Footer;


const Footer3 = () => {
  const openingHours = JSON.parse(process.env.NEXT_PUBLIC_OPENING_HOURS || '[]');
  
  return (
    <footer
      className="main-footer footer-two bgc-black pt-120 rpt-90 rel z-1"
      style={{ backgroundImage: "url(assets/images/background/footer-bg.png)" }}
    >
      <div className="widget-area pb-70">
        <div className="container">
          <div className="row justify-content-between">
            <div
              className="col-xl-3 col-lg-4 col-sm-6"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-text">
                <div className="footer-title">
                  <h5>Location</h5>
                </div>
                <p>
                  {process.env.NEXT_PUBLIC_SHOP_ADDRESS}
                </p>
              </div>
            </div>
            <div
              className="col-xl-2 col-lg-3 col-sm-6"
              data-aos="fade-up"
              data-aos-delay={50}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-contact">
                <div className="footer-title">
                  <h5>contact us</h5>
                </div>
                <ul>
                  <li>
                    <a href="mailto:wellfood@gmail.com">
                      <u>{process.env.NEXT_PUBLIC_SHOP_EMAIL}</u>
                    </a>
                  </li>
                  <li>
                    <div><a href="callto:+(44){process.env.NEXT_PUBLIC_SHOP_MOBILE}">{process.env.NEXT_PUBLIC_SHOP_MOBILE}</a></div>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-sm-6"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget opening-hour">
                <div className="footer-title">
                  <h5>opening hour</h5>
                </div>
                <ul>
                  {openingHours.map((item, index) => (
                    <li key={index}>
                      {item.days}: <span>{item.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom pt-30 pb-15">
        <div className="container rel text-center">
          <ul className="footer-bottom-nav">
            <li>
              <Link href="/">Slice </Link>
            </li>
            <li>
            <Link href="/">Smile</Link>
            </li>
            <li>
              <Link href="/">Repeat!</Link>
            </li>
          </ul>
          
          <button className="scroll-top scroll-to-target" data-target="html">
            <i className="fas fa-arrow-alt-up" />
          </button>
        </div>
        <hr className="mt-25 mb-30" />
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="copyright-text text-center text-lg-start">
                <p>
                  Copyright 2024 <Link href="/">N1sh</Link>. All Rights
                  Reserved{" "}
                </p>
              </div>
            </div>
            <div className="col-lg-7 text-center text-lg-end">
              <ul className="footer-bottom-nav">
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms &amp; Condition</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};