const CollectibleCube = ({ x, y, number, onCollect }) => {
    const handleClick = () => {
      onCollect();
    };
  
    return (
      <div
        style={{
          position: "absolute",
          top: `${y}px`,
          left: `${x}px`,
          width: "40px",
          height: "40px",
          backgroundColor: "green",
          textAlign: "center",
          lineHeight: "40px",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        {number}
      </div>
    );
  };
  
  export default CollectibleCube;
  