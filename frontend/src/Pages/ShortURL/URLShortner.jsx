import React, { useState,useEffect} from 'react'
import Service from '../../utils/http';
import { TextInput,Stack,Button} from '@mantine/core';
import QRCode from "react-qr-code";


const URLshortner = () => {
    const service = new Service();
    const [data, setData] = useState({});
    const [shortUrl, setShortUrl] = useState(null);
    const handleSubmit = async (e) => {
        try {
            const response = await service.post("s", data);
            setShortUrl(response.shortCode);
        }
        catch (err) {
            console.log("Post API call failed", err.message);
        }
    }
    useEffect(() => {
       console.log(`Short URL is ${shortUrl}`);
   }, [shortUrl])
   

    
  return (
    <>
    {shortUrl && shortUrl.length > 0  ? <><p>Short URL: https://url-shortener-bootcamp.onrender.com/api/s{shortUrl}</p>
    <QRCode value={`https://url-shortener-bootcamp.onrender.com/api/s${shortUrl}`} size={256} />
    </> : 
    
        <Stack>
       <TextInput
      label="Original URL"
      withAsterisk
      description="Enter the URL you want to shorten"
      placeholder="https://example.com"
      onChange={(e) => 
        setData({...data, originalUrl: e.target.value})
      }
    />

     <TextInput
      label="Customize the Link"
      withAsterisk
      description="Enter a custom alias for your shortened URL "
      placeholder="your-custom-alias"
      onChange={(e) =>
        setData({...data, customUrl: e.target.value})
      }
    /> 
    <TextInput
      label="Title"
      withAsterisk
      description="Enter a title for your shortened URL"
      placeholder="Your Title"
      onChange={(e) => 
        setData({...data, title: e.target.value})}
    />
    <Button onClick={handleSubmit}> Generate and Shorten URL</Button>
    </Stack>
    
  }
  </>
  )
}

export default URLshortner