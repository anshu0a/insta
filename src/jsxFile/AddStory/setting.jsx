import { useEffect, useState } from "react";
import "../../cssFile/AddStory-css/setting.css";
import axios from "axios"
import { useNavigate } from "react-router-dom";

import Person from "./person"

export default function setting({ setResponseMessage, setMydata }) {
    const navigate = useNavigate();
    const [opton, setOpton] = useState({ is: 1, closelist: [], allclose: [], allfollower: [], hidelist: [] })
    const [final, setFinal] = useState({ save: false, list: [] })
    const [final2, setFinal2] = useState({ save: false, list: [] })
    useEffect(() => {
        setFinal((pre) => ({ ...pre, list: opton.closelist }))
    }, [opton.closelist])

    useEffect(() => {
        setFinal2((pre) => ({ ...pre, list: opton.hidelist }))
    }, [opton.hidelist])


    const areArraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;

        const set1 = new Set(arr1.map(obj => obj.username));
        const set2 = new Set(arr2.map(obj => obj.username));

        if (set1.size !== set2.size) return false;

        for (let value of set1) {
            if (!set2.has(value)) return false;
        }
        return true;
    };

    const handleclose = async function () {

        try {
            const response = await axios.post('https://instaserver-knen.onrender.com/closefrnd',
                {}, { withCredentials: true, });

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }


            if (response.data.color && response.data.color === 'red') {
                setResponseMessage(response.data);
                return;
            }
            setOpton((pre) => ({ ...pre, closelist: response.data.closelist, allclose: response.data.allclose }))
            setOpton((pre) => ({ ...pre, is: 2 }))
        } catch (error) {

            console.error('Fetch error:', error.message);
            setResponseMessage({
                message: error.response?.data?.message || 'An error occurred',
                color: 'red',
            });

        }

    }


    const handleadd = function (data, type) {
        setOpton((pre) => ({
            ...pre,
            allclose: type === "add"
                ? pre.allclose.filter((one) => one !== data)
                : [...pre.allclose, data]
        }));

        setFinal((pre) => {
            const newList = type === "add"
                ? [...pre.list, data]
                : pre.list.filter((one) => one !== data);

            return {
                ...pre,
                list: newList,
                save: !areArraysEqual(newList, opton.closelist)
            };
        });
    };
    const closebhezo = async function () {
        try {
            const response = await axios.post('https://instaserver-knen.onrender.com/closebhezo',
                { list: final.list }, { withCredentials: true, });

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }
            setResponseMessage(response.data);

            setOpton((pre) => ({ ...pre, is: 1 }));
        } catch (error) {

            console.error('Fetch error:', error.message);
            setResponseMessage({
                message: error.response?.data?.message || 'An error occurred',
                color: 'red',
            });

        }
    }
    const fetchhide = async function () {
        setOpton((pre) => ({ ...pre, is: 3 }))

        try {
            const response = await axios.post('https://instaserver-knen.onrender.com/hidelist',
                {}, { withCredentials: true, });

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }


            if (response.data.color && response.data.color === 'red') {
                setResponseMessage(response.data);
                return;
            }
            setOpton((pre) => ({ ...pre, allfollower: response.data.allfollower, hidelist: response.data.hidelist }))
        } catch (error) {

            console.error('Fetch error:', error.message);
            setResponseMessage({
                message: error.response?.data?.message || 'An error occurred',
                color: 'red',
            });

        }
    }

    const handlehide = function (data, type) {
        setOpton((pre) => ({
            ...pre,
            allfollower: type === "add"
                ? pre.allfollower.filter((one) => one !== data)
                : [...pre.allfollower, data]
        }));

        setFinal2((pre) => {
            const newList = type === "add"
                ? [...pre.list, data]
                : pre.list.filter((one) => one !== data);

            return {
                ...pre,
                list: newList,
                save: !areArraysEqual(newList, opton.hidelist)
            };
        });
    };

    const hidebhezo = async function () {
        try {
            const response = await axios.post('https://instaserver-knen.onrender.com/hidebhezo',
                { list: final2.list }, { withCredentials: true, });

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }
            setResponseMessage(response.data);

            setOpton((pre) => ({ ...pre, is: 1 }));

        } catch (error) {

            console.error('Fetch error:', error.message);
            setResponseMessage({
                message: error.response?.data?.message || 'An error occurred',
                color: 'red',
            });

        }
    }

    return (
        <div className="setting">
            <div className="body1">
                {opton.is === 1 ?
                    <>
                        <h3>
                            <div className="pr1tx">
                                <img onClick={() => setMydata((pre) => ({ ...pre, setting: false }))} src="/svg/bref.svg" />
                                Story settings
                            </div>
                        </h3>
                        <p className="otpn" onClick={() => setOpton((pre) => ({ ...pre, is: 4 }))}>Story share with</p>
                        <p className="otpn" onClick={handleclose}>Close friends</p>
                        <p className="otpn" onClick={fetchhide}>Hide from person</p>

                    </>
                    : opton.is === 2 ?
                        <>
                            <h3>
                                <div className="pr1tx">
                                    <img onClick={() => setOpton((pre) => ({ ...pre, is: 1 }))} src="/svg/bref.svg" />
                                    Close friends
                                </div>
                                {final.save && <div onClick={closebhezo} className="btn11">Save</div>}
                            </h3>
                            <p style={final.list.length === 0 && opton.allclose.length === 0 ? { color: "red" } : {}} className="notir">When you add someone to your Close Friends list, they will appear here. Only users who follow each other can be added.</p>

                            <div className="outpers">
                                {final.list.length > 0 ?
                                    final.list.map((oneper) => <div key={oneper._id} className="pers"> <Person oneper={oneper} tik={true} handleadd={handleadd} /></div>) :
                                    <p className="notir">You haven't added anyone to your Close Friends list yet.</p>}
                                <div className="line"></div>
                                {opton.allclose.length > 0 ?
                                    opton.allclose.sort((a, b) => a.username.localeCompare(b.username)).map((oneper) =>
                                        <div key={oneper._id} className="pers"> <Person oneper={oneper} handleadd={handleadd} /></div>) :
                                    <p className="notir">Expand your connections to add more friends to your Close Friends list.</p>}
                            </div>

                        </> : opton.is === 4 ?
                            <>
                                <h3>
                                    <div className="pr1tx">
                                        <img onClick={() => setOpton((pre) => ({ ...pre, is: 1 }))} src="/svg/bref.svg" />
                                        Story Share with
                                    </div>
                                </h3>
                                <p className="otpn" onClick={() => { setMydata((pre) => ({ ...pre, sharewith: "friends" })); setMydata((pre) => ({ ...pre, setting: false })) }}>Close friends</p>
                                <p className="otpn" onClick={() => { setMydata((pre) => ({ ...pre, sharewith: "public" })); setMydata((pre) => ({ ...pre, setting: false })) }}>Public</p>
                            </>
                            :
                            <>
                                <h3>
                                    <div className="pr1tx">
                                        <img onClick={() => setOpton((pre) => ({ ...pre, is: 1 }))} src="/svg/bref.svg" />
                                        Hide from Person
                                    </div>
                                    {final2.save && <div onClick={hidebhezo} className="btn11">Save</div>}
                                </h3>
                                <p style={final2.list.length === 0 && opton.allfollower.length === 0 ? { color: "red" } : {}} className="notir">When you hide someone from your story, they will appear here.<br />These change can be reset after one week automatically</p>
                                <div className="outpers">
                                    {final2.list.length > 0 ?
                                        final2.list.map((oneper) => <div key={oneper._id} className="pers"> <Person oneper={oneper} tik={true} handlehide={handlehide} /></div>) :
                                        <p className="notir">You haven't added anyone to your Hide list yet.</p>}
                                    <div className="line"></div>
                                    {opton.allfollower.length > 0 ?
                                        opton.allfollower.sort((a, b) => a.username.localeCompare(b.username)).map((oneper) =>
                                            <div key={oneper._id} className="pers"> <Person oneper={oneper} handlehide={handlehide} /></div>) :
                                        <p className="notir">Expand your connections to add more friends to your hide list.</p>}
                                </div>
                            </>}
            </div>

        </div>)
}
