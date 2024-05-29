import { useEffect } from "react";

//This hook detects clicks outside of the specified component 
//and calls the provided handler function.
export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
     const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
  
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);  
}