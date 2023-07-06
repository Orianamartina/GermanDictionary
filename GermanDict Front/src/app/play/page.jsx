"use client"
import Cards from "./cards"
import {useDispatch, useSelector} from "react-redux";
import {useState } from "react";
import {  checkCard, endSession} from "./gameplay";
import { redirect } from 'next/navigation';
import axios from "axios";
import { useRouter } from 'next/router';


export default function Play(){
    const cards = useSelector(state => state.gameSession)
    const id = useSelector(state => state.sessionId)

    const [cardsPlayed, setCardsPlayed] = useState([])
    const [index, setIndex] = useState(0)
    const [finished, setFinished] = useState(false)
    const [translation, setTranslation] = useState("")
    const [submitted, setSubmitted] = useState(false)
    console.log(cards)

    const handleClick = (answer, time) => {
        let card = cards[index]
        const points = checkCard(card, answer, time)
        const newCard = cards[index]
        newCard.points = points
        setCardsPlayed([...cardsPlayed, newCard ])
        setTranslation([card.translation1, card.translation2, card.translation3])
        setSubmitted(true)
      
    }
   
 
    const nextWord = () => {
        if (index < cards.length -1 && submitted){
            setIndex(index + 1)
            setSubmitted(false)
        }
        if(index === cards.length -1 && submitted){  
            setFinished(true)
            setSubmitted(false)
            endCurrentSession()
        }
        setTranslation([])
        console.log(cardsPlayed)
    }
    const [error, setError]=useState()
    const endCurrentSession =async() =>{
        try {
            setFinished(true)
            let sessionCards = endSession(cardsPlayed)
            const token = await axios.get(`http://127.0.0.1:8000/csrf_token/`, {withCredentials:true})
            const csrf = token.data.csrf_token
            const saveSession = await axios.post("http://localhost:3000/api/saveSession",{sessionId: id, body: sessionCards, token: csrf})
            if (saveSession.status === 200) {
                const router = useRouter();
                router.push('/dashboard');
            }
        } catch (error) {
        
        }
        
    }
    return (
        <div>
            
            {finished?(<div><h1>Saving results</h1> </div>):(
                <div>
                   
                 <Cards card={cards[index]} handleClick={handleClick} next={nextWord} submitted={submitted} setSubmitted={setSubmitted}></Cards>
                 {translation.length? translation.map(translation => <h1>{translation}</h1>): ""}

            
                </div>)}
           
            <h1>{error?error:""}</h1>

             <button onClick={endCurrentSession}>endSession</button>
        </div>
        
    )
}