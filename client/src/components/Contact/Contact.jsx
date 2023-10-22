import axios from "axios";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Contact = ({ property }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const { data } = await axios.get(`/api/v1/users/${property.userRef}`);
        console.log(data);
        setLandlord();
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [property.userRef]);
  return (
    <>
      {landlord && (
        <div>
          <p>
            Contact <span className="font-semibold">{landlord.name}</span>for{" "}
            <span className="font-semibold">{property.name.toLowerCase()}</span>
          </p>
          <textarea name="message" id="message" value={message} cols="30" rows="10" onChange={handleMessage} placeholder="Enter your message here..." className="w-full border p-3 rounded-lg"></textarea>
          <Link to={`malito:${landlord.email}?subject=regarding ${property.name}&body=${message}`} className="text-white bg-slate-700 text-center p-3 uppercase rounded-lg hover:opacity-95">Send Message</Link>
        </div>
      )}
    </>
  );
};

export default Contact;
