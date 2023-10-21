import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import axios from "axios";
const Property = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const propertyId = params.id;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/properties/${propertyId}`);
        setProperty(data.property);
        setLoading(false);
      } catch (error) {
        setError(error?.response?.data?.message);
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  return (
    <main>
      {loading && <p className="text-center text-2xl my-7">Loading...</p>}
      {error && (
        <p className="text-red-500 text-center text-2xl my-7">
          Somthing went wrong...
        </p>
      )}
      {property && !loading && !error && (
        <>
          <Swiper navigation>
            {property?.imageUrl?.map((url) => {
              return (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{ background: `url(${url}) center no-repeat`,backgroundSize:'cover' }}
                  ></div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </>
      )}
    </main>
  );
};

export default Property;
