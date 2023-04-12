import react, { Component, useEffect, useRef, useState } from "react";
import Layouts from "@/components/Layouts";
export default function Upload() {
  const fileRef = useRef();
  const progressInterval = useRef("");
  const [batchDetail, setBatchDetail] = useState({});
  const [batchId, setBatchId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    if(batchId){
      updateProgress();
    }
  }, [batchId]);

  useEffect(() => {
    fetch(`${API_URL}/batch/in-progress`)
      .then(res => res.json())
      .then(data => setBatchId(data.id));
  }, []);

  function handleForm(e) {
    e.preventDefault();
    if(isLoading) return;
    const inputFile = fileRef.current;
    const file = inputFile.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append("mycsv", file);

    setIsLoading(true);
    fetch(`${API_URL}/upload`, {method: "POST", body: formData})
      .then(res => res.json())
      .then(data => {
        setBatchId(data.id);
        batchDetails(data.id);
        setIsLoading(false);
      });
  }

  function batchDetails(id = null) {
    const currentBatchId = id ?? batchId;
    fetch(`${API_URL}/batch/${currentBatchId}`)
    .then(res => res.json())
    .then(data => {
      setBatchDetail(data);
      if(data.progress >= 100) {
        clearInterval(progressInterval.current);
      }
    });
  }

  function updateProgress() {
    if(progressInterval.current !== "") return;
    progressInterval.current = setInterval(function() {
      batchDetails();
    }, 2000);
  }
  return (
        <Layouts>
          {batchDetail.progress != undefined && <section>
            <h1>Upload is in progress ({batchDetail.progress}%)</h1>
            <div className="w-full h-4 rounded-lg shadow-inner border">
              <div className="bg-blue-700 h-4 rounded-lg w-full" style={{ width:`${batchDetail.progress}%` }}></div>
            </div>
          </section>}
          {batchDetail.progress == undefined && <section>
            <h1 className="text-xl text-gray-800 text-center mb-5">Choose a file to Upload</h1>
            <form className="border rounded p-4" onSubmit={handleForm}>
              <input type="file" ref={fileRef} />
              <input type="submit" value="Upload" 
              className={`px-4 py-2 rounded text-white ${isLoading ? "bg-gray-400 outline-none" : "bg-gray-700"}`} />
            </form>
          </section>}
        </Layouts>
  )
}
