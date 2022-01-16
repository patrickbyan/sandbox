import React, { useEffect, useState } from 'react'
import './App.css';
import * as htmlToImage from 'html-to-image';
import template from './template.png'
import db from './db'
import Swal from 'sweetalert2';
import download from 'downloadjs';

function App() {
  const [ count, setCount ] = useState(0)
  const [ printed, setPrinted ] = useState(false)
  const [ text, setText ] = useState('')

  useEffect(() => {
    // next()
   
    if(!printed){
      print()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  const print = async () => {
    const result = await Swal.fire({
      title: 'Name',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Enter',
      showLoaderOnConfirm: true,
      preConfirm: (e) => {
        setText(e)
        return e
      }
    })
    if(result.isConfirmed){
      const { value } = result
  
      // setText(value)
      await generate({ type: 'text', value })
      setPrinted(true)
    }
  }

  const next = async () => {
    let lastCount = count

    const confirm = await Swal.fire(
      'next',
      `count ${lastCount}, name: ${db[lastCount]}`,
      'success'
    )
    if(confirm.isConfirmed){
      await generate({ type: 'index', value: lastCount})
    }

  }

  const generate = async ({ type, value }) => {
    const pic = document.getElementById('pic');
  
    htmlToImage.toJpeg(pic, { quality: 1 })
    .then((dataUrl) => {
      if(type === 'text') {
        download(dataUrl, `${value}.jpeg`);
      } else {
        download(dataUrl, `${db[value]}.jpeg`);
      }
      // i++
      // setCount(i)
    })
    .catch((err) => {
      Swal.fire('error', err.message, 'error')
    });
  }

  return (
    <div id="pic" style={{ position: 'relative' }}>
      <img src={template} alt="template" style={{width: '100%'}} />
      <div className='name'>
        { !!text.length? text : db[count] }
      </div>
      <div className='n'>
        1
      </div>
    </div>
  );
}

export default App;
