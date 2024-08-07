import React, { useRef, useState } from 'react';
import './imageGenerator.css';
import default_image from '../Assets/photo-generator.webp';

const ImageGenerator = () => {
    const [image_url, setImage_url] = useState(default_image);
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const imageGenerator = async () => {
        if (inputRef.current.value === "") {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    "User-Agent": "Chrome",
                },
                body: JSON.stringify({
                    prompt: `${inputRef.current.value}`,
                    n: 1,
                    size: "512x512",
                }),
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (data.data && data.data[0] && data.data[0].url) {
                setImage_url(data.data[0].url);
            } else {
                console.error("No image URL returned");
            }
        } catch (error) {
            console.error("Error generating image:", error);
        }
        setLoading(false);
    };

    return (
        <div className='ai-image-generator'>
            <div className="header">Arti<span>fex</span></div>
            <div className="image-loading">
                <div className="image">
                    <img src={image_url} alt="Generated" />
                    <div className={loading ? "loading-bar-full" : "loading-bar"}>
                        <div className='loading-bar'></div>
                        <div className={loading ? "loading-text" : "display-none"}> Loading ...</div>
                    </div>
                </div>
            </div>
            <div className='search-box'>
                <input type="text" ref={inputRef} className="search-input" placeholder='Write your thoughts' />
                <div className='generate-btn' onClick={imageGenerator}>Generate the idea</div>
            </div>
        </div>
    );
};

export default ImageGenerator;
