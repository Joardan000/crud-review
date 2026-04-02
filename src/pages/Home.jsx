import {useEffect, useState} from "react";

export default function Home() {
    const [data,setData] = useState([])
    const [loading, setLoading] = useState(false)

    const [isPut, setIsPut] = useState(false)

    const [itemId, setItemId] = useState(null)

    const [category, setCategory] = useState("")
    const [amount, setAmount] = useState(0)
    const [description, setDescription] = useState("")

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6ImFzaWxiZWsiLCJ1bmlxdWVfbmFtZSI6Iis5OTg5MTQ1NDIzMzkiLCJqdGkiOiJjN2MzMWY4My1iMmUyLTQ3OTYtOGE3OC1kYzdmYTg4NWZlZWEiLCJUZW5hbnRJZCI6IjEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTc4MTExNjM5NSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIn0.GRkiAPvnP-WuhF-M2IMGfFAHMoDcTLPPkdA1V5CrJzQ"
    const url = "https://crm-test-api.duckdns.org/api/Expenses"

    async function fetchData() {
        try{
            setLoading(true)
            const res = await fetch(`${url}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            const response = await res.json()
            setData(response)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }
    async function postData(){
        try {
            const res = await fetch(`${url}`,{
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: category,
                    amount: amount,
                    description: description,
                    createdAt: new Date().toISOString(),
                    paymentMethod: 1
                })
            })
            if(res.ok){
                await fetchData()
                setCategory("")
                setDescription("")
                setAmount(0)
            }
        }catch(err){
            console.log(err)
        }
    }

    function render(e){
        e.preventDefault()
        if(!isPut){
            return postData()
        }else{
            return editData(itemId)
        }
    }

    async function deleteData(id){
        const res = await fetch(`${url}/${id}`,{
            method: 'DELETE',
            headers: {
                Authorization:`Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        if(res.ok){
            await fetchData()
        }
    }
    function editRender(item) {
        setItemId(item.id)
        setCategory(item.category)
        setAmount(item.amount)
        setDescription(item.description)
        setIsPut(true)
    }
    async function editData(id) {
        const res = await fetch(`${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                id: id,
                category: category,
                amount: amount,
                description: description,
                createdAt: new Date().toISOString(),
                paymentMethod: 1
            })
        })
        if (res.ok) {
            setIsPut(false)
            setItemId(null)
            setCategory("")
            setAmount(0)
            setDescription("")
            await fetchData()
        }
    }
    useEffect(() => {
        return (
            fetchData
        )
    },[])
    return (
        <>
            <form onSubmit={render}>
                <input onChange={(e)=>setCategory(e.target.value)} value={category} type="text"/>
                <input onChange={(e)=>setAmount(Number(e.target.value))} value={amount} type="number"/>
                <input onChange={(e)=>setDescription(e.target.value)} value={description} type="text"/>
                <button type="submit">submit</button>
            </form>
            {loading ? (
                <p>loading...</p>
            ):(
                <div>
                    {
                        data.map(item => (
                            <div key={item.id}>
                                <p>{item.category}</p>
                                <p>{item.amount}</p>
                                <p>{item.description}</p>
                                <p>{item.createdAt}</p>
                                <p>{item.paymentMethod}</p>
                                <button onClick={()=>deleteData(item.id)}>delete</button>
                                <button onClick={()=>editRender(item)}>edit</button>
                            </div>
                        ))
                    }
                </div>
            )}
        </>
    )
}