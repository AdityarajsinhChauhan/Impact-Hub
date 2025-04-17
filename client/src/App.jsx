import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PreLoader from "./components/PreLoader";
import Chat from "./pages/Chat";
import InteractiveMap from "./pages/InteractiveMap";
import ActionHub from "./pages/ActionHub";
import FindYourPassion from "./pages/FindYourPassion";
import ContentLibrary from "./pages/ContentLibrary";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Auth from "./pages/Auth";
import CommunityChat from "./pages/CommunityChat";
import PersonalChat from "./pages/PersonalChat";
import { getUser } from "./api/user";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [active, setactive] = useState("home");
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [token, setToken] = useState(null);
  const [activePersonalChat, setActivePersonalChat] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Protected routes skip image preloading
  const isProtectedRoute =
    location.pathname.startsWith("/chat") ||
    location.pathname.startsWith("/personal-chat") ||
    location.pathname.startsWith("/interactive-map");

  const shouldPreloadImages = !isProtectedRoute;

  // Preload images only for non-protected routes
  useEffect(() => {
    if (!shouldPreloadImages) {
      setImagesLoaded(true);
      return;
    }
  
    setImagesLoaded(false); // Reset loading state for new route
    setIsLoading(true);     // Show PreLoader
  
    const imagesToPreload = [
      "/ui-images/beach-cleaning.jpg",
      "/ui-images/hands-together.jpg",
      "/ui-images/action-hub.jpg",
      "/ui-images/chat.jpg",
      "/ui-images/content-library.jpg",
      "/ui-images/find-your-passion.jpg",
      "/ui-images/interactive-map.jpg",
    ];
  
    let loadedImages = 0;
    const total = imagesToPreload.length;
  
    const checkIfDone = () => {
      if (loadedImages === total) {
        setImagesLoaded(true);
      }
    };
  
    const timeout = setTimeout(() => {
      console.warn("Image preloading timed out.");
      setImagesLoaded(true);
    }, 5000);
  
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImages++;
        checkIfDone();
      };
      img.onerror = () => {
        console.warn("Image failed to load:", src);
        loadedImages++;
        checkIfDone();
      };
    });
  
    return () => clearTimeout(timeout);
  }, [location.pathname]); // 👈 this is the key
  

  // Preloader visible until images & token are ready
  useEffect(() => {
    if (imagesLoaded && tokenLoaded) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [imagesLoaded, tokenLoaded, location.pathname]);
  

  // Get token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setTokenLoaded(true);
  }, []);

  // Fetch user if token exists
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setUser(res);
      } catch (err) {
        console.error("User fetch failed", err);
        localStorage.removeItem("token");
        setToken(null);
        navigate("/auth");
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  // Navbar/Footer hiding logic
  const hideNavbarFooter = location.pathname === "/auth";
  const hideFooter =
    location.pathname.includes("/chat") ||
    location.pathname.includes("/personal-chat");
  

  return (
    <>
      {isLoading || !tokenLoaded ? (
        <PreLoader />
      ) : (
        <>
          {!hideNavbarFooter && <Navbar active={active} setactive={setactive} />}
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={<Home active={active} setactive={setactive} imagesLoaded={imagesLoaded} />}
            />
            <Route
              path="/chat/:discussionId"
              element={
                token ? (
                  <Chat active={active} setactive={setactive} user={user} setUser={setUser} setActivePersonalChat={setActivePersonalChat} activePersonalChat={activePersonalChat}/>
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/interactive-map"
              element={
                token ? (
                  <InteractiveMap active={active} setactive={setactive} />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/action-hub"
              element={
                token ? <ActionHub active={active} setactive={setactive} /> : <Navigate to="/auth" />
              }
            />
            <Route
              path="/find-your-passion"
              element={
                token ? (
                  <FindYourPassion active={active} setactive={setactive} />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/content-library"
              element={
                token ? (
                  <ContentLibrary active={active} setactive={setactive} />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/community-chat"
              element={
                token ? (
                  <CommunityChat active={active} setactive={setactive} setActivePersonalChat={setActivePersonalChat} activePersonalChat={activePersonalChat} user={user} setUser={setUser}/>
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/personal-chat"
              element={
                token ? (
                  <PersonalChat active={active} setactive={setactive} user={user} setUser={setUser} activePersonalChat={activePersonalChat} setActivePersonalChat={setActivePersonalChat}/>
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
          </Routes>
          {!hideNavbarFooter && !hideFooter && <Footer />}
        </>
      )}
    </>
  );
}

export default App;
