import React, {useState, useEffect, useContext} from 'react';
import {useHttp} from '../hooks/http.hook'; 
import {AuthContext} from '../context/AuthContext';
import {useHistory} from 'react-router-dom';

export const CreatePage = () => {
    const history = useHistory(); 
    const auth = useContext(AuthContext);  // to get current token
    const {request} = useHttp();
    const [link, setLink] = useState();

    useEffect( () => {
        window.M.updateTextFields(); // Materialize method to do form inputs active
    },[]);

    const pressHandler = async event => {
        if (event.key === 'Enter') {
            try {
                const data = await request('/api/link/generate', 'POST', {from: link},  // pass parameters to http.hook / data - link info
                    {Authorization: `Bearer ${auth.token}`  // Add to headers current token important!
                }) 
                console.log(data); 
                /* {link:
                    clicks: 0
                    code: "7VrFjci-s"
                    data: "2021-01-29T18:45:16.685Z"
                    from: "https://materializecss.com/navbar.html"
                    owner: "600dd0113d7c9b2474825558"
                    to: "http://localhost:5000/t/7VrFjci-s"
                    __v: 0
                    _id: "601457bc040d250c500d0f96"} */
                    history.push(`detail/${data.link._id}`); // redirect to link page (DetailPage), after creating short link
            } catch (e) {}
        }
    }

    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
                <div className="input-field">
                    <input 
                        placeholder="insert link" 
                        id="link"
                        type="text"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        onKeyPress={pressHandler}
                    />
                    <label htmlFor="link">Insert link</label>
                </div>
            </div>
        </div>
    )
}