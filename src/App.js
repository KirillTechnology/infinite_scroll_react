import { useState, useRef, useCallback, useEffect } from 'react';
import './App.css';
import useBookSearch from './hooks/useBookSearch.js';

function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const observer = useRef();
  const { loading, hasMore, error, books } = useBookSearch(query, page);

  const lastBookRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(p => p + 1);
      }
    })
    if (node) observer.current.observe(node);
  }, [loading, hasMore])


  function handleSearch(e) {
    setQuery(e.target.value);
    setPage(1);
  }



  return (
    <div className="App">


      <div className='top'>
        <h1>Infinite Book Search</h1>
        <p>More books loaded when you reach the bottom of the page</p>
        <input type='text' value={query} placeholder='Search' onChange={handleSearch}></input>
      </div>


      <div className='container'>
        <br />
        {books.map((b, i) => {
          // console.log(b)
          if (i + 1 === books.length) {
            return (
              <div className='book' key={b.key} ref={lastBookRef}>
                <p>{b.title}</p>
                <p style={{ fontSize: '12px' }}><i>{b.authors ? b.authors : 'No author'}</i></p>
              </div>
            )
          }
          return (
            <div className='book' key={b.key}>
              <p>{b.title}</p>
              <p style={{ fontSize: '12px' }}><i>{b.authors ? b.authors : 'No author'}</i></p>
            </div>
          )
        })
        }
        {loading && <p style={{ fontWeight: 'bold' }}>Loading...</p>}
        {error && <p style={{ fontWeight: 'bold', color: 'red' }}>Error!</p>}
        <br />
        {query && !loading && !hasMore && <p>---------- THE END ----------</p>}
        <br />
      </div>
    </div>
  );
}

export default App;
