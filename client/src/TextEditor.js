import React, { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './styles.css';
import {io} from 'socket.io-client';

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ]

export default function TextEditor() {
    //const wrapperRef = useRef();
    const [socket,setSocket] = useState();
    const [quill,setQuill] = useState();
    useEffect(()=>{
        //console.log("socket");
        const s = io("http://localhost:3005")
        setSocket(s)

        return () =>{
            s.disconnect();
        }
    },[])

    useEffect(()=>{
        //console.log("Update");
        if(socket == null || quill == null) return

        const handler  = (delta,oldDelta,source) =>{
            quill.updateContents(delta)
        }
        socket.on('receive_changes',handler)

        return () =>{
            quill.off('text-change',handler)
        }
    },[socket,quill])

    useEffect(()=>{
        //console.log("Edit")
        if(socket == null || quill == null) return

        const handler  = (delta,oldDelta,source) =>{
            //console.log("Hello>>>>>",source);
            if(source !== 'user') return 

            socket.emit("send_changes",delta)
        }
        //console.log("Hello>>>>",quill.on('text-change'));
        quill.on('text-change',handler)

        return () =>{
            quill.off('text-change',handler)
        }
    },[socket,quill])

    const wrapperRef = useCallback(wrapper => {
        //console.log("wrapper>>>>>",wrapper);
        if (wrapper == null) return
        
        
        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        const q = new Quill(editor, {
          theme: "snow",
          modules : {toolbar : TOOLBAR_OPTIONS}
        })
        setQuill(q);
    },[])
  return <div className='container' ref={wrapperRef}>  </div>
  
}
