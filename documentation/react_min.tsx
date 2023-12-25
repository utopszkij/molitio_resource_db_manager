import Image from 'next/image'
//+FT
import Link from 'next/link'
import Head from 'next/head';
import React, { useState } from 'react';  // dinamikus oldalhoz kell ez
//import 'app/globals.css';
//-FT

function szoveg() {
	return <em>Ez egy szöveg</em>
}

export default function Page1() {
  var a = 3;
  var items = [ 'a','b','c'];
  var styleObj = {color:'red',fontSize:'32px'};
  const [h1Class, setH1Class] = useState('111'); // '111' a kezdő értéke, ha ez változik akkor re render page
  var disabled = true;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
		<Head>
			<title>proba1 title</title>
		</Head>

      <div>  
        <h1 className={h1Class}><strong>page1</strong></h1>
        <div style={styleObj}><strong>2+2={ (2+2) }</strong></div>
        <div>Feltételes rész 1 { (5 > 4) && <span>5 nagyobb 4-nél</span> } </div>
        <div>Feltételes rész 2 { (3 > 4) && <span>3 nagyobb 4-nél</span> } </div>
        <div>Feltételes rész 3 { (a > 4) ? <span>a nagyobb 4-nél</span> : <span>a nem nagyabb 4-nél</span> } </div>
        lista
        <ul>
        { items.map( (item, index) => <li key={index}>{item}</li> ) }
        </ul>
        <div>szöveg:{szoveg()}</div>
        <input type="text" disabled={disabled} name="input1" value={h1Class} />
      </div>  
    </main>
  )
}
