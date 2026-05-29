import React, {useMemo, useState, useEffect} from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle2, Flame, BookOpen, Trophy, Volume2, RotateCcw, Coins } from 'lucide-react';
import './style.css';

const course = [
  {level:'A1', title:'Hallo! Introductions', words:[['Hallo','Hello'],['Ich heiße','My name is'],['Danke','Thanks'],['Bitte','Please / You are welcome']], grammar:'German often uses verb-second word order: Ich heiße Maria.', quiz:{q:'Translate: My name is Ali.', options:['Ich heiße Ali.','Ich bin heiße Ali.','Meine Ali heißt.'], answer:0, why:'Use Ich heiße for My name is.'}},
  {level:'A1', title:'Numbers and Age', words:[['eins','one'],['zwei','two'],['zehn','ten'],['Jahre alt','years old']], grammar:'For age, German uses sein: Ich bin 25 Jahre alt.', quiz:{q:'Translate: I am 25 years old.', options:['Ich habe 25 Jahre alt.','Ich bin 25 Jahre alt.','Ich heiße 25 Jahre alt.'], answer:1, why:'German says Ich bin ... Jahre alt, not Ich habe.'}},
  {level:'A1', title:'Articles der/die/das', words:[['der Mann','the man'],['die Frau','the woman'],['das Kind','the child'],['ein/eine','a/an']], grammar:'German nouns have gender: der masculine, die feminine, das neuter.', quiz:{q:'Which article is correct?', options:['der Frau','die Frau','das Frau'], answer:1, why:'Frau is feminine, so it uses die.'}},
  {level:'A1', title:'Food and Drinks', words:[['Wasser','water'],['Brot','bread'],['Kaffee','coffee'],['Ich möchte','I would like']], grammar:'Use Ich möchte to politely say I would like.', quiz:{q:'Translate: I would like water.', options:['Ich möchte Wasser.','Ich bin Wasser.','Ich habe möchte Wasser.'], answer:0, why:'Ich möchte Wasser is the polite A1 phrase.'}},
  {level:'A1', title:'Time and Daily Routine', words:[['heute','today'],['morgen','tomorrow'],['aufstehen','to get up'],['arbeiten','to work']], grammar:'Many daily routine verbs are regular: ich arbeite, du arbeitest, er arbeitet.', quiz:{q:'Choose the correct sentence.', options:['Ich arbeiten heute.','Ich arbeite heute.','Ich heute arbeite.'], answer:1, why:'With ich, arbeiten becomes arbeite.'}},
  {level:'A2', title:'Perfekt Past Tense', words:[['gemacht','done/made'],['gegangen','gone'],['gesehen','seen'],['gestern','yesterday']], grammar:'Spoken past often uses haben or sein plus past participle: Ich habe gelernt.', quiz:{q:'Translate: I learned yesterday.', options:['Ich habe gestern gelernt.','Ich bin gestern gelernt.','Ich lerne gestern.'], answer:0, why:'Most verbs use haben plus participle in Perfekt.'}},
  {level:'A2', title:'Modal Verbs', words:[['können','can'],['müssen','must/have to'],['wollen','want to'],['dürfen','may/be allowed']], grammar:'With modal verbs, the second verb goes to the end: Ich muss Deutsch lernen.', quiz:{q:'Translate: I must learn German.', options:['Ich muss Deutsch lernen.','Ich lernen muss Deutsch.','Ich muss lerne Deutsch.'], answer:0, why:'The modal verb is position 2; the infinitive goes at the end.'}},
  {level:'A2', title:'Dative Basics', words:[['mit','with'],['zu','to'],['dem Mann','the man - dative'],['der Frau','the woman - dative']], grammar:'After mit and zu, use dative: mit dem Bus, zu der Schule = zur Schule.', quiz:{q:'Choose the correct phrase: with the bus', options:['mit der Bus','mit den Bus','mit dem Bus'], answer:2, why:'Bus is masculine, and after mit it becomes dem Bus.'}},
  {level:'A2', title:'Because with weil', words:[['weil','because'],['müde','tired'],['krank','sick'],['spät','late']], grammar:'After weil, the conjugated verb goes to the end: Ich lerne, weil ich Deutsch brauche.', quiz:{q:'Choose the correct sentence.', options:['Ich lerne, weil ich brauche Deutsch.','Ich lerne, weil ich Deutsch brauche.','Ich lerne, weil brauche ich Deutsch.'], answer:1, why:'In a weil-clause, the verb moves to the end.'}},
  {level:'A2', title:'A2 Mini Test', words:[['Einladung','invitation'],['Termin','appointment'],['Meinung','opinion'],['Reise','trip']], grammar:'A2 combines everyday vocabulary with past tense, dative, modal verbs, and simple subordinate clauses.', quiz:{q:'Translate: I cannot come because I am sick.', options:['Ich kann nicht kommen, weil ich krank bin.','Ich nicht kann kommen, weil ich bin krank.','Ich kann nicht komme, weil ich krank bin.'], answer:0, why:'Modal plus infinitive: kann kommen. In weil-clause: ich krank bin.'}}
];

function speak(text){
  if('speechSynthesis' in window){
    const u = new SpeechSynthesisUtterance(text);
    u.lang='de-DE';
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }
}
function getProgress(){return JSON.parse(localStorage.getItem('german-progress')||'{"done":[],"xp":0,"streak":1}');}
function saveProgress(p){localStorage.setItem('german-progress', JSON.stringify(p));}

function App(){
  const [tab,setTab]=useState('learn');
  const [idx,setIdx]=useState(Number(localStorage.getItem('lesson-index')||0));
  const [choice,setChoice]=useState(null);
  const [progress,setProgressState]=useState(getProgress());
  const lesson=course[idx];
  const complete=progress.done.includes(idx);
  const stats=useMemo(()=>({done:progress.done.length,total:course.length, pct:Math.round(progress.done.length/course.length*100)}),[progress]);
  useEffect(()=>{localStorage.setItem('lesson-index',idx)},[idx]);
  const answer=(i)=>{setChoice(i); if(i===lesson.quiz.answer && !complete){ const p={...progress, xp:progress.xp+10, done:[...progress.done,idx]}; saveProgress(p); setProgressState(p);} };
  const reset=()=>{localStorage.clear(); setIdx(0); setChoice(null); const p=getProgress(); setProgressState(p)};
  return <div className="app">
    <header><div><h1>German Tutor</h1><p>A1 → A2 mobile course</p></div><div className="pill"><Flame size={16}/> {progress.streak} day</div></header>
    <section className="hero"><div><b>{stats.pct}% complete</b><div className="bar"><span style={{width:stats.pct+'%'}}/></div></div><div className="xp"><Trophy size={18}/> {progress.xp} XP</div></section>
    <nav><button onClick={()=>setTab('learn')} className={tab==='learn'?'on':''}>Learn</button><button onClick={()=>setTab('path')} className={tab==='path'?'on':''}>Path</button><button onClick={()=>setTab('review')} className={tab==='review'?'on':''}>Review</button><button onClick={()=>setTab('revenue')} className={tab==='revenue'?'on':''}>Revenue</button></nav>
    {tab==='learn' && <main className="card"><div className="tag">{lesson.level}</div><h2>{lesson.title}</h2><p className="grammar">{lesson.grammar}</p><h3>Vocabulary</h3>{lesson.words.map(([de,en])=><div className="word" key={de}><button onClick={()=>speak(de)}><Volume2 size={16}/></button><b>{de}</b><span>{en}</span></div>)}<h3>Quiz</h3><p>{lesson.quiz.q}</p>{lesson.quiz.options.map((o,i)=><button className={'option '+(choice===i?(i===lesson.quiz.answer?'good':'bad'):'')} onClick={()=>answer(i)} key={o}>{o}</button>)}{choice!==null && <div className="feedback"><CheckCircle2 size={18}/>{lesson.quiz.why}</div>}<div className="row"><button disabled={idx===0} onClick={()=>{setIdx(idx-1);setChoice(null)}}>Back</button><button onClick={()=>{setIdx((idx+1)%course.length);setChoice(null)}}>Next</button></div></main>}
    {tab==='path' && <main className="card"><h2>Course Path</h2>{course.map((l,i)=><button className="lesson" onClick={()=>{setIdx(i);setTab('learn');setChoice(null)}} key={l.title}><span>{progress.done.includes(i)?<CheckCircle2/>:<BookOpen/>}</span><div><b>{l.level}: {l.title}</b><small>{i<5?'A1 foundation':i<9?'A2 grammar':'A2 test'}</small></div></button>)}</main>}
    {tab==='review' && <main className="card"><h2>Daily Review</h2><p>Practice weak vocabulary every day. This free version stores progress only on your phone.</p>{course.flatMap(l=>l.words).slice(0,12).map(([de,en])=><div className="word" key={de}><button onClick={()=>speak(de)}><Volume2 size={16}/></button><b>{de}</b><span>{en}</span></div>)}<button className="danger" onClick={reset}><RotateCcw size={16}/> Reset progress</button></main>}
    {tab==='revenue' && <main className="card"><h2>Revenue Ideas</h2><div className="money"><Coins/> Keep the core A1/A2 course free. Earn from optional extras.</div><ul><li>One-time paid A1/A2 exam pack.</li><li>Printable PDF worksheets.</li><li>Private tutoring leads.</li><li>Ads only on free review pages.</li><li>Affiliate links for German books or courses.</li></ul><p className="small">This avoids forcing subscriptions and makes the app attractive to learners tired of paywalls.</p></main>}
    <footer>Install on Android: open the hosted link in Chrome → menu ⋮ → Add to Home screen.</footer>
  </div>
}
createRoot(document.getElementById('root')).render(<App/>);
