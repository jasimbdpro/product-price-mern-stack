import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [formData, setFormData] = useState({ product: '', price: '' })
  const [gotData, setGotData] = useState([])


  //Post Data
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = "http://localhost:3000/"
    const postData = async (url, formData) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) {
          throw new Error(`HTTP Error, Status Code: ${response.status}`)
        }
        const postResult = await response.json();
        console.log(postData)
      } catch (error) {
        console.error('Fetch error', error)
      }
    }
    postData(url, formData)
  }

  //Get Data
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("http://localhost:3000/")
        if (!response.ok) {
          throw new Error(`HTTP Error, Status Code: ${response.status}`)
        }
        const getResult = await response.json();
        setGotData(getResult)
        console.log('Got Data from server', getResult)
      } catch (error) {
        console.error("Found Error: ", error)
      }
    }
    getData();
  }, [gotData])

  return (
    <>
      <h2>Product and Price App</h2>

      <form onSubmit={handleSubmit}>
        <label>Product Name:
          <input type="text" onChange={(e) => setFormData({ ...formData, product: e.target.value })} />
        </label> &nbsp;
        <label> Price:
          <input type="number" onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
        </label> &nbsp;
        <button type="submit">Submit</button>
      </form>
      <br /> <br />
      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {gotData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.product}</td>
              <td>{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </>
  )
}

export default App
