import { useState } from "react"


const useDarkMode = () => {

    const [isDark, setIsDark] = useState(true)

  return [isDark, setIsDark]
}

export default useDarkMode