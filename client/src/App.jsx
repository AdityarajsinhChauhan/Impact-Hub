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
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
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
  const [userLoaded, setUserLoaded] = useState(false);


  const location = useLocation();
  const navigate = useNavigate();

  const isProtectedRoute =
    location.pathname.startsWith("/chat") ||
    location.pathname.startsWith("/personal-chat") ||
    location.pathname.startsWith("/interactive-map");

  const shouldPreloadImages = !isProtectedRoute;

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

    // Use window.onload to ensure all images are rendered in the DOM
    window.onload = () => {
      setImagesLoaded(true);
    };
  
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  useEffect(() => {
    if (imagesLoaded && tokenLoaded) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [imagesLoaded, tokenLoaded, location.pathname]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setTokenLoaded(true);
  }, []);

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
      } finally {
        setUserLoaded(true); // ✅ Mark user check done
      }
    };
  
    if (token) {
      fetchUser();
    } else {
      setUserLoaded(true); // ✅ No token, so skip fetch
    }
  }, [token]);
  

  const hideNavbarFooter = location.pathname === "/auth" || location.pathname === "/auth/callback";
  const hideFooter =
    location.pathname.includes("/chat") ||
    location.pathname.includes("/personal-chat");

  return (
    <>
      {isLoading || !tokenLoaded || !userLoaded ? (
        <PreLoader />
      ) : (
        <>
          {!hideNavbarFooter && <Navbar active={active} setactive={setactive} />}
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/"
              element={<Home active={active} setactive={setactive} imagesLoaded={imagesLoaded} />}
            />
            <Route
              path="/chat/:discussionId"
              element={
                user ? (
                  <Chat active={active} setactive={setactive} user={user} setUser={setUser} setActivePersonalChat={setActivePersonalChat} activePersonalChat={activePersonalChat}/>
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/interactive-map"
              element={
                user ? (
                  <InteractiveMap active={active} setactive={setactive} activePersonalChat={activePersonalChat} setActivePersonalChat={setActivePersonalChat} />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/action-hub"
              element={
                user ? <ActionHub active={active} setactive={setactive} /> : <Navigate to="/auth" />
              }
            />
            <Route
              path="/find-your-passion"
              element={
                user ? (
                  <FindYourPassion active={active} setactive={setactive} />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/content-library"
              element={
                user ? (
                  <ContentLibrary active={active} setactive={setactive} />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/community-chat"
              element={
                user ? (
                  <CommunityChat active={active} setactive={setactive} setActivePersonalChat={setActivePersonalChat} activePersonalChat={activePersonalChat} user={user} setUser={setUser}/>
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/personal-chat"
              element={
                user ? (
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
