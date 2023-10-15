import React, { useState, useEffect } from 'react';
import './test.css';

const Infinitescrolling = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Function to fetch data from the server
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/data?page=${currentPage}`,{
          method:"GET",
          headers:{
            "Accept":"application/json"
          }
        });
        const newData = await response.json();
        setData((prevData) => [...prevData, ...newData]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Add the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  console.log(data);
  return (
    <div><h3>Infinitescrolling</h3>
    {data? (<div>{
        data.map((item, index)=>(
          <div key={index} className='card'>{item.name}</div>
        ))
      }</div>) : (<div>Loading</div>)}
    </div>
  )
}

export default Infinitescrolling