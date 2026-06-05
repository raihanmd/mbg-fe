import React, { useEffect, useState } from 'react';

type ToasterProps = {
  error: Error | null;
};

export const Toaster = ({ error }: ToasterProps) => {
  const [visible, setVisible] = useState(false);
  const [currentError, setCurrentError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      setCurrentError(error);
      setVisible(true);
      
      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!visible || !currentError) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center p-4 w-full max-w-sm text-gray-400 bg-gray-900 rounded-lg shadow-lg border border-red-500/30 backdrop-blur-md" role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100/10 rounded-lg">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
        </svg>
      </div>
      <div className="ms-3 text-xl font-normal">
        <span className="mb-1 text-xl font-semibold text-white block">Error</span>
        <div className="text-sm font-normal">{currentError.message}</div>
      </div>
      <button 
        type="button" 
        className="ms-auto -mx-1.5 -my-1.5 bg-transparent text-gray-400 hover:text-white rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-800 inline-flex items-center justify-center h-8 w-8 transition-colors" 
        onClick={() => setVisible(false)}
      >
      </button>
    </div>
  );
};
