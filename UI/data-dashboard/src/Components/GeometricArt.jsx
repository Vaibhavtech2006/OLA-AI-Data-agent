import React from 'react';

export default function GeometricArt() {
  return (
    <div className="hidden md:block relative bg-white border-l border-gray-200 overflow-hidden min-h-[450px]">
      <div className="absolute top-16 left-24 w-16 h-16 bg-black rotate-12 rounded-lg shadow-sm"></div>
      <div className="absolute top-36 right-28 w-14 h-14 bg-black rotate-[-15deg] rounded-md"></div>
      <div className="absolute bottom-36 right-24 w-28 h-28 bg-black rotate-45 rounded-xl"></div>
      <div className="absolute top-28 right-44 w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[60px] border-red-500 rotate-12"></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-24 bg-[#5b92a5] rounded-full rotate-[-20deg] shadow-lg flex items-center justify-end pr-6">
        <div className="w-16 h-16 bg-white rounded-full shadow-inner"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-36 h-48 bg-red-500 rounded-tr-full"></div>
      <div className="absolute bottom-4 right-1/3 w-0 h-0 border-l-[45px] border-l-transparent border-r-[45px] border-r-transparent border-b-[80px] border-black rotate-[-15deg]"></div>
    </div>
  );
}