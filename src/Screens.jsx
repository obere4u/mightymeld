import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <div className="py-[5em] pb-[3em] rounded-2xl mx-auto  flex flex-col items-center space-y-8 max-w-[400px] w-[95%] bg-pink-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <p className="font-bold text-pink-700 text-6xl">Memory</p>
      <p className="text-pink-600 tracking-widest text-sm md:text-lg font-semibold ">
        Flip over tiles looking for pairs
      </p>
      <div className="pt-12">
        <button
          onClick={start}
          className="mt-auto bg-gradient-to-b from-pink-700 to-pink-800 rounded-full px-3 text-white py-3 w-[8em] shadow-lg text-2xl tracking-wider font-semibold active:bg-pink-900"
        >
          Play
        </button>
      </div>
    </div>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <div className="w-[95%] mx-auto ">
      <p className="text-center text-indigo-500 text-2xl font-semibold tracking-tight my-16">
        Tries{" "}
        <span className="ml-2 px-4 rounded-md bg-indigo-100 text-indigo-500 text-xl">
          {tryCount}
        </span>
      </p>
      <div className="flex mx-auto max-w-[400px]    p-4 bg-indigo-100">
        <div className="grid grid-cols-4 auto-rows-fr gap-2 mx-auto">
          {getTiles(16).map((tile, i) => (
            <Tile
              key={i}
              flip={() => flip(i)}
              {...tile}
              className="indigo"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
