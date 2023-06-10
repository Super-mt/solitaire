import "../App.css";
import "../App.js";

function Aces({ aces, suit, onClick }) {
  const acesLastCard = aces.at(-1);

  return (
    // need to check lenght of ace, if 0 show yellow background
    // if not change it

    aces.length === 0 ? (
      <div
        style={{
          width: 100,
          height: 200,
          margin: 30,
          flex: 0.3,
          backgroundColor: "yellow",
        }}
        onClick={() => onClick(suit)}
      ></div>
    ) : (
      <div>
        <div
          style={{
            width: 100,
            height: 200,
            margin: 30,
            backgroundColor: "white",
            color:
              acesLastCard?.suits === "♥" || acesLastCard?.suits === "♦"
                ? "red"
                : "black",
          }}
          onClick={() => onClick(suit)}
        >
          {acesLastCard?.ranks}
          {acesLastCard?.suits}
        </div>
      </div>
    )
  );
}
export default Aces;
