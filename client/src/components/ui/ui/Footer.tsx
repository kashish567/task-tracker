import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-purple-800 h-20 flex justify-center items-center text-white bottom-0 w-full">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Task Tracker. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;