import {useEffect, useState} from 'react'
import './App.css'

function App() {
    const [data,setData] = useState([])
    const [loading, setLoading] = useState(false)
    async function fetchData() {
        try{
            setLoading(true)
            const res = await fetch('...',)
            const data = await res.json()
            setData(data)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }
    async function postData(){
        try {
            const res = await fetch('...',{
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "nimadirnimadir":"nimadir"
                }),
            })
            const data = await res.json()
            setData(data)

            if(res.ok){
                fetchData()
            }
        }catch(err){
            console.log(err)
        }
    }
    async function deleteData(id){
        const res = await fetch(`.../${id}`,{
            method: 'DELETE',
            headers: {
                Authorization:`Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        if(res.ok){
            fetchData()
        }
    }
    async function editData(id){
        const res = await fetch(`.../${id}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                "nimadirnimadir":"nimadir"
            })
        })
        const data = await res.json()
        setData(data)
        if(res.ok){
            fetchData()
        }
    }
    useEffect(() => {
        fetchData()
    },[])
    return (
        <>
            {loading ? (
                <p>loading...</p>
            ):(
                {data}
            )}
        </>
    )
}

export default App
