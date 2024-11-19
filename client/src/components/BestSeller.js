import React, { useState, useEffect } from "react";
import { apiGetProducts } from "../apis/product";
import Product from './Product'
import Slider from "react-slick"
const tabs = [
    { id: 1, name: 'best seller' },
    { id: 2, name: 'new arrivals' },
]
var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null)
    const [newProducts, setNewProducts] = useState(null)
    const [activedTab, setActivedTab] = useState(1)
    const fetchProducts = async () => {
        const response = await Promise.all([apiGetProducts({ sort: '-sold' }), apiGetProducts({ sort: '-createdAt' })])
        if (response[0]?.success) setBestSellers(response[0].products)
        if (response[1]?.success) setNewProducts(response[1].products)
    }
    useEffect(() => {
        fetchProducts()
    }, [])
    return (
        <div>
            <div className="flex text-[20px] gap-8 pb-4 border-b-2 border-main">
                {tabs.map(el => (
                    <span
                        key={el.id} className={`font-semibold capitalize border-r cursor-pointer text-gray-400 ${activedTab === el.id ? 'text-gray-900' : ''}`}
                        onClick={() => setActivedTab(el.id)}
                    >{el.name}</span>

                ))}
            </div>
            <div className="mt-4">
                <Slider {...settings}>
                    {bestSellers?.map(el => (
                        <Product
                            key={el.id}
                            productsData={el}
                        />
                    ))}
                    {/* <div>
                        <h3>1</h3>
                    </div>
                    <div>
                        <h3>2</h3>
                    </div>
                    <div>
                        <h3>3</h3>
                    </div>
                    <div>
                        <h3>4</h3>
                    </div>
                    <div>
                        <h3>5</h3>
                    </div>
                    <div>
                        <h3>6</h3>
                    </div> */}
                </Slider>

            </div>
        </div>
    )
}

export default BestSeller