import { useState, useEffect, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./valentinesApp.css";
import timerImage from '../../timerimg.png';

export function ValentinesApp() {
  const [pos, setPos] = useState({ x: 700, y: 500 });
  const targetPos = useRef({ x: 700, y: 500 });
  const [firstQuestion, setFirstQuestion] = useState(true);
  const [secondQuestion, setSecondQuestion] = useState(false);
  const [thirdQuestion, setThirdQuestion] = useState(false);


  const noBtnRef = useRef<HTMLButtonElement | null>(null);
  const onFirstQuestionClick = () => {
    setFirstQuestion(false);
    setSecondQuestion(true);
  }
  const onSecondQuestionClick = () => {
    setSecondQuestion(false);
    setThirdQuestion(true);
  }

  const onThirdQuestionClick = () => {
    setThirdQuestion(false);
  }
  const [noBtnActive, setNoBtnActive] = useState(false);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      if(noBtnActive){
        setPos((prev) => {
          const lerp = 0.12; // smaller = smoother, slower
          return {
            x: prev.x + (targetPos.current.x - prev.x) * lerp,
            y: prev.y + (targetPos.current.y - prev.y) * lerp,
          };
        });
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [noBtnActive]);

  // Mouse tracking logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!noBtnRef.current) return;

      const rect = noBtnRef.current.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;

      const dx = e.clientX - btnX;
      const dy = e.clientY - btnY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 50) {
        setNoBtnActive(true);
        const angle = Math.atan2(dy, dx);

        const newX = btnX - Math.cos(angle) * 200;
        const newY = btnY - Math.sin(angle) * 200;

        const clampedX = Math.max(0, Math.min(window.innerWidth - rect.width, newX));
        const clampedY = Math.max(0, Math.min(window.innerHeight - rect.height, newY));

        targetPos.current = { x: clampedX, y: clampedY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleNoHover = () => {
    if (!noBtnRef.current) return;
    setNoBtnActive(true);
    const rect = noBtnRef.current.getBoundingClientRect(); 
    const randomX = Math.random() * (window.innerWidth - rect.width); 
    const randomY = Math.random() * (window.innerHeight - rect.height); // Teleport to a totally new spot 
    setPos({ x: randomX, y: randomY }); 
  };
  const [showFirstQuestionPopup, setShowFirstQuestionPopup] = useState(false)
  const handleShowFirstQuestionPopup = () => setShowFirstQuestionPopup(true);
  const hanndleHideFirstQuestionPopup = () => setShowFirstQuestionPopup(false);
  const onBackClick = (current: string) => {
    if(current === "second") {
      setFirstQuestion(true);
      setSecondQuestion(false);
    } else if (current === "third") {
      setSecondQuestion(true);
      setThirdQuestion(false);
    }
  }

  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3); // seconds
  const startTimer = () => {
    setTimeLeft(3);      // reset
    setShowTimer(true);  // show popup
  };
  const [finalAnswer, setFinalAnswer] = useState(false);
  const onLastButtonClick = () => {
    setThirdQuestion(false);
    setFinalAnswer(true);
  }


  const [noBtnReady, setNoBtnReady] = useState(false);
  useEffect(() => {
    if (thirdQuestion && noBtnRef.current && !noBtnReady) {
      const rect = noBtnRef.current.getBoundingClientRect();
      setPos({ x: rect.left, y: rect.top });
      setNoBtnReady(true);
    }
  }, [thirdQuestion, noBtnReady]);






    return (
      <div style={{height:"100vh", display: "flex", flexDirection: "column"}}>
        <HeartsBanner />
        <div className={`mainContainer ${finalAnswer ? "finalAnswer" : ""}`} style={styles.container}>
          {firstQuestion && 
            <div className="questionContainer">
              <h1>I have a really important question to ask you...</h1>
              <div style={{width: "100%", display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
              <Button style={styles.yesBtn} onClick={onFirstQuestionClick}>Okay... &#128525;</Button>
              <Button style={styles.yesBtn} onClick={handleShowFirstQuestionPopup}>I don't care AHA &#128520;</Button>
              </div>
              <Modal show={showFirstQuestionPopup} onHide={hanndleHideFirstQuestionPopup}>
                <Modal.Header>Wrong Answer. Yes you do. Go try again.</Modal.Header>
                <Modal.Body>
                  <img src={timerImage} alt="Timer" style={{ width: '100%' }} />
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={hanndleHideFirstQuestionPopup}>Close</Button>
                </Modal.Footer>
              </Modal>
            </div>
          }
          {secondQuestion &&
            <>
              {/* <Button className="reviewButton" onClick={() => onBackClick("second")}>Review your answer</Button> */}
              <div className="questionContainer">
                <h1>Are you ready for me to ask you the really important question?</h1>
                <div style={{width: "100%", display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                <Button style={styles.yesBtn} onClick={onSecondQuestionClick}>Yes, I'm ready</Button>
                <Button style={styles.yesBtn} onClick={startTimer}>No, I need a few seconds...</Button>
                </div>
                <SecondQuestionTimer 
                  showTimer={showTimer} 
                  setShowTimer={setShowTimer} 
                  timeLeft={timeLeft}
                  setTimeLeft={setTimeLeft}
                />
              </div>
            </>
          }
          {thirdQuestion && 
            <>
              {/* <Button className="reviewButton" onClick={() => onBackClick("third")}>Review your answer</Button> */}
              <div className="questionContainer">
                <h1 style={{marginTop: "20px"}}>Will you be my valentine?</h1>
                <div style={{width: "100%", display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                  <Button onClick={onLastButtonClick} style={styles.yesBtn}>Yes</Button>

                  <Button
                    ref={noBtnRef}
                    onMouseEnter={handleNoHover}
                    style={ noBtnReady ? { ...styles.noBtn, position: "absolute", left: pos.x, top: pos.y, } : { ...styles.noBtn, position: "static", } }
                  >
                    No
                  </Button>
                </div>
              </div>
            </>
          }
          {
            finalAnswer &&
            <div className="questionContainer">
              <div className="finalAnswerContainer">
                <h1 className="finalAnswerText">YAY!!!&#129655;&#129655;&#129655;</h1>
                <img src="../../HappySoExcitedGIF.gif"/>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }

function SecondQuestionTimer({ showTimer, setShowTimer, setTimeLeft, timeLeft }) {

  useEffect(() => {
    if (!showTimer) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showTimer]);

  return (
    <>
      {showTimer && (
        <Modal centered show={showTimer} onHide={() => setShowTimer(false)}>
          <Modal.Body>
            {timeLeft > 0 ? (
              <div>{timeLeft} seconds remaining…</div>
            ) : (
              <div>Time’s up! Try again!</div>
            )}
            {timeLeft === 0 && (
              <img style={{width: "100%"}} src="../../BreakingDespicableMeGif.gif" />
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}


  const styles: Record<string, React.CSSProperties> = {
    yesBtn: {
      backgroundColor: "#E887BB",
      borderColor: "#E81A66",
      padding: "5px 20px",
      fontSize: "18px",
      marginRight: "20px",
    },
    noBtn: {
      backgroundColor: "#E887BB",
      borderColor: "#E81A66",
      padding: "5px 20px",
      fontSize: "18px",
      cursor: "pointer",
    },
  };
const HeartsBanner: React.FC = () => {
  // Just a fixed number of hearts; CSS will handle timing/position 
  const hearts = Array.from({ length: 12 }); 
  return ( 
    <div className="banner"> 
      <div className="banner-text">Bappy Balentines Bay Baby</div> 
      <div className="hearts-layer"> 
        {hearts.map((_, i) => ( 
          <span key={i} className={`heart heart-${i + 1}`}> ♥ </span> 
        ))} 
      </div> 
    </div> 
  ); 
}; 