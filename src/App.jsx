import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Heart, Mail, RotateCcw, Sparkles, Sun } from 'lucide-react';

const CONTENT = {
  nickname: 'my sunshine',
  signature: 'Your favorite person',
  heading: 'A little surprise, just for you',
  invite: 'I made a tiny world filled with all the things I love about us. Will you come inside?',
  giftNote: 'Every memory with you feels like a little piece of sunshine.',
  videoCaption: 'All the moments that made us, us.',
  letter: "Hi baby Eto na ung Message ko para sayo .sorry hindi exact 12 am pero hindi din to 11:59PM . may time kase ung pagupload e pero eto nageffort ako baby bka mamiss mo kase ako masyado . kase matagal tayo bago magkita muli. pero uunahan na kita. hindi ito AI . \n\nUnang una baby for almost 2 years madami na tayo pinagdaanan nagiging komportable tayo sa mga bagay .may mga bagay tayo napagkakasunduan .may mga bagay din hindi .normal nmn iyon at kailangan lang sa relasyonship natin na magkaroon ng balance kung sinu ang magaadjust gaya nga ng sabi mo kung sinu magfifill ng cup kung sinu may kulang ay nakakapagadjsut tayo to make this thing work . \nmaraming salamat baby sa lahat ng pagmamahal pagaalaga mo sa akin kahit minsan hindi ka ganon kashowy na sweet sa akin lage mo ako sinasapak haha joke. mahal na mahal paden kita no matter what. walang ibang obstacles na humaharang o gumugulo satin baby para paglayuin or paghiwalayin tayo . wlang temptation na na dapat ikabahala baby sayo lang ako .at wala na ako gusto pa makuha dito sa buhay ko kundi makasama ka lang habang buhay  . maging masaya tayo sa bawat moment na nabubuhay tayo . kaya sabi mo nga stay healthy palage sana maappreciate mo etong basic lang to baby haha benta mo kung gusto mo hahaha. ilove you happy monthsary",
  finalNote: 'You make my world a little brighter, every single day.',
  date: '',
  secretQuestion: 'Miss mo na ba ako, Baby?',
  successMessage: 'Yieee! Miss din kita, Baby! 🥹💛 May special surprise ako para sa’yo.',
  retryMessage: 'Halaaa Baby! 🥺 Try again… alam mo naman ang sagot diyan. Hihi! 💛',
};
const MOTION = { initial:{opacity:0,y:18,scale:.985}, animate:{opacity:1,y:0,scale:1}, exit:{opacity:0,y:-14,scale:.985}, transition:{duration:.42,ease:'easeOut'} };

const stars = Array.from({length:15},(_,i)=>({id:i,left:`${(i*37+9)%98}%`,top:`${(i*29+13)%85}%`,delay:(i%7)*.42}));

export default function App(){
  const [stage,setStage]=useState(-1);
  const [answer,setAnswer]=useState('');
  const [gateState,setGateState]=useState('idle');
  const advanceTimer=useRef(null);
  const [declined,setDeclined]=useState(false);
  const [opened,setOpened]=useState(false);
  const [invitationOpening,setInvitationOpening]=useState(false);
  const [giftOpening,setGiftOpening]=useState(false);
  const [letterOpened,setLetterOpened]=useState(false);
  const [letterCount,setLetterCount]=useState(0);
  const [skipLetter,setSkipLetter]=useState(false);
  const transitionTimers=useRef([]);
  const [showFinal,setShowFinal]=useState(false);
  const [videoError,setVideoError]=useState('');
  const videoSrc=`${import.meta.env.BASE_URL}1111.mp4`;

  useEffect(()=>()=>transitionTimers.current.forEach(clearTimeout),[]);
  useEffect(()=>{
    if(!letterOpened||skipLetter||showFinal)return;
    if(letterCount >= CONTENT.letter.length)return;
    const timer=setTimeout(()=>setLetterCount(n=>Math.min(n+3,CONTENT.letter.length)),28);
    return ()=>clearTimeout(timer);
  },[letterOpened,skipLetter,letterCount,CONTENT.letter,showFinal]);
  const acceptInvitation=()=>{
    if(invitationOpening)return;
    setInvitationOpening(true);
    transitionTimers.current.push(setTimeout(()=>{setStage(1);setDeclined(false);setInvitationOpening(false);},1750));
  };
  const openGift=()=>{
    if(giftOpening||opened)return;
    setGiftOpening(true);
    transitionTimers.current.push(setTimeout(()=>{setOpened(true);setGiftOpening(false);},1350));
  };
  useEffect(()=>()=>clearTimeout(advanceTimer.current),[]);
  const submitAnswer=(e)=>{
    e.preventDefault();
    if(gateState==='correct'||!answer.trim())return;
    const normalized=answer.trim().toLocaleLowerCase();
    if(!['yes','oo'].includes(normalized)){
      setGateState('wrong');
      return;
    }
    setGateState('correct');
    clearTimeout(advanceTimer.current);
    advanceTimer.current=setTimeout(()=>{
      setStage(0);
      setGateState('idle');
      setAnswer('');
    },2200);
  };

  const replay=()=>{transitionTimers.current.forEach(clearTimeout);transitionTimers.current=[];setStage(-1);setAnswer('');setGateState('idle');setOpened(false);setGiftOpening(false);setInvitationOpening(false);setShowFinal(false);setDeclined(false);setLetterOpened(false);setLetterCount(0);setSkipLetter(false);};
  return <div className="site">
    <div className="background-wash"/><div className="light-orb orb-one"/><div className="light-orb orb-two"/>
    <div className="sparkle-field" aria-hidden="true">{stars.map(s=><span key={s.id} style={{left:s.left,top:s.top,animationDelay:`${s.delay}s`}}>✦</span>)}</div>
    <header className="header">
      <div className="brand"><Sun size={22} strokeWidth={1.6}/><span>our little sunshine <i>♡</i></span></div>
    </header>
    <main className="main">
      <AnimatePresence mode="wait">
        {stage===-1&&<motion.section key="secret-question" {...MOTION} className="scene secret-scene">
          <div className="secret-symbol"><Heart size={35} fill="currentColor" strokeWidth={1}/></div>
          <div className="eyebrow">a tiny question, before we begin ✦</div>
          <h1>Hi, <em>Baby!</em> ♡</h1>
          <p className="lead">Before we begin, may tanong muna ako sa'yo…</p>
          <form className="secret-form" onSubmit={submitAnswer}>
            <label htmlFor="secret-answer" className="secret-prompt">{CONTENT.secretQuestion}</label>
            <input id="secret-answer" type="text" autoComplete="off" spellCheck="false" value={answer} onChange={e=>{setAnswer(e.target.value);setGateState('idle');}} placeholder="Your answer, Baby…" disabled={gateState==='correct'} required/>
            <button type="submit" className="primary-button" disabled={gateState==='correct'||!answer.trim()}>{gateState==='correct'?'A little surprise is coming…':'Unlock my surprise'} <Heart size={16} fill="currentColor"/></button>
          </form>
          <AnimatePresence mode="wait">
            {gateState==='wrong'&&<motion.div key="wrong" className="secret-feedback warning" initial={{opacity:0,y:9}} animate={{opacity:1,y:0}} exit={{opacity:0}} role="status">{CONTENT.retryMessage}<small>Subukan mo ulit, Baby ♡</small></motion.div>}
            {gateState==='correct'&&<motion.div key="correct" className="secret-feedback correct" initial={{opacity:0,scale:.93}} animate={{opacity:1,scale:1}} exit={{opacity:0}} role="status"><span className="floating-hearts">♥ ♡ ♥</span>{CONTENT.successMessage}<small>Opening your invitation…</small></motion.div>}
          </AnimatePresence>
          <p className="small-caption">only one answer will make my heart happy 💛</p>
        </motion.section>}
        {stage===0&&<motion.section key="invite" {...MOTION} className="scene invite-scene">
          <div className="eyebrow">✦ a note from someone who adores you ✦</div>
          <div className={`envelope-illustration premium-envelope ${invitationOpening?'envelope-accepting':''}`} aria-label="A romantic envelope opening"><div className="envelope-back"/><div className="envelope-letter"><span>To my Baby ♡</span><small>an invitation made with love</small></div><div className="envelope-flap"/><div className="envelope-front"/><div className="envelope-seal"><Heart size={17} fill="currentColor"/></div>{invitationOpening&&<div className="accept-sparkles" aria-hidden="true">{Array.from({length:8},(_,i)=><i key={i} style={{'--i':i}}>✦</i>)}</div>}</div>
          <h1>{declined?'Wait, just one more thing…':CONTENT.heading}<span className="heart-dot"> ♡</span></h1>
          <p className="lead">{declined?'The little surprise is still here whenever you’re ready. 🥹':CONTENT.invite}</p>
          <div className="button-row"><button className="primary-button" onClick={acceptInvitation} disabled={invitationOpening}>{invitationOpening?'Opening your invitation…':'Accept invitation'} <Heart size={17} fill="currentColor"/></button><button className="text-button" onClick={()=>setDeclined(true)}>{declined?'Maybe I’ll peek…':'Maybe later'}</button></div>
          <p className="small-caption">made with love, especially for {CONTENT.nickname} ✿</p>
        </motion.section>}
        {stage===1&&<motion.section key="gift" {...MOTION} className="scene gift-scene">
          <div className="eyebrow">chapter two · something special</div>
          {!opened?<><h1>A little gift for <em>you.</em></h1><p className="lead">Go on, tap the present. I promise it’s worth opening.</p>
            <button className={`gift-illustration cinematic-gift ${giftOpening?'gift-is-opening':''}`} aria-label="Open your gift" disabled={giftOpening} onClick={openGift}><span className="gift-glow"/><span className="gift-spark gift-spark-one">✦</span><span className="gift-spark gift-spark-two">♥</span><span className="gift-lid"/><span className="gift-box"><span className="gift-ribbon"/></span><span className="gift-bow">♡</span><span className="gift-float-hearts">♥ ♡ ♥</span></button>
            <p className="small-caption">{giftOpening?'A little magic is happening… ✨':'psst… tap the gift box! 🎁'}</p></>:
            <><div className="tiny-heart">♥</div><h1>Our favorite <em>memories</em></h1><p className="lead">{CONTENT.giftNote}</p>
              <div className="video-frame"><video controls playsInline preload="metadata" src={videoSrc} onError={()=>setVideoError('Hindi ma-play ang 1111.mp4. Check kung kumpleto ang file sa public folder at kung H.264 video / AAC audio ang encoding.')} onLoadedData={()=>setVideoError('')}>Your browser does not support this video.</video></div>
              {videoError&&<p className="video-error" role="alert">{videoError}</p>
              <p className="video-caption">{CONTENT.videoCaption}</p>
              <div className="button-row"><button className="secondary-button" onClick={()=>setOpened(false)}><ArrowLeft size={16}/> Back to gift</button><button className="primary-button" onClick={()=>setStage(2)}>There's something more <ArrowRight size={17}/></button></div>
            </>}
        </motion.section>}
        {stage===2&&<motion.section key="letter" {...MOTION} className="scene letter-scene">
          <div className="eyebrow">chapter three · from my heart to yours</div>
          {!showFinal?<><div className="letter-icon"><Mail size={35} strokeWidth={1.3}/></div><h1>Words I saved <em>for you.</em></h1>
          {!letterOpened?<button className="sealed-letter" onClick={()=>{setLetterOpened(true);setLetterCount(0);setSkipLetter(false)}} aria-label="Open love letter"><span className="sealed-letter-flap"/><span className="sealed-letter-seal">♥</span><span className="sealed-letter-caption">Tap to open your letter ♡</span></button>:
          <motion.div className="letter-paper unfolded-paper" initial={{rotateX:-65,opacity:0,y:25}} animate={{rotateX:0,opacity:1,y:0}} transition={{duration:.75,ease:'easeOut'}}><div className="letter-date">a little letter, just because ♡</div><p className="letter-content">{skipLetter?CONTENT.letter:CONTENT.letter.slice(0,letterCount)}{!skipLetter&&letterCount<CONTENT.letter.length&&<span className="typing-cursor">▍</span>}</p>{(skipLetter||letterCount>=CONTENT.letter.length)&&<div className="letter-signoff">Forever yours,<br/><span>{CONTENT.signature} ♡</span></div>}</motion.div>}
          {letterOpened&&<div className="letter-actions">{!skipLetter&&letterCount<CONTENT.letter.length&&<button className="secondary-button" onClick={()=>{setSkipLetter(true);setLetterCount(CONTENT.letter.length)}}>Read instantly</button>}<button className="primary-button" onClick={()=>setShowFinal(true)}>One last surprise <Sparkles size={18}/></button></div>}</>:
          <motion.div initial={{opacity:0,scale:.88}} animate={{opacity:1,scale:1}} transition={{duration:.7}} className="finale"><div className="finale-particles" aria-hidden="true">{Array.from({length:12},(_,i)=><span key={i} style={{'--i':i}}>♥</span>)}</div><div className="sunflower blooming-sunflower" aria-hidden="true"><span className="petals">✿</span><span className="flower-core">♥</span></div><div className="eyebrow">you are my favorite sunshine</div><h1>Happy Monthsary,<br/><em>Baby!</em></h1><p className="lead">{CONTENT.finalNote}</p><div className="ending-hearts">♥ &nbsp; ♡ &nbsp; ♥</div><button className="secondary-button" onClick={replay}><RotateCcw size={17}/> Replay our story</button></motion.div>}
          {!showFinal&&<button className="text-button back-letter" onClick={()=>setStage(1)}><ArrowLeft size={15}/> Back to memories</button>}
        </motion.section>}
      </AnimatePresence>
    </main>
    <footer>made with a whole lot of love <Heart size={12} fill="currentColor"/> <span>just for you</span></footer>
  </div>;
}
