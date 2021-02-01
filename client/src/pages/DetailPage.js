import React,{useCallback, useState, useContext, useEffect} from 'react';
import {useHttp} from '../hooks/http.hook';
import {useParams} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {Loader} from '../components/Loader';
import {LinkCard} from '../components/LinkCard';


export const DetailPage = () => {
    const {token} = useContext(AuthContext);
    const {request,loading} = useHttp();
    const [link, setLink] = useState(null);
    const linkId = useParams().id;  // get id key from routes

    const getLink = useCallback(async ()=> { // or instead of using useCallback we can define getLink inside useEffect
        try {
            const fetched = await request(`/api/link/${linkId}`, 'GET', null, {// we created current endpoint in link.routes (router.get('/:id' ...) 
                Authorization: `Bearer ${token}`
            }); 
            setLink(fetched); //object fetched is our link
        } catch (error) {
            
        }
    }, [token, linkId, request]);

    useEffect(() => { // call getLink when component is loaded completely
        getLink()
    }, [getLink]);

    if(loading) {
        return <Loader/>
    }
    
    return (
        <>
            {!loading && link && <LinkCard link={link}/>}
        </>
    )
};