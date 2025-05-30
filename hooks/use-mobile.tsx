"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Función para verificar si la pantalla es móvil
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Verificar al cargar
    checkIfMobile()

    // Agregar listener para cambios de tamaño
    window.addEventListener("resize", checkIfMobile)

    // Limpiar listener
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return isMobile
}
