const PlayerCube = ({ x, y }) => {
    return (
      <div
        style={{
          position: "absolute",
          top: `${y}px`,
          left: `${x}px`,
          width: "40px",
          height: "40px",
          backgroundColor: "blue",
        }}
      ></div>
    );
  };
  
  export default PlayerCube;
  