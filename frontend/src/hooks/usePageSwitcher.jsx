import { useState, useEffect } from 'react';
import Home from '../pages/home/Home/Home';
import Video from '../pages/home/Videos/Videos';
import Groups from '../pages/home/Groups/Groups';
import Marketplace from '../pages/home/Marketplace/Marketplace';
import Games from '../pages/home/Games/Games';

const usePageSwitcher = (defaultPage = 'home') => {
  // Retrieve the saved theme from localStorage or use the default theme
  const storedTheme = localStorage.getItem('page') || defaultPage;
  const [page, setPage] = useState(storedTheme);

  useEffect(() => {
    localStorage.setItem("page", page);
    
  }, [page]);

  const switchPage = (page) => {
    setPage(page);
  };

  const getCurrentPage = () => {
    return localStorage.getItem("page");
  };

  const getPageContent = () => {
    if (page === "home"){
      return <Home />
    }else if (page === "videos") {
      return <Video />
    }else if (page === "groups") {
      return <Groups />
    }else if (page === "marketplace") {
      return <Marketplace />
    }else if (page === "games") {
      return <Games />
    }else{
      return <Home />
    }
  };

  return {getPageContent, switchPage, getCurrentPage};
};

export default usePageSwitcher;