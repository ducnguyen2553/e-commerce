import React from "react";
import BannerSlide from "../assets/shopping-banner4.jpg"

const Banner = () => {
    return (
        <div className="w-full">
            <img src={BannerSlide} alt="banner"
                className="h-[400px] w-full object-cover"
            />
        </div>
    )
}

export default Banner