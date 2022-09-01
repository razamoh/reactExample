import React, { useState } from "react";
import axios from "axios";
import Message from "./Message";


function BasicForm() {

    //TODO : Use useReducer instead multiple useState hooks
    const [subject, setSubject] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [info , setInfo] = useState<string[]>([''])
    const [submitBtnStatus , setSubmitBtnStatus] = useState<boolean>(false)

    const INVALID_MESSAGE = 'Invalid message.'
    const INVLAID_SUBJECT = 'Invalid subject.'
    const SUCCESS_MESSAGE = 'Your query is submitted.'
    const BASE_URL = 'http://localhost/api/v1/'

    //Reset the  form and update the submitted message
    const resetSubmitForm  = ()=> {
        setSubject('')
        setMessage('')
        setInfo([])
        setSubmitBtnStatus(false)
    }

    type CreateInquiryResponse = {
        suceess: boolean;
        message: string;
    };

    const postInquiry  = async (data:object) => {
        try {
            // 👇️ const data: CreateInquiryResponse
            await axios.post<CreateInquiryResponse>(
                BASE_URL+"inquiry",
                data,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
              },
            );
        
            console.log(JSON.stringify(data, null, 4));
            resetSubmitForm()
            setInfo(info =>[...info, SUCCESS_MESSAGE])
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log('error message: ', error.message);
              // 👇️ error: AxiosError<any, any>
              return error.message;
            } else {
              console.log('unexpected error: ', error);
              return 'An unexpected error occurred';
            }
          }
    }

    const submitForm = async (e : React.FormEvent<HTMLFormElement>)   =>{
        e.preventDefault()
        setSubmitBtnStatus(true)
        setInfo([])

        subject.replace(/\s/g, '').length < 3 && setInfo(info =>[...info, INVLAID_SUBJECT])
        message.replace(/\s/g, '').length < 5 && setInfo(info =>[...info, INVALID_MESSAGE])
 
        if (info.length>0) {
            setSubmitBtnStatus(false)
            return
        }

        let payLoad: object = {
            message,
            subject
        }
        await postInquiry(payLoad)
        return  
    }
  return (
    <div style={{margin:"30px"}}>

      <form onSubmit={submitForm}>
            <>
                <h1>Enter your inquiry.</h1>
                <Message>
                   {info.map((el, i)=>{
                    return (
                        <span style = {{ display: "block",fontWeight: "700", color:"red"}} key={i}>{el}</span>
                    )
                   })}
                </Message>
            </>
            <div className="paddingDiv">
                <label htmlFor="subject">Subject</label>
                <input 
                    id="subject" 
                    placeholder='Enter your subject here' 
                    name='subject' 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    minLength={3}
                    maxLength={50}
                    required 
                />
            </div>
            <div className="paddingDiv">
                <label htmlFor="message">Message</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    id="message"
                    name="message"    
                    minLength={5}
                    required    
                    placeholder="Please enter your query here"    
                />
            </div> 
            <div style={{textAlign:"center"}}>
                <button type='submit' disabled={submitBtnStatus}>Submit</button> 
            </div>
     
      </form>
    </div>
  );
}

export default BasicForm;
