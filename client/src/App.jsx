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
import Profile from "./pages/Profile";
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
  const [authReady, setAuthReady] = useState(false);


  const location = useLocation();
  const navigate = useNavigate();

  const isProtectedRoute =
    location.pathname.startsWith("/chat") ||
    location.pathname.startsWith("/personal-chat") ||
    location.pathname.startsWith("/interactive-map");

  const shouldPreloadImages = !isProtectedRoute;

  // Load token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Token from localStorage:", storedToken ? "Found" : "Not found");
    setToken(storedToken);
    setTokenLoaded(true);
  }, []);

  // After token is loaded, fetch user with a slight delay
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user data...");
        // Check if this is a fresh login
        const isFreshLogin = sessionStorage.getItem("freshLogin") === "true";
        
        if (isFreshLogin) {
          // For fresh logins, use a longer delay to ensure token is properly registered
          console.log("Fresh login detected - using longer delay before fetching user");
          await new Promise(resolve => setTimeout(resolve, 1200));
          sessionStorage.removeItem("freshLogin");
        } else {
          // For regular app loading, use a shorter delay
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const res = await getUser();
        console.log("User data fetched successfully");
        setUser(res);
        setAuthReady(true);
      } catch (err) {
        console.error("User fetch failed", err);
        localStorage.removeItem("token");
        setToken(null);
        setAuthReady(true);
        
        // Only navigate to auth if not already there
        if (!location.pathname.includes('/auth')) {
          navigate("/auth");
        }
      } finally {
        setUserLoaded(true);
      }
    };
  
    if (tokenLoaded) {
      if (token) {
        fetchUser();
      } else {
        setUserLoaded(true);
        setAuthReady(true);
      }
    }
  }, [token, tokenLoaded, navigate, location.pathname]);

  // Image preloading
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
    }, 10000);

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

  // Hide loader when everything is ready
  useEffect(() => {
    if (imagesLoaded && tokenLoaded && userLoaded) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [imagesLoaded, tokenLoaded, userLoaded, location.pathname]);

  // Handle login status change
  useEffect(() => {
    // If we're on a protected route but auth isn't ready, show loading
    if (isProtectedRoute && !authReady) {
      setIsLoading(true);
    }
  }, [isProtectedRoute, authReady, location.pathname]);

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
                authReady && user ? (
                  <Chat active={active} setactive={setactive} user={user} setUser={setUser} setActivePersonalChat={setActivePersonalChat} activePersonalChat={activePersonalChat}/>
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/interactive-map"
              element={
                authReady && user ? (
                  <InteractiveMap active={active} setactive={setactive} activePersonalChat={activePersonalChat} setActivePersonalChat={setActivePersonalChat} />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/action-hub"
              element={
                authReady && user ? <ActionHub active={active} setactive={setactive} /> : <Navigate to="/auth" />
              }
            />
            <Route
              path="/find-your-passion"
              element={
                authReady && user ? (
                  <FindYourPassion active={active} setactive={setactive} />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/content-library"
              element={
                authReady && user ? (
                  <ContentLibrary active={active} setactive={setactive} />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/community-chat"
              element={
                authReady && user ? (
                  <CommunityChat active={active} setactive={setactive} setActivePersonalChat={setActivePersonalChat} activePersonalChat={activePersonalChat} user={user} setUser={setUser}/>
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/personal-chat"
              element={
                authReady && user ? (
                  <PersonalChat active={active} setactive={setactive} user={user} setUser={setUser} activePersonalChat={activePersonalChat} setActivePersonalChat={setActivePersonalChat}/>
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/profile"
              element={
                authReady && user ? (
                  <Profile user={user} />
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
