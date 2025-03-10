import "../../cssFile/search-css/search.css";
import List from "../../jsxFile/search/list.jsx";
import Welcome from "../../jsxFile/welcome.jsx";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import React from "react";
import { goBack } from "../../../utils/goback.js";
import Loader2 from "../collect/loader2.jsx";
import { useNavigate } from "react-router-dom";


export default function Search({ setResponseMessage }) {
    const navigate = useNavigate();
    const [lod2, setLod2] = useState(false);
    const [input, setInput] = useState("");
    const [search, setSearch] = useState([]);
    const [history, setHistory] = useState([]);
    const [Response, setResponse] = useState(null);
    const [userid, setUserid] = useState(null);


    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const debouncedChangeHandler = useCallback(
        debounce(async (value) => {
            if (value.trim() !== "") {
                try {
                    setLod2(true);
                    const result = await axios.post(`https://instaserver-knen.onrender.com/search/${value}`
                    );
                    setLod2(false);
                    if (result.data.length > 0) {
                        setSearch(result.data);
                        setResponse(null);
                    } else {
                        setSearch([]);
                        setResponse(value);
                    }
                } catch (error) {
                    console.error("Error searching:", error);
                    setResponseMessage({
                        color: "red",
                        message: "Something went wrong.",
                    });
                } finally {
                    setLod2(false);
                }
            } else {
                setSearch([]);
                setResponse(null);
            }
        }, 700),
        []
    );

    const handleChange = (event) => {
        setInput(event.target.value);
        debouncedChangeHandler(event.target.value);
    };

    const fetchHistory = useCallback(async () => {
        try {
            setLod2(true);
            const response = await axios.post("https://instaserver-knen.onrender.com/searchHistory",
                {},
                { withCredentials: true }
            );
            if (response.data?.message === "Login required.") {
                setResponseMessage(response.data);
                await navigate("/Login");
                return;
            }

            if (response.data?.color === "red") {
                setResponseMessage(response.data);
            } else {
                setHistory(response.data.his.searchHistory.reverse());
                setUserid(response.data.userid)
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            setResponseMessage({
                color: "red",
                message: "Something went wrong while fetching history.",
            });
        } finally {
            setLod2(false);
        }
    }, [navigate, setResponseMessage]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const saveHistory = async () => {
        if (input.trim() === "") {
            setResponseMessage({
                color: "orange",
                message: "Your search is empty.",
            });
            return;
        }

        try {
            setLod2(true);
            const response = await axios.post(`https://instaserver-knen.onrender.com/addHistory/${encodeURIComponent(input)}`,
                {},
                { withCredentials: true }
            );

            if (response.data?.message === "Login required.") {
                setResponseMessage(response.data);
                await navigate("/Login");
                return;
            }

            if (response.data?.color === "red") {
                setResponseMessage(response.data);
            }

            fetchHistory();
        } catch (error) {
            console.error("Error saving history:", error);
            setResponseMessage({
                color: "red",
                message: "Something went wrong. Please try again.",
            });
        } finally {
            setLod2(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            saveHistory();
        }
    };

    const loadSearch = (e) => {
        let naam;
        if (e.target.tagName === "A") {
            naam = e.target.children[1].children[0].innerText;
        } else if (e.target.tagName === "IMG") {
            naam = e.target.parentElement.children[1].children[0].innerText;
        } else {
            naam = e.target.innerText;
        }
        setInput(naam);
        debouncedChangeHandler(naam);
    };

    const clr = () => setInput("");

    return (
        <>
            {lod2 && <Loader2 />}
            <div className="oouuttx">
                <div className="outsearch">
                    <a href="/Filter" title="search by filter">
                        <svg className="flttx" viewBox="0 0 24 24" fill="none">
                            <path
                                stroke="white"
                                d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                    <form className="search">
                        <img
                            className="back"
                            onClick={goBack}
                            title="Back"
                            src="/svg/Back.svg"
                            alt="Back"
                        />
                        <div>
                            <input
                                className="searchBox"
                                autoFocus
                                value={input}
                                onKeyDown={handleKeyDown}
                                onChange={handleChange}
                                placeholder="Search Username"
                                type="text"
                            />
                            {input && (
                                <img
                                    onClick={clr}
                                    title="Clear"
                                    width="18px"
                                    src="/svg/Cut.svg"
                                    alt="Delete"
                                />
                            )}
                        </div>
                        <img
                            className="dosearch"
                            onClick={saveHistory}
                            title="Search"
                            width="20px"
                            src="/svg/Search.svg"
                            alt="Search"
                        />
                    </form>
                    <div className="mainList">
                        {search.length > 0 ? (
                            search.map((item, index) => (
                                <div className="historyList searchlist" key={index}>
                                    <List
                                        type="s"
                                        src={item.pic.path}
                                        name1={item.username}
                                        name2={`${item.fname} ${item.lname}`}
                                    />
                                </div>
                            ))
                        ) : input && Response ? (
                            <div className="notfound">
                                <img
                                    className="kk"
                                    src="/svg/nosearch.svg"
                                    alt="Not found"
                                />
                                <p>
                                    {Response} <span>not found</span>
                                </p>
                            </div>
                        ) : null}
                        {search.length === 0 && history.length > 0 && (
                            history.slice(0, 10).map((item, index) => (
                                <div className="historyList" key={index}>
                                    <List
                                        setResponseMessage={setResponseMessage}
                                        load={loadSearch}
                                        refresh={fetchHistory}
                                        type="h"
                                        src="/svg/history.svg"
                                        name1={item}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {window.innerWidth > 1000 && (
                    <div className="blnk">
                        <Welcome
                            well="Filters"
                            welcomemsg="The Smart Way to Search!"
                            second="It brings your search so near!"
                            first="Sorting usernames as you please"
                            third="Like a treasure map, they guide your way"
                        />
                    </div>
                )}
            </div>
        </>
    );
}
