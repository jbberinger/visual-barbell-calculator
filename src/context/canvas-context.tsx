import React, { useState, createContext } from 'react'

export const CanvasContext = createContext<boolean | any>(undefined);

export const CanvasProvider = (props: any) => {
  const [shouldRedraw, setShouldRedraw] = useState(false);
  return (
    <CanvasContext.Provider
      value={[shouldRedraw, setShouldRedraw]}>
      {props.children}
    </CanvasContext.Provider>
  );
}