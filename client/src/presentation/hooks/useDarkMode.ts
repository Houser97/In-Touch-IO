import { useEffect, useState } from "react"


const useDarkMode = () => {

    const [isDark, setIsDark] = useState(() => {
        // Verifica si existe una variable en el Local Storage para determinar el valor inicial
        const localStorageValue = localStorage.getItem('isDark');
        return localStorageValue ? JSON.parse(localStorageValue) : true;
      });

    useEffect(() => {
        localStorage.setItem('isDark', JSON.stringify(isDark));
    }, [isDark]);

  return [isDark, setIsDark]
}

export default useDarkMode