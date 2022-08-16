import React, { useEffect, useState } from "react";
import '../css/reboot.css';
import '../css/Home.css';

// home component
let Home = () => {

    let uniqueLanguages = [];        // empty array for creating platform buttons
    let uniqueYear = [];        // empty array for creating platform buttons
    const [books, setBooks] = useState([]);     // usestate for storing fetched data
    const [counter, setCounter] = useState(9);
    const [inititalbooks, setinititalbooks] = useState([]);       // usestate for storing inital fetched data
    const [id, setId] = useState('');       // usestate for updating id
    const [key, setKey] = useState('');     // usestate for updating key matched while searching 
    const [search, setSearch] = useState('');      // usestate for updating search value
    const [suggestion, setSuggestion] = useState([]);       // usestate for updating suggestion while searching
    
    const onLoad = async () => {
        const url = 'https://mocki.io/v1/8a140a32-39c7-43dd-afbc-019714162241';
        const response = await fetch(url);
        const data = await response.json();
        setBooks(data);
        setinititalbooks(data);
    }
    
    // rednering one time only and fetching data through api.
    useEffect(() => {
        onLoad();   // calling onLoad
    }, []);

    // method to get platforms
    let filterMenu = (data) => {
        let platform = new Set();
        let platform2 = new Set();
    
        inititalbooks.map((data) => {
            if(typeof data.language !== 'undefined') platform.add(data.language);
            return platform;
        })
        
        inititalbooks.map((data) => {
            if(typeof data.year !== 'undefined') platform2.add(data.year);
            return platform2;
        })
    
        platform.forEach((data) => {
            uniqueLanguages.push(data);
        })

        platform2.forEach((data) => {
            uniqueYear.push(data);
        })
    }

    // updating components whenever id value is changed
    useEffect(() => {
        // filtering data on the basis of id which is platfom name
        setBooks(books.filter((data) => {
            return data.language === id || data.year === id;
        }));
    }, [id]);

    // updating component whenever key value is changed
    // render component when value in search bar becomes zero means key is empty
    useEffect(() => {
        // update suggestion
        if(key === '') {
            setSuggestion(() => {return []})
        }
    }, [key]);

    // update component whenever search value is changed
    useEffect(() => {
        // filtering books data on the basis of serach value and updating books data
        setBooks(books.filter((data) => {
            return data.title === search;
        }));
    }, [search]);


    // method to handle changes happend in search bar
    let handleChanges = (event) => {
        let matchedKey = [];
        // start fitlering data from books on the basis of current value in search bar which we here saying key
        if(key.length >= 0) {
            matchedKey = books.filter((data) => {
                const regex = new RegExp(`${key}`, 'gi');
                return data.title.match(regex) || data.author.match(regex);
            });
        }
        setBooks(inititalbooks);        // update books data after filtering
        setSuggestion(matchedKey);      // update suggestion with matched key
        setKey(event.target.value);     // update key with current value in searchbar
    }

    window.addEventListener('scroll', () => {
        if(window.scrollY + window.innerHeight >=  document.documentElement.scrollHeight) setTimeout(() => {return setCounter(counter + 10)}, 300);
    })

    // method to handle click when clicked on suggestion
    let onClickingSuggestion = (event) => {
        setKey(event.target.innerText);     // updating key with current value of suggestion
        setSuggestion([]);      // updating suggestion as empty => cleanup
    }

    // method to handle search on clicking search button
    let handleSearch = () => {  
        setBooks(inititalbooks);    // updating books data with initialbooks data
        setSearch(() => {return key});      // updating search with the current value of search bar here we say key
    }

    // method to handle click when platforms button are clicked
    let handleClick = (event) => {
        setBooks(inititalbooks);        // updating books data when clicked.
        setId(() => {return event.target.id})       // upadting id value
    }

    return (
        <div className='container'>
            <div className="header">
                <div className="branding">
                    <h1 className="brand-name">L<span className="info">MS</span><span className="dot">.</span></h1>
                </div>
                <div className="search-container">
                    <div className="searchbar">
                        <input onChange={handleChanges} value={key} type="text" autoComplete="off" placeholder="Search by names" className="searchbar" id="srchbr" />
                        <div className="suggestion">
                            {suggestion && suggestion.map((data, index) => {
                                return (<div key={index} className='suggestions-name' id={index + 'Sg'} onClick={onClickingSuggestion}>{data.title}</div>)
                            })}
                        </div>
                    </div>
                    <div className="search-btn-container">
                        <button onClick={handleSearch} className="search-btn" id="srchbtn">Go</button>
                    </div>
                </div>
            </div>
            <div className="category">
                <div className="platforms sort-by-languages">
                    <div className="by-platform"><p>Filter by language</p></div>
                    <div className="buttons">
                        {filterMenu()}
                        {uniqueLanguages && uniqueLanguages.map((data, index) => {
                            return (
                                <div className="menuName" key={index}>
                                    <button className="btn" id={data} onClick={handleClick}>{data}</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="books-list">
                {books && books.map((data, index) => {
                    if(counter >= index) {
                        return (
                            <div className={'card' + index + ' ' + 'cards'} id={index + 'c'} key={index}>
                                <div className="title">
                                    <p><span>Title:</span> {data.title}</p>
                                </div>
                                <div className="author">
                                    <p><span>Author:</span> {data.author}</p>
                                </div>
                                <div className="country">
                                    <p><span>Country:</span> {data.country}</p>
                                </div>
                                <div className="language">
                                    <p><span>Language:</span> {data.language}</p>
                                </div>
                                <div className="year">
                                    <p><span>Publish Year:</span> {data.year}</p>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default Home;