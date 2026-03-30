import {useEffect} from "react";

export function EmergencyCheck() {
  useEffect(() => {
    console.log('✅ REACT IS RUNNING')
    console.log('Path:', window.location.pathname)
    console.log('Env:', import.meta.env.VITE_SUPABASE_URL ? 'Supabase SET' : 'MISSING')
    
    // Visual indicator
    const div = document.createElement('div')
    div.style.cssText = 'position:fixed;top:0;left:0;background:red;color:white;padding:10px;z-index:9999;font-size:12px'
    div.innerHTML = '🔴 REACT MOUNTED'
    document.body.appendChild(div)
  }, [])
  
  return null
}
