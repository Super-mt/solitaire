import { useState, useEffect } from "react";
import "./App.css";
import Cards from "./Components/Cards";
import Aces from "./Components/Aces";

const ranks = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
const suits = ["♥", "♣", "♠", "♦"];

const valueList = {
  A: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
};

const deck = [];
function allCard() {
  for (let i = 0; i < ranks.length; i++) {
    for (let j = 0; j < suits.length; j++) {
      deck.push({
        ranks: ranks[i],
        suits: suits[j],
        flipped: false,
        selected: false,
        valueList: valueList[ranks[i]],
      });
    }
  }
}

allCard();

const shuffleCards = (deck) => {
  deck.sort(() => Math.random() - 0.5);
};
shuffleCards(deck);

let dealtCard = [[], [], [], [], [], [], []];
for (let i = 0; i < 7; i++) {
  for (let j = 0; j <= i; j++) {
    const removed = deck.splice(0, 1);
    dealtCard[i].push(...removed);
  }
}

function App() {
  const [count, setCount] = useState(0);
  const [decks, setDecks] = useState([]);
  const [dealtCards, setDealtCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState(null);
  const [aces, setAces] = useState({
    diamond: [],
    heart: [],
    spade: [],
    club: [],
  });

  useEffect(() => {
    setDecks(() => {
      return deck.map((card) => {
        return { ...card, flipped: true };
      });
    });

    setDealtCards(() => {
      return dealtCard.map((card) => {
        const lastCard = card.at(-1);
        lastCard.flipped = true;
        return card;
      });
    });
  }, []);

  // run only after first render

  const handleDealt = (arrayIndex, cardIndex) => {
    const copyDealtCard = [...dealtCards];

    copyDealtCard[arrayIndex][cardIndex].selected = true;

    for (let i = 0; i < copyDealtCard.length; i++) {
      for (let j = 0; j < copyDealtCard[i].length; j++) {
        if (i !== arrayIndex || j !== cardIndex) {
          copyDealtCard[i][j].selected = false;
        }
      }
    }

    if (selectedCards) {
      if (selectedCards.handleDeck) {
        const firstdeckCard = decks[selectedCards.count];

        const seconddeckCard = copyDealtCard[arrayIndex][cardIndex];

        if (
          seconddeckCard.valueList === firstdeckCard.valueList + 1 &&
          (firstdeckCard.suits === "♥" || firstdeckCard.suits === "♦") &&
          (seconddeckCard.suits === "♠" || seconddeckCard.suits === "♣")
        ) {
          const deckCard = decks.splice(selectedCards.count, 1)[0];

          const copiedDeckCard = { ...deckCard };
          copyDealtCard[arrayIndex].push(copiedDeckCard);

          setSelectedCards(null);
          //reset to null
          return setDealtCards(copyDealtCard);
        }
        copyDealtCard[arrayIndex][
          copyDealtCard[arrayIndex].length - 1
        ].flipped = true;

        if (
          seconddeckCard.valueList === firstdeckCard.valueList + 1 &&
          (firstdeckCard.suits === "♠" || firstdeckCard.suits === "♣") &&
          (seconddeckCard.suits === "♥" || seconddeckCard.suits === "♦")
        ) {
          const deckCards = decks.splice(selectedCards.count, 1)[0];

          const copiedDecktwoCard = { ...deckCards };

          copyDealtCard[arrayIndex].push(copiedDecktwoCard);
          setSelectedCards(null);
          //reset to null

          return setDealtCards(copyDealtCard);
        }
      }
      //HANDLE DEALT LOGIC

      if (selectedCards.handleDealt) {
        const firstCard =
          copyDealtCard[selectedCards.arrayIndex][selectedCards.cardIndex];

        const secondCard = copyDealtCard[arrayIndex][cardIndex];

        if (
          (secondCard.valueList === firstCard.valueList + 1 &&
            (firstCard.suits === "♥" || firstCard.suits === "♦") &&
            (secondCard.suits === "♠" || secondCard.suits === "♣")) ||
          (secondCard.valueList === firstCard.valueList + 1 &&
            (firstCard.suits === "♠" || firstCard.suits === "♣") &&
            (secondCard.suits === "♥" || secondCard.suits === "♦"))
        ) {
          let cardsToMove = [
            copyDealtCard[selectedCards.arrayIndex][selectedCards.cardIndex],
          ];
          let flippedCount = 0;

          // check if there are other flipped cards in the column
          for (
            let i = selectedCards.cardIndex + 1;
            i < copyDealtCard[selectedCards.arrayIndex].length;
            i++
          ) {
            if (copyDealtCard[selectedCards.arrayIndex][i].flipped) {
              cardsToMove.push(copyDealtCard[selectedCards.arrayIndex][i]);
              flippedCount++;
            } else {
              break;
            }
          }

          if (flippedCount === cardsToMove.length - 1) {
            copyDealtCard[selectedCards.arrayIndex].splice(
              selectedCards.cardIndex,
              cardsToMove.length
            );
            copyDealtCard[arrayIndex].push(...cardsToMove);

            setSelectedCards(null);
            return setDealtCards(copyDealtCard);
          }
        }
        copyDealtCard[arrayIndex][
          copyDealtCard[arrayIndex].length - 1
        ].flipped = true;
      }
    }

    setSelectedCards({ cardIndex, arrayIndex, handleDealt: true });

    setDealtCards(copyDealtCard);
  };

  //placing a king on empty array
  const handleKing = (arrayIndex) => {
    const copyDealtCard = [...dealtCards];

    if (selectedCards) {
      if (selectedCards.handleDealt) {
        if (copyDealtCard[arrayIndex].length === 0) {
          if (
            copyDealtCard[selectedCards.arrayIndex][selectedCards.cardIndex]
              .ranks === "K"
          ) {
            const king = copyDealtCard[selectedCards.arrayIndex].splice(
              selectedCards.cardIndex,
              1
            )[0];

            copyDealtCard[arrayIndex].push(king);
            setSelectedCards(null);
            return setDealtCards(copyDealtCard);
          }
        }
      }

      //deck card moved to empty array - K
      const copyDeck = [...decks];

      if (selectedCards.handleDeck) {
        if (copyDealtCard[arrayIndex].length === 0) {
          if (copyDeck[selectedCards.count].ranks === "K") {
            const king = copyDeck.splice(selectedCards.count, 1)[0];

            copyDealtCard[arrayIndex].push(king);
            setSelectedCards(null);
            setDecks(copyDeck);
            return setDealtCards(copyDealtCard);
          }
        }
      }
    }
  };

  const handleAce = (suit) => {
    // suit will either be heart, diamond, club or spade

    const copyDealtCard = [...dealtCards];
    const copyDeck = [...decks];

    if (selectedCards) {
      if (selectedCards?.handleDealt) {
        if (
          aces[suit].length === 0 &&
          copyDealtCard[selectedCards.arrayIndex][selectedCards.cardIndex]
            .ranks === "A"
        ) {
          const ace = copyDealtCard[selectedCards.arrayIndex].splice(
            selectedCards.cardIndex,
            1
          )[0];

          //flipping last card in the array, once card moved

          setSelectedCards(null);
          setAces((prev) => {
            return { ...prev, [suit]: [ace] };
          });
          return setDealtCards(copyDealtCard);
        }
        //deck cards selected for A

        //if statement aces logic

        if (aces[suit].length > 0) {
          const lastAce = aces[suit].slice(-1)[0];

          const secondCard =
            copyDealtCard[selectedCards.arrayIndex][selectedCards.cardIndex];

          if (
            secondCard.valueList === lastAce.valueList + 1 &&
            lastAce.suits === secondCard.suits
          ) {
            const ace = copyDealtCard[selectedCards.arrayIndex].splice(
              selectedCards.cardIndex,
              1
            )[0];

            const yellowCardsCopy = [...aces[suit]];
            yellowCardsCopy.push(ace);

            setSelectedCards(null);
            setAces((prev) => {
              return { ...prev, [suit]: [ace] };
            });

            return setDealtCards(copyDealtCard);
          }
        }
      } else if (selectedCards.handleDeck) {
        if (
          aces[suit].length === 0 &&
          copyDeck.at(selectedCards.count).ranks === "A"
        ) {
          const ace = copyDeck.splice(selectedCards.count, 1)[0];

          setAces((prev) => {
            return { ...prev, [suit]: [ace] };
          });
          setSelectedCards(null);
          return setDecks(copyDeck);
        }
        if (aces[suit].length > 0) {
          const lastAce = aces[suit].slice(-1)[0];

          const secondCard = copyDeck[selectedCards.count];

          if (
            secondCard.valueList === lastAce.valueList + 1 &&
            lastAce.suits === secondCard.suits
          ) {
            const ace = copyDeck.splice(selectedCards.count, 1)[0];

            const yellowCardsCopy = [...aces[suit]];
            yellowCardsCopy.push(ace);

            setAces((prev) => {
              return { ...prev, [suit]: [ace] };
            });
            setSelectedCards(null);
            setDecks(copyDeck);
            return setDealtCards(copyDealtCard);
          }
        }
      }
    }
  };

  const handleDeck = () => {
    const copyDeck = [...decks];
    copyDeck[count].selected = true;

    setSelectedCards({ count, handleDeck: true });
  };

  const handleClick = () => {
    // deck.length in relation to count
    if (count < deck.length - 1) {
      return setCount(count + 1);
    } else {
      return setCount(-1);
    }
  };

  // deck.length === the number of cards in the deck
  // count === incrementing by one and used to show the current card in the deck
  // when i reach the end of the deck.length
  // reset the count
  // start iterating over the deck from the start
  // We need to show the the card deck has reset

  // a few conditions, based on the conditions we do something

  return (
    <div className="App">
      <div className="pickCard">
        <div className="initialCard" onClick={handleClick}>
          click me
        </div>
        <div>
          {count === -1 ? null : (
            <Cards
              onClick={handleDeck}
              ranks={decks[count]?.ranks}
              suits={decks[count]?.suits}
              flipped={decks[count]?.flipped}
              selected={decks[count]?.selected}
            ></Cards>
          )}
        </div>
        <div className="aces">
          <Aces aces={aces.diamond} suit="diamond" onClick={handleAce}></Aces>
          <Aces aces={aces.heart} suit="heart" onClick={handleAce}></Aces>
          <Aces aces={aces.club} suit="club" onClick={handleAce}></Aces>
          <Aces aces={aces.spade} suit="spade" onClick={handleAce}></Aces>
        </div>
      </div>
      <div className="dealtCards">
        {dealtCards?.map((subArray, index) => {
          return subArray.length === 0 ? (
            <div
              style={{
                width: 100,
                height: 200,
                margin: 30,
                backgroundColor: "red",
              }}
              onClick={() => {
                handleKing(index);
              }}
            ></div>
          ) : (
            <div className="Cards">
              {subArray.map((dealtCards, cardIndex) => (
                <Cards
                  index={index}
                  cardIndex={cardIndex}
                  ranks={dealtCards.ranks}
                  suits={dealtCards.suits}
                  flipped={dealtCards.flipped}
                  selected={dealtCards.selected}
                  onClick={handleDealt}
                  style={{ zIndex: cardIndex }}
                ></Cards>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default App;
