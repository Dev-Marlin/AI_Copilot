import React, { useState, useEffect } from "react";
import PlayerCube from "./components/PlayerCube";
import CollectibleCube from "./components/CollectibleCube";

const App = () => {
  const [player, setPlayer] = useState({
    x: 100,
    y: 100,
    number: Math.floor(Math.random() * 21) - 10, // random number between -10 and 10
  });

  const generateCubes = () => {
    const cubes = [];
    for (let i = 0; i < 5; i++) {
      const isNegative = Math.random() < 0.5; // Half of the cubes are negative
      cubes.push({
        x: Math.floor(Math.random() * 400),
        y: Math.floor(Math.random() * 400),
        number: isNegative ? Math.floor(Math.random() * 10) - 10 : Math.floor(Math.random() * 11),
      });
    }
    return cubes;
  };

  const getRandomTimeLimit = () => {
    return Math.floor(Math.random() * 11) + 15; // Random time between 15 and 25
  };

  const resetRound = () => {
    setPlayer({
      x: 100,
      y: 100,
      number: Math.floor(Math.random() * 21) - 10,
    });
    setCollectibles(generateCubes());
    setTimeLeft(getRandomTimeLimit());
  };

  const [collectibles, setCollectibles] = useState(generateCubes());
  const [timeLeft, setTimeLeft] = useState(getRandomTimeLimit());
  const [gameOver, setGameOver] = useState(false);
  const [points, setPoints] = useState(0); // Points for the player
  const [lives, setLives] = useState(3); // Player lives

  useEffect(() => {
    if (player.number === 0) {
      // If the player's number becomes 0, award points and reset the round
      setPoints((prevPoints) => prevPoints + 5); // Award points
      resetRound(); // Reset the round immediately
    }
  }, [player.number]); // This effect runs every time player.number changes
  

  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time is over, player loses a life
          if (lives > 1) {
            setLives(prevLives => prevLives - 1);
            resetRound(); // Reset the round but decrement lives
          } else {
            setGameOver(true); // Game Over when no lives remain
            clearInterval(timer);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, timeLeft, lives]);
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;
  
      const newPlayer = { ...player };
  
      // Adjust player position based on key press, but keep it within bounds
      if (e.key === "ArrowUp") newPlayer.y = Math.max(0, newPlayer.y - 10); // Prevent going above the box
      if (e.key === "ArrowDown") newPlayer.y = Math.min(490, newPlayer.y + 10); // Prevent going below the box (490 to keep the player inside 500px)
      if (e.key === "ArrowLeft") newPlayer.x = Math.max(0, newPlayer.x - 10); // Prevent going left
      if (e.key === "ArrowRight") newPlayer.x = Math.min(490, newPlayer.x + 10); // Prevent going right (490 to keep the player inside 500px)
  
      setPlayer(newPlayer);
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [player, gameOver]);

  const resetGame = () => {
    setPlayer({
      x: 100,
      y: 100,
      number: Math.floor(Math.random() * 21) - 10,
    });
    setCollectibles(generateCubes());
    setTimeLeft(getRandomTimeLimit());
    setPoints(0);
    setLives(3);
    setGameOver(false);
  };

  const handleCollectCube = (collectible) => {
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      number: prevPlayer.number + collectible.number,
    }));

    // Remove the collected cube
    setCollectibles((prevCollectibles) =>
      prevCollectibles.filter(cube => cube !== collectible)
    );
      
    // Spawn a new collectible
    setCollectibles(prevCollectibles => [
      ...prevCollectibles,
      generateNewCube()
    ]);
    
    // If player's number is zero, award points and reset round
    /*if (player.number === 0) {
      setPoints((prevPoints) => prevPoints + 5);
      resetRound();
    }*/
  };

  const generateNewCube = () => {
    const isNegative = Math.random() < 0.5; // Randomly negative or positive
    return {
      x: Math.floor(Math.random() * 400),
      y: Math.floor(Math.random() * 400),
      number: isNegative ? Math.floor(Math.random() * 10) - 10 : Math.floor(Math.random() * 11),
    };
  };


  const checkCollision = (player, collectible) => {
    const distance = Math.sqrt(
      Math.pow(collectible.x - player.x, 2) + Math.pow(collectible.y - player.y, 2)
    );
    return distance < 40; // If the distance is less than a threshold, consider it a collision
  };

  const handlePlayerMovement = () => {
    return collectibles.map((collectible) => {
      if (checkCollision(player, collectible)) {
        handleCollectCube(collectible);
      }
      return collectible;
    });
  };

  return (
    <div>
      <h1>Number Collector Game</h1>
      <h2>Time Left: {timeLeft}s</h2>
      <h3>Player Number: {player.number}</h3>
      <h4>Points: {points}</h4>
      <h4>Lives: {lives}</h4>
      <div style={{ position: "relative", height: "500px", width: "500px", border: "2px solid black" }}>
        <PlayerCube x={player.x} y={player.y} />
        {handlePlayerMovement().map((collectible, index) => (
          <CollectibleCube
            key={index}
            x={collectible.x}
            y={collectible.y}
            number={collectible.number}
          />
        ))}
      </div>
      {gameOver && <div>Game Over! Try Again!</div>}
    </div>
  );
};

export default App;
