import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "@firebase/storage";
import { storage } from "../firebase";
import styled from "styled-components";

const Uploader = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const fileUploader = async () => {
    if (!file) return;

    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(null);
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
        });
        setFile(null);
      }
    );
  };

  return (
    <Container>
      <Card>
        <h3>Upload CV</h3>
        <DropBox>
          <h4>Select File Here</h4>
          <p>Files supported: PDF, DOC, DOCX</p>
          <Input type="file" accept=".doc,.docx,.pdf" onChange={onFileChange} />
          <Button onClick={fileUploader}>Upload File</Button>
          <p>{progress}% done</p>
        </DropBox>
      </Card>
    </Container>
  );
};

export default Uploader;

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  border-radius: 10px;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
  width: 600px;
  height: 340px;
  background-color: #ffffff;
  padding: 10px 30px 40px;
  h3 {
    font-size: 22px;
    font-weight: 600;
  }
`;

const DropBox = styled.div`
  margin: 10px 0;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 3px dotted #a3a3a3;
  border-radius: 5px;
  h4 {
    font-size: 16px;
    font-weight: 400;
    color: #2e2e2e;
  }
  p {
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 12px;
    color: #a3a3a3;
  }
`;

const Button = styled.button`
  text-decoration: none;
  background-color: #005af0;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  outline: none;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #ffffff;
    color: #005af0;
    padding: 10px 20px;
    border: none;
    outline: 1px solid #010101;
  }
`;

const Input = styled.input`
  margin: 0 0 1rem 4rem;
`;
