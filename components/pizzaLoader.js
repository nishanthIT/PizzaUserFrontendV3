import React, { useEffect, useState } from "react";

const PizzaLoader = ({ forceDuration = 0 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (forceDuration > 0) {
      const timer = setTimeout(() => setShow(false), forceDuration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [forceDuration]);

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <img
        src="/assets/pizza-loader.gif"
        alt="Loading..."
        style={styles.loader}
      />
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backdropFilter: "blur(8px)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  loader: {
    width: "120px",
    height: "auto",
  },
};

export default PizzaLoader;
