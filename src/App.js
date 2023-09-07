import Image from './image/download.png';
import './App.css';
import React,{ useState } from 'react';
import styles from './App.css';
import Arweave from 'arweave';

import {
  getProvider,

} from "zebecprotocol-sdk";

const arweave = Arweave.init({
  host: '127.0.0.1',
  port: 1984,
  protocol: 'http'
  
})

function App() {
  const [state, setState] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [Data, setData] = useState('')
  
  async function createTransaction() {
    if (!state) return
    try {
  const formData = state
  setState('')
  /* creates and sends transaction to Arweave */
  let transaction = await arweave.createTransaction({ data: formData })
  await arweave.transactions.sign(transaction)
  let uploader = await arweave.transactions.getUploader(transaction)

  /* upload indicator */
  while (!uploader.isComplete) {
    await uploader.uploadChunk()
    console.log(
      `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`,
    )
  }
  setTransactionId(transaction.id)
} catch (err) {
  console.log('error: ', err);
}
}
async function readFromArweave() {
  /* read Arweave data using any trsnsaction ID */
  arweave.transactions
    .getData(transactionId, {
      decode: true,
      string: true,
    })
    .then((data) => {
      setData(data)
      console.log('data: ', data);
    })
   
}
const clickHandler = () =>{
  
  console.log("clicked");
  getProvider();
}

const [image, setImage] = useState('');
const [loading, setLoading] = useState(false);

const uploadImage = async e => {
  const files = e.target.files
  const data = new FormData()
   data.append('file', files[0])
  data.append('upload_preset', '')
  setLoading(true)
  const res = await fetch(
    'http://localhost:1984',
    {
      method: 'POST',
      body: data
    }
  )
  const file = await res.json()

  setImage(file.secure_url)
  setLoading(false)
}
  return (
    <div className="App">
      <div> <img src='' alt="" className='h-screen w-full object-cover'/></div>
      <div className={styles.container}>
      <div className="App">
      <button onClick={clickHandler}>connect to  Wallet</button>
    </div>
      <button style={button} onClick={createTransaction}>
        Create Data
      </button>
      <button style={button} onClick={uploadImage}>
       Store Data
      </button>
      <p>{Data}</p>
      <input
        style={input}
        onChange={(e) => setState(e.target.value)}
        placeholder="text"
        value={state}
      />
       <input
        style={input}
        onChange={(e) => setState(e.target.value)}
        type="file"
        name="image"
        placeholder="addimage to the post"
  
       
      />
    </div>
      
      <header className="App-header">
        <img src={Image} className="" alt="" />
      
        <a
         Nam classe="App-link"
          href="https://zebec.io/dashboard"
          target="_blank"
          rel="noopener noreferrer"
        >
         Zebec
        </a>
      </header>
    </div>
  );
}
const button = {
  outline: 'none',
  border: '1px solid black',
  backgroundColor: 'white',
  padding: '10px',
  width: '200px',
  marginBottom: 10,
  cursor: 'pointer',
}

const input = {
  backgroundColor: '#ddd',
  outline: 'none',
  border: 'none',
  width: '200px',
  fontSize: '16px',
  padding: '10px',
}
export default App;
