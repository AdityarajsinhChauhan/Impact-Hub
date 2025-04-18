import React, { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import HomeImgData from "../assets/HomeImgData";
import { FeaturesData } from "../assets/FeaturesData";
import { useNavigate } from "react-router-dom";

const Home = ({ active, setactive }) => {

  const navigate = useNavigate();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const featuresRef = useRef(null);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (inView && !visible) {
    setVisible(true);
  }

  useEffect(() => {
    setactive("home");
    setIsPageLoaded(true);
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="bg-gray-100">


      {/* first hero image */}
      <div className="relative  h-[50vh] md:h-[89vh] overflow-hidden">
        <img
          src={HomeImgData[0].image}
          className={`brightness-50 transition-all duration-500 object-cover object-bottom w-[100vw] h-[50vh] md:h-[89vh]
            ${isPageLoaded ? "opacity-100" : "opacity-0"}
            `}
        />
        <div className="absolute top-24 md:top-28 w-full">
          <div className=" flex flex-col gap-5 items-center justify-center ">
            <div className="flex justify-center items-center">
              <div
                className={`md:text-6xl w-[70%] font-bold mx-auto text-center text-white transition-all duration-500 ${
                  isPageLoaded
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0"
                }`}
              >
                {HomeImgData[0].quote}
              </div>
            </div>
            <button
              onClick={scrollToFeatures}
              className={`text-white text-xl font-medium bg-emerald-500 px-10 py-3 rounded-full hover:bg-black
                transition-all duration-500 ${
                  isPageLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
            >
              {HomeImgData[0].buttonText}
            </button>
          </div>
        </div>
        <span className="absolute text-white bottom-36 right-5">
          {HomeImgData[0].photoBy}
        </span>

        <div className=" absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none z-10" />
        
      </div>
      {/* White fade effect at bottom */}
      
      


      

      

      {/*what impact hub offers section*/}

      <div ref={featuresRef} className="flex justify-center items-center text-4xl md:text-5xl font-thin mt-14 pt-5 scroll-mt-5">
        What Impact Hub Offers
      </div>

      <div>
        {FeaturesData.map((item) => {
          return (
            <div className="flex flex-col mt-28">
              {item.id % 2 == 0 ? (
                <div className="flex flex-col md:flex-row md:rounded-lg w-screen md:w-[90vw] md:mx-16 bg-white md:p-10 mb-5 ">
                  <div className="relative w-[90vw] md:w-[60rem] h-[20rem] overflow-hidden md:m-0 m-5">
                    <img
                      src={item.image}
                      alt=""
                      className=" w-[90vw] md:w-[60rem] h-[20rem] rounded-lg object-cover object-center md:mr-16 brightness-75 hover:scale-110 transition-all duration-300"
                    />
                    <span className="absolute bottom-5 right-5 text-white">
                      {item.imageBy}
                    </span>
                    <span className="absolute top-0 left-0 text-white text-4xl px-28 pt-20">
                      {item.quote}
                    </span>
                  </div>
                  <div className="flex flex-col  w-[90vw] md:w-[60rem]">
                    <h1 className="text-4xl mx-0 md:mx-10 font-thin text-emerald-700 flex md:block justify-center items-center mb-8">
                      {item.title}
                    </h1>
                    <span className="text-lg mx-10">{item.description}</span>
                    <button onClick={() => navigate(item.link)} className="md:w-48 w-full md:mx-10 mx-5  rounded-lg bg-black text-white mt-10 py-2 text-lg hover:bg-emerald-500 transition-all duration-500">
                      {item.buttonText}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:w-[90vw] w-screen md:flex-row md:mx-16 bg-white md:p-10 md:rounded-lg">
                  <div className="flex flex-col mr-16 w-[90vw] md:w-[60rem]">
                    <h1 className="text-4xl flex md:block justify-center items-center mt-5 mx-0 md:mx-10 font-thin text-emerald-700 mb-8">
                      {item.title}
                    </h1>
                    <span className="text-lg mx-10">{item.description}</span>
                    <button onClick={() => navigate(item.link)} className="md:w-48 w-full md:mx-10 mx-5 rounded-lg bg-emerald-500 text-white mt-10 py-2 text-lg hover:bg-black transition-all duration-500">
                      {item.buttonText}
                    </button>
                  </div>
                  <div className="relative w-[90vw] md:w-[60rem] h-[20rem] overflow-hidden rounded-lg md:m-0 m-5">
                    <img
                      src={item.image}
                      alt=""
                      className=" w-[90vw] md:w-[60rem] h-[20rem] object-cover object-center brightness-75 hover:scale-110 transition-all duration-300"
                    />
                    <span className="absolute bottom-5 right-5 text-white">
                      {item.imageBy}
                    </span>
                    <span className="absolute top-0 left-0 text-white text-4xl px-28 pt-20">
                      {item.quote}
                    </span>
                  </div>
                </div>
              )}
              {item.id == 2 && (
               
               <>
               {/* second image */}
               <div className="relative md:h-[90vh] h-[50vh] overflow-hidden mt-28">
                 <img
                   src={HomeImgData[1].image}
                   alt=""
                   className="absolute brightness-75 top-0 transition-all duration-500 object-cover object-bottom w-[100vw] h-[50vh] md:h-[90vh] hover:scale-105"
                 />
             
                 <div className="absolute top-24 md:top-48 w-full flex flex-col items-center">
                   <span className="flex flex-col gap-5 items-center">
                     <span
                       className={`md:text-5xl mx-auto text-center font-bold text-white transition-all duration-500 ${
                         isPageLoaded
                           ? "translate-y-0 opacity-100"
                           : "-translate-y-10 opacity-0"
                       }`}
                     >
                       {HomeImgData[1].quote}
                     </span>
                     <button
                     onClick={() => navigate("/community-chat")}
                       className={`text-white text-xl px-10 py-3 font-medium bg-emerald-500 rounded-full hover:bg-black
                       transition-all duration-500 ${
                         isPageLoaded
                           ? "translate-y-0 opacity-100"
                           : "translate-y-10 opacity-0"
                       }`}
                     >
                       {HomeImgData[1].buttonText}
                     </button>
                   </span>
                 </div>
             
                 <span className="absolute text-white bottom-20 right-5">
                   {HomeImgData[1].photoBy}
                 </span>
             
                 {/* Top fade */}
                 <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-100 to-transparent"></div>
             
                 {/* Bottom fade */}
                 <div className="absolute bottom-0  left-0 w-full h-32 bg-gradient-to-t from-gray-100 to-transparent"></div>
               </div>
             </>
             
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
