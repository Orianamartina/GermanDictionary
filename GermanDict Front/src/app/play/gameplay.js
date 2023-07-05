
//shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
//function to add color to each card
export function formatCards(color, cards){
    if(cards){
        
        if (color == "red"){
            cards.forEach(element => {
                    element.color = color
                });
            return cards
        }
        if (color == "yellow"){
            cards.forEach(element => {
                element.color = color

            })
            return cards
        }
        if (color == "green"){
            cards.forEach(element => {
                element.color = color
            }) 
            return cards
        }
        if (color == "white"){
            cards.forEach(element => {
                element.color = color
            })
            return cards
        }
    }
}
// Set card arrays to play
export function gameCardsFormatted(cards){
    const sessionId = cards.id
    const redCards = formatCards("red", cards.red_cards)
    const yellowCards = formatCards("yellow", cards.yellow_cards)
    const greenCards = formatCards("green", cards.green_cards)
    const unclassifiedCards = formatCards("white", cards.unclassified_cards)
    let array = unclassifiedCards.concat(redCards, redCards, redCards, yellowCards, yellowCards, greenCards)
    return ({array: array, id: sessionId})
}

export function cardQueue(cards){
    let cardsFormated = gameCardsFormatted(cards)
    const queue = shuffleArray(cardsFormated.array)
    const id = cardsFormated.id
    return {queue, id}
}
// Check answer and decide how to proceed with the word's score
export function checkCard(card, input, time){
    let points = 0
    let trans1 = card.translation1
    let trans2 = card.translation2
    let trans3 = card.translation3
    let fast = time <= 4
    let slow = time <= 10 && time > 4
    let wrong = time > 10
    let userInput = input.toLowerCase()
    if ((userInput == trans1 || userInput == trans2 || userInput == trans3) && fast){
        points = 1
    
    }
    if ((userInput == trans1 || userInput == trans2 || userInput == trans3) && slow){
        points = 0
     
    }
    if(userInput != trans1 && userInput != trans2 && userInput != trans3 || wrong){
        points = -1
        
    }
    return points
}

//function to format cards to save game session

export function endSession(cards){
    let databaseInfo = [{
        red_cards:[],
        yellow_cards:[],
        green_cards:[],
        unclassified_cards:[],
    }]
    let redCards = []
    let yellowCards = []
    cards.forEach(card => {
        
        if (card.color === "green"){
            if(card.points === -1 || card.points === 0){
                delete card.color
                delete card.points
                databaseInfo.yellow_cards.push(card)
            }else{
                delete card.color
                delete card.points
                databaseInfo.green_cards.push(card)
            }
        }
        if (card.color === "yellow"){
            let foundCard = yellowCards.find(processedCard => processedCard.word === card.word)
            if (foundCard){
                let points = foundCard.points + card.points
                if (points == 2){
                    delete card.color
                    delete card.points
                    databaseInfo.green_cards.push(card)
                }
                if (points == 1 || points == 0){
                    delete card.color
                    delete card.points
                    databaseInfo.yellow_cards.push(card)
                }
                if (points < 0){
                    delete card.color
                    delete card.points
                    databaseInfo.red_cards.push(card)
                }
            }
            else{
                yellowCards.push(card)
            }
        }
        if (card.color === "red"){
            let foundCard = redCards.filter(processedCard => processedCard.word === card.word)
            if (foundCard.length === 2){
                let points = foundCard[0].points + foundCard[1].points + card.points
                if(points == 3){
                    delete card.color
                    delete card.points
                    databaseInfo.yellow_cards.push(card)
                }
                if (points < 3){
                    delete card.color
                    delete card.points
                    databaseInfo.red_cards.push(card)
                }
                let foundCardIndex = redCards.findIndex(processedCard => processedCard.word === card.word);
                while (foundCardIndex !== -1) {
                    redCards.splice(foundCardIndex, 1);
                    foundCardIndex = redCards.findIndex(processedCard => processedCard.word === card.word);
                }
            }
            if (foundCard.length <2){
                redCards.push(card)
            }
            
        }
        if (card.color === "white"){
            
            if (points == 1){
                delete card.color
                delete card.points
                databaseInfo.green_cards.push(card)
            }
            if (points == 0){
                delete card.color
                delete card.points
                databaseInfo.yellow_cards.push(card)
            }
            else{
                delete card.color
                delete card.points
                databaseInfo.red_cards.push(card)
            }
        
        }
    })
    return databaseInfo
}