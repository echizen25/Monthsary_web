import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Gift, Heart, Images, LockKeyhole, Mail, Music2, VolumeX, Play, RotateCcw, Settings2, Sparkles, Sun, UploadCloud, X } from 'lucide-react';

const DEFAULTS = {
  nickname: 'my sunshine',
  signature: 'Your favorite person',
  heading: 'A little surprise, just for you',
  invite: 'I made a tiny world filled with all the things I love about us. Will you come inside?',
  giftNote: 'Every memory with you feels like a little piece of sunshine.',
  videoCaption: 'All the moments that made us, us.',
  letter: 'My love,\n\nIf I could keep every moment with you in a jar, I would fill the whole sky with sunshine. Thank you for every laugh, every quiet moment, and every beautiful ordinary day.\n\nHere’s to more adventures, more memories, and a thousand little reasons to smile.\n\nHappy monthsary, my love. ♡',
  finalNote: 'You make my world a little brighter, every single day.',
  date: '',
};
const copy = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
const save = (key, val) => { try { localStorage.setItem(key,val); } catch {} };
const MOTION = { initial:{opacity:0,y:18,scale:.985}, animate:{opacity:1,y:0,scale:1}, exit:{opacity:0,y:-14,scale:.985}, transition:{duration:.42,ease:'easeOut'} };

function openDB() {
  return new Promise((resolve,reject)=>{
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB not supported'));
    const req=indexedDB.open('sunshine-media',1);
    req.onupgradeneeded=()=>req.result.createObjectStore('files');
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function putMedia(key,file) {
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('files','readwrite');
    tx.objectStore('files').put(file,key);
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=()=>{db.close();reject(tx.error);};
  });
}
async function getMedia(key) {
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('files','readonly');
    const req=tx.objectStore('files').get(key);
    req.onsuccess=()=>{db.close();resolve(req.result||null);};
    req.onerror=()=>{db.close();reject(req.error);};
  });
}
async function deleteMedia(key) {
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('files','readwrite');
    tx.objectStore('files').delete(key);
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=()=>{db.close();reject(tx.error);};
  });
}
const stars = Array.from({length:15},(_,i)=>({id:i,left:`${(i*37+9)%98}%`,top:`${(i*29+13)%85}%`,delay:(i%7)*.42}));

export default function App(){
  const [config,setConfig]=useState(()=>{try{return {...DEFAULTS,...JSON.parse(copy('sunshine-config')||'{}')}}catch{return DEFAULTS}});
  const [stage,setStage]=useState(0);
  const [declined,setDeclined]=useState(false);
  const [opened,setOpened]=useState(false);
  const [showFinal,setShowFinal]=useState(false);
  const [edit,setEdit]=useState(false);
  const [musicOn,setMusicOn]=useState(false);
  const [media,setMedia]=useState({photos:[],video:null,music:null});
  const [notice,setNotice]=useState('');
  const audio=useRef(null);
  const urls=useRef([]);

  useEffect(()=>{save('sunshine-config',JSON.stringify(config));},[config]);
  useEffect(()=>{
    let live=true;
    async function hydrate(){
      try{
        const keys=JSON.parse(copy('sunshine-photos')||'[]');
        const [photos,video,music]=await Promise.all([Promise.all(keys.map(k=>getMedia(k).then(blob=>blob?{key:k,url:URL.createObjectURL(blob)}:null))),getMedia('sunshine-video'),getMedia('sunshine-music')]);
        if(!live)return;
        const prepared={photos:photos.filter(Boolean),video:video?URL.createObjectURL(video):null,music:music?URL.createObjectURL(music):null};
        urls.current.push(...prepared.photos.map(p=>p.url),...(prepared.video?[prepared.video]:[]),...(prepared.music?[prepared.music]:[]));
        setMedia(prepared);
      }catch{if(live)setNotice('Media storage is unavailable in this browser. You can still preview uploads for this session.');}
    }
    hydrate();
    return ()=>{live=false;urls.current.forEach(u=>URL.revokeObjectURL(u));};
  },[]);
  useEffect(()=>{
    if(!audio.current)return;
    if(musicOn && media.music) audio.current.play().catch(()=>setMusicOn(false));
    else audio.current.pause();
  },[musicOn,media.music]);
  const update=(key,value)=>setConfig(c=>({...c,[key]:value}));
  const msg=(t)=>{setNotice(t);setTimeout(()=>setNotice(''),4500)};
  const upload=async(type,files)=>{
    const incoming=[...files];
    if(!incoming.length)return;
    const max=type==='photos'?12:1;
    const selected=incoming.slice(0,max);
    try{
      if(type==='photos'){
        const existing=JSON.parse(copy('sunshine-photos')||'[]');
        const entries=[];
        for(const file of selected){
          if(!file.type.startsWith('image/'))continue;
          const key='photo-'+Date.now()+'-'+Math.random().toString(36).slice(2);
          await putMedia(key,file);
          const url=URL.createObjectURL(file);urls.current.push(url);entries.push({key,url});
        }
        save('sunshine-photos',JSON.stringify([...existing,...entries.map(x=>x.key)]));
        setMedia(m=>({...m,photos:[...m.photos,...entries]}));
        msg('Photos saved on this device.');
      }else{
        const file=selected[0];
        if(type==='video'&&!file.type.startsWith('video/'))return msg('Please choose a video file.');
        if(type==='music'&&!file.type.startsWith('audio/'))return msg('Please choose an audio file.');
        await putMedia('sunshine-'+type,file);
        const url=URL.createObjectURL(file);urls.current.push(url);
        setMedia(m=>({...m,[type]:url}));
        msg('Saved on this device. Publish media separately for a shareable site.');
      }
    }catch{msg('Storage unavailable. Try a smaller file or another browser.');}
  };
  const removePhoto=async(key)=>{
    try{await deleteMedia(key);}catch{}
    setMedia(m=>({...m,photos:m.photos.filter(p=>p.key!==key)}));
    save('sunshine-photos',JSON.stringify(JSON.parse(copy('sunshine-photos')||'[]').filter(k=>k!==key)));
  };
  const replay=()=>{setStage(0);setOpened(false);setShowFinal(false);setDeclined(false);};
  return <div className="site">
    <div className="background-wash"/><div className="light-orb orb-one"/><div className="light-orb orb-two"/>
    <div className="sparkle-field" aria-hidden="true">{stars.map(s=><span key={s.id} style={{left:s.left,top:s.top,animationDelay:`${s.delay}s`}}>✦</span>)}</div>
    <header className="header">
      <div className="brand"><Sun size={22} strokeWidth={1.6}/><span>our little sunshine <i>♡</i></span></div>
      <div className="header-actions">
        <button className="icon-button" onClick={()=>{if(!media.music)return msg('Add your favorite music in Customize first.');setMusicOn(v=>!v)}} aria-label={musicOn?'Pause music':'Play music'} title={musicOn?'Pause music':'Play music'}>{musicOn?<Music2 size={18}/>:<VolumeX size={18}/>}</button>
        <button className="icon-button" onClick={()=>setEdit(true)} aria-label="Customize website" title="Customize"><Settings2 size={18}/></button>
      </div>
    </header>
    {media.music&&<audio ref={audio} src={media.music} loop preload="none"/>}
    <main className="main">
      <AnimatePresence mode="wait">
        {stage===0&&<motion.section key="invite" {...MOTION} className="scene invite-scene">
          <div className="eyebrow">✦ a note from someone who adores you ✦</div>
          <div className="envelope-illustration" aria-label="A romantic envelope"><div className="envelope-back"/><div className="envelope-letter">for you ♡</div><div className="envelope-flap"/><div className="envelope-front"/><div className="envelope-seal">♥</div></div>
          <h1>{declined?'Wait, just one more thing…':config.heading}<span className="heart-dot"> ♡</span></h1>
          <p className="lead">{declined?'The little surprise is still here whenever you’re ready. 🥹':config.invite}</p>
          <div className="button-row"><button className="primary-button" onClick={()=>{setStage(1);setDeclined(false)}}>Accept invitation <Heart size={17} fill="currentColor"/></button><button className="text-button" onClick={()=>setDeclined(true)}>{declined?'Maybe I’ll peek…':'Maybe later'}</button></div>
          <p className="small-caption">made with love, especially for {config.nickname} ✿</p>
        </motion.section>}
        {stage===1&&<motion.section key="gift" {...MOTION} className="scene gift-scene">
          <div className="eyebrow">chapter two · something special</div>
          {!opened?<><h1>A little gift for <em>you.</em></h1><p className="lead">Go on, tap the present. I promise it’s worth opening.</p>
            <button className="gift-illustration" aria-label="Open your gift" onClick={()=>setOpened(true)}><span className="gift-spark gift-spark-one">✦</span><span className="gift-spark gift-spark-two">♥</span><span className="gift-lid"/><span className="gift-box"><span className="gift-ribbon"/></span><span className="gift-bow">♡</span></button>
            <p className="small-caption">psst… tap the gift box! 🎁</p></>:
            <><div className="tiny-heart">♥</div><h1>Our favorite <em>memories</em></h1><p className="lead">{config.giftNote}</p>
              <div className="video-frame">{media.video?<video controls playsInline preload="metadata" src={media.video}/>:
                <div className="video-placeholder"><Play size={32} fill="currentColor" strokeWidth={1}/><strong>Our story, in little moments</strong><span>Your video presentation goes here</span><button onClick={()=>setEdit(true)}>Add our video</button></div>}</div>
              <p className="video-caption">{config.videoCaption}</p>
              <div className="gallery-head"><h2>Little snapshots of us</h2><span>♡</span></div>
              {media.photos.length?<div className="photo-grid">{media.photos.map((photo,i)=><div className="polaroid" key={photo.key} style={{transform:`rotate(${(i%3-1)*3}deg)`}}><img src={photo.url} alt={`Memory ${i+1}`}/><div>memory no. {i+1} ♡</div></div>)}</div>:<button className="empty-photos" onClick={()=>setEdit(true)}><Images size={25}/><span>Add your favorite photos together</span><small>A scrapbook full of sunshine is waiting.</small></button>}
              <div className="button-row"><button className="secondary-button" onClick={()=>setOpened(false)}><ArrowLeft size={16}/> Back to gift</button><button className="primary-button" onClick={()=>setStage(2)}>There's something more <ArrowRight size={17}/></button></div>
            </>}
        </motion.section>}
        {stage===2&&<motion.section key="letter" {...MOTION} className="scene letter-scene">
          <div className="eyebrow">chapter three · from my heart to yours</div>
          {!showFinal?<><div className="letter-icon"><Mail size={35} strokeWidth={1.3}/></div><h1>Words I saved <em>for you.</em></h1>
          <div className="letter-paper"><div className="letter-date">a little letter, just because ♡</div><p className="letter-content">{config.letter}</p><div className="letter-signoff">Forever yours,<br/><span>{config.signature} ♡</span></div></div>
          <button className="primary-button" onClick={()=>setShowFinal(true)}>One last surprise <Sparkles size={18}/></button></>:
          <motion.div initial={{opacity:0,scale:.88}} animate={{opacity:1,scale:1}} transition={{duration:.7}} className="finale"><div className="sunflower" aria-hidden="true"><span className="petals">✿</span><span className="flower-core">♥</span></div><div className="eyebrow">you are my favorite sunshine</div><h1>Happy Monthsary,<br/><em>{config.nickname}!</em></h1><p className="lead">{config.finalNote}</p><div className="ending-hearts">♥ &nbsp; ♡ &nbsp; ♥</div><button className="secondary-button" onClick={replay}><RotateCcw size={17}/> Replay our story</button></motion.div>}
          {!showFinal&&<button className="text-button back-letter" onClick={()=>setStage(1)}><ArrowLeft size={15}/> Back to memories</button>}
        </motion.section>}
      </AnimatePresence>
    </main>
    <footer>made with a whole lot of love <Heart size={12} fill="currentColor"/> <span>just for you</span></footer>
    <AnimatePresence>{edit&&<motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.target===e.currentTarget)setEdit(false)}}>
      <motion.aside className="editor" initial={{x:420}} animate={{x:0}} exit={{x:420}} transition={{type:'spring',damping:28,stiffness:230}} role="dialog" aria-modal="true" aria-label="Customize your surprise">
        <div className="editor-header"><div><span className="eyebrow">make it yours</span><h2>Customize ♡</h2></div><button className="icon-button" aria-label="Close editor" onClick={()=>setEdit(false)}><X/></button></div>
        <p className="editor-notice"><LockKeyhole size={15}/> This editor is only a local preview, not password-protected. Changes and uploaded media stay in this browser, not in GitHub or on your recipient's device.</p>
        <div className="field-grid">
          {[
            ['nickname','Sweet nickname'],['signature','Your signature'],['heading','Invitation heading'],['invite','Invitation message'],['giftNote','Gift message'],['videoCaption','Video caption'],['letter','Love letter'],['finalNote','Final surprise message']
          ].map(([key,label])=><label className="field" key={key}><span>{label}</span>{['invite','giftNote','letter','finalNote'].includes(key)?<textarea rows={key==='letter'?9:3} value={config[key]} onChange={e=>update(key,e.target.value)}/>:<input value={config[key]} onChange={e=>update(key,e.target.value)}/>}</label>)}
        </div>
        <div className="media-tools"><h3>Memory uploads</h3><p>Stored only on this device. Upload again when preparing the final published site.</p>
          <label className="upload-button"><UploadCloud size={18}/> Add photos<input type="file" accept="image/*" multiple hidden onChange={e=>{upload('photos',e.target.files);e.target.value=''}}/></label>
          <label className="upload-button"><Play size={18}/> Add video<input type="file" accept="video/*" hidden onChange={e=>{upload('video',e.target.files);e.target.value=''}}/></label>
          <label className="upload-button"><Music2 size={18}/> Add music<input type="file" accept="audio/*" hidden onChange={e=>{upload('music',e.target.files);e.target.value=''}}/></label>
          {!!media.photos.length&&<div className="editor-photos">{media.photos.map(p=><button key={p.key} onClick={()=>removePhoto(p.key)} title="Remove photo"><img src={p.url} alt="Uploaded memory"/><X size={14}/></button>)}</div>}
        </div>
        <button className="primary-button editor-done" onClick={()=>setEdit(false)}><Check size={17}/> Done customizing</button>
      </motion.aside>
    </motion.div>}</AnimatePresence>}
    <AnimatePresence>{notice&&<motion.div className="toast" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:12}}>{notice}</motion.div>}</AnimatePresence>
  </div>;
}
