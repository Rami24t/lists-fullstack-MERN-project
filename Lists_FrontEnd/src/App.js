import './style.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Deeds from './components/Deeds';
import AddDeed from './components/AddDeed';
import Footer from './components/Footer';
import About from './components/About';
import DeedDetails from './components/DeedDetails';

export default function App() {
  const [deeds, setDeeds] = useState([]);
  // fetch data from API
  let URL = '/deeds';
  const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:4001';
  URL = baseURL + URL;
  async function getData(url = URL) {
    const response = await fetch(url);
    return (await response.json())//.deeds;
  }
  
  async function updateData(url = URL) {
    const data = await getData(url);
    setDeeds(data);
    return deeds;
  }
  
  const [title,setTitle] = useState();

  useEffect(() => {
    if(localStorage.getItem('title')===null)
    localStorage.setItem('title','Deeds Tracker');
    setTitle(localStorage.getItem('title'));
    updateData();
  }, [])

  async function getDeed(id, url = URL) {
    if (!id) {
      return false;
    }
    return await getData(url + '/' + id);
  }

  //function check id
  async function checkID(id) {
    try {
      id = ((await updateData())?.find((deed) => deed.id === id))?.id;
      if (!id) {
        console.log('Deleting failed! ID not found!');
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

async function putData(data, putURL = URL) {
    const settings = {
      "method": "PUT",
      "body": data,
      headers: {
        "Content-Type": "application/json"
      }
    }
    const response = await fetch(putURL, settings);
    if ((response.status !== 200 && response.status!=201) || !response.ok) {
      console.log('response failed: ', response);
      return false;
    }
    else {
      // setDeeds((await response.json()).record.deeds);
      // setDeeds([await response.json(), ...deeds]);
      return true
    }
  }

// Function deleteDeed
async function deleteDeed(id) {
  if (!(await checkID(id)))
    return false;
    const updatedArr = deeds.filter((deed) => deed.id !== id);
    setDeeds(updatedArr);
  await deleteData(id);
}

// Function deleteData
async function deleteData(id) {
  const deleteURL = URL + '/' + id;
  const settings = {
    "method": "DELETE",
    "headers": {
      "Content-Type": "application/json"
    }
  }
  const response = await fetch(deleteURL, settings);
  if ((response.status !== 200 && response.status!=201) || !response.ok) {
    console.log('response failed: ', response);
    return false;
  }
  else {
    return true
  }
}


//Function toggle important
const toggleImportant = async (id) => {
  if (!(await checkID(id)))
    return false;
  const deed = deeds?.find((deed) => deed.id === id);
    deed.important = !deed.important;
    // setDeeds(prev => prev.filter((deed) => deed.id !== id));
     setDeeds([...deeds]);
   await putData(JSON.stringify(deed), URL + '/' + id);
  //  await putData(JSON.stringify({"deeds": deed}));
};

// function addDeed
const addDeed = async (deed) => {
  if (!deed)
    return false;
    const updatedArr = [deed,...deeds];
    // await putData(JSON.stringify({"deeds": updatedArr}));
    // const putURL = "https://api.jsonbin.io/v3/b/635705b265b57a31e6a13759/";
    const settings = {
    "method": "POST",
    "body": JSON.stringify(deed),
    "headers": {
      "Content-Type": "application/json"
      //     //  "X-Master-Key": "$2b$10$JRnVji8T7bax1B6iBoABP.E6J0/WocI7U6ZEyJqFbRt5l2J0RtVcC",
      //     //    "X-JSON-Path": '$.deeds[?(@.id=="'+id+'")]'
    }
  }
  try {
    const response = await fetch(URL, settings);
    if ((response.status !== 200 && response.status!=201) || !response.ok) {
      console.log('response failed: ', response);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
  if(!deed.id)
  {let newID=0;
  do {
  newID= Math.floor(Math.random()*1000000+1);
  } while (deeds.find(deed=>deed.id==newID))
  deed.id=newID;
}
  setDeeds(updatedArr);
};

// function toggleAddDeed
const [shown, setShown] = useState(false);

const toggleAddDeed = () => {
  setShown(!shown);
};


// use location to hide header button
let location = useLocation().pathname;

//loading time bool
const [loading, setLoading] = useState(true);
useEffect(() => {
  setTimeout(() => {
    setLoading(false);
  }, 200);
  return () => {
    setLoading(true);
  }
}, [])


return (
  <div style={{backgroundImage: 'url("https://source.unsplash.com/random/'+window.innerWidth+'×'+window.innerHeight+'/?'+title?.split(' ')[0]||'deeds'+'")', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover', backgroundAttachment: 'fixed'}}>
  <div className='container'  onKeyDown={(e)=>{
    console.log(e.target);
    if(e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA')
      return;
    let nextTitle='Deeds Tracker';
    if(e.key=='s')
      nextTitle='Shopping List';
    else if(e.key=='d')
      nextTitle='Deeds';
    else if(e.key=='p')
      nextTitle='Projects';
    localStorage.setItem('title',nextTitle);

    setTitle(nextTitle);
  }}>
    <Header onToggle={toggleAddDeed} shown={shown} location={location} title={title} />
    <Routes>
      <Route path='/' element={<Navigate to='/home' replace={true} />} />
      <Route
        path="/home"
        element={
          <div>
            {shown ? <AddDeed onAdd={addDeed} title={title} /> : null}
            {deeds?.length > 0 ? (
              <div className="deeds">
                <Deeds
                  deeds={deeds}
                  onDelete={deleteDeed}
                  onToggle={toggleImportant}
                />
              </div>
            ) : (loading ? ('LOADING...') :
              ('You do not have any deeds yet!')
            )}
          </div>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path='/deed/:id' element={<DeedDetails deeds={deeds} loading={loading} />} />
      <Route path='*' element={<Navigate to='/home' replace={true} />} />
    </Routes>
    <Footer />
  </div>
  </div>
);
}
