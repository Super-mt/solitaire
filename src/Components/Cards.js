import { Card } from "@mui/material";
import "../App.css";
import "../App.js";

function Cards({
  ranks,
  key,
  suits,
  flipped,
  onClick,
  index,
  cardIndex,
  selected,
}) {
  return (
    <>
      <Card
        className="Cards"
        key={key}
        style={{
          width: 100,
          height: 200,
          margin: 30,
          color: suits === "♥" || suits === "♦" ? "red" : "black",
          backgroundColor: selected === true ? "lightblue" : "white",
          flex: 0.3,
          top: `${cardIndex * -210}px`,
          border: "red 4px solid",
        }}
        onClick={() => onClick(index, cardIndex)}
      >
        {flipped ? (
          <div>
            {ranks} {suits}
          </div>
        ) : null}
      </Card>
    </>
  );
}
export default Cards;
