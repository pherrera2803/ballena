"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Facebook, Instagram, X, Menu, User, FileText, Phone, Mail, Rainbow } from "lucide-react"
import { useState, useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next")
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [scrollCooldown, setScrollCooldown] = useState(false)
  const isMobile = useMobile()
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Contenido de las páginas
  const pages = [
    { id: "inicio", title: "Inicio" },
    { id: "historia", title: "Historia" },
    { id: "ballenas", title: "Especies" },
    { id: "galeria", title: "Galería" },
    { id: "actuar", title: "Actuar" },
    { id: "contacto", title: "Contacto" },
  ]

  // Referencia al contenedor del libro
  const bookRef = useRef<HTMLDivElement>(null)

  // Función para navegar a la página siguiente
  const nextPage = () => {
    if (currentPage < pages.length - 1 && !isFlipping) {
      setFlipDirection("next")
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setIsFlipping(false)
      }, 800) // Duración de la animación aumentada
    }
  }

  // Función para navegar a la página anterior
  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection("prev")
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setIsFlipping(false)
      }, 800) // Duración de la animación aumentada
    }
  }

  // Función para navegar a una página específica
  const goToPage = (index: number) => {
    if (index === currentPage || isFlipping) return

    setFlipDirection(index > currentPage ? "next" : "prev")
    setIsFlipping(true)
    setTimeout(() => {
      setCurrentPage(index)
      setIsFlipping(false)
    }, 800)
  }

  // Funciones para manejar swipe en móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextPage() // Swipe izquierda = página siguiente
    }
    if (isRightSwipe) {
      prevPage() // Swipe derecha = página anterior
    }
  }

  // Función para manejar el evento de scroll
  const handleScroll = (e: WheelEvent) => {
    e.preventDefault() // Prevenir el scroll normal

    // Si estamos en periodo de enfriamiento, no hacemos nada
    if (scrollCooldown || isFlipping) return

    // Determinar la dirección del scroll
    if (e.deltaY > 0) {
      // Scroll hacia abajo - página siguiente
      nextPage()
    } else if (e.deltaY < 0) {
      // Scroll hacia arriba - página anterior
      prevPage()
    }

    // Establecer un periodo de enfriamiento para evitar múltiples cambios de página
    setScrollCooldown(true)
    setTimeout(() => {
      setScrollCooldown(false)
    }, 1000) // 1 segundo de cooldown
  }

  // Función para manejar las teclas de flecha
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextPage()
      } else if (e.key === "ArrowLeft") {
        prevPage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Añadir event listener para el scroll
    window.addEventListener("wheel", handleScroll, { passive: false })

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("wheel", handleScroll)
    }
  }, [currentPage, isFlipping, scrollCooldown])

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-ocean-gradient">
      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Burbujas animadas */}
        <div className="bubbles">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="bubble"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.1,
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
              }}
            />
          ))}
        </div>

        {/* Olas animadas */}
        <div className="ocean-waves">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-blue-900/80 backdrop-blur supports-[backdrop-filter]:bg-blue-900/60 text-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="relative w-10 h-10">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
            </div>
            <span className="flex items-center gap-2">
              Ballenas50
              <Rainbow className="h-5 w-5 rainbow-colors" />
            </span>
          </div>

          {/* Navegación de escritorio */}
          <nav className="hidden md:flex gap-6">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => goToPage(index)}
                className={cn(
                  "text-sm font-medium transition-colors",
                  currentPage === index ? "text-cyan-300 font-bold" : "hover:text-cyan-300",
                )}
              >
                {page.title}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button className="hidden md:flex bg-cyan-600 hover:bg-cyan-700">Dona ahora</Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden border-white text-white hover:bg-blue-800"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Menú móvil */}
        {showMobileMenu && (
          <div className="md:hidden bg-blue-900 py-4 px-6 border-t border-blue-800">
            <nav className="flex flex-col gap-4">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => {
                    goToPage(index)
                    setShowMobileMenu(false)
                  }}
                  className={cn(
                    "text-sm font-medium transition-colors text-left",
                    currentPage === index ? "text-cyan-300 font-bold" : "hover:text-cyan-300",
                  )}
                >
                  {page.title}
                </button>
              ))}
              <Button className="mt-2 bg-cyan-600 hover:bg-cyan-700">Dona ahora</Button>
            </nav>
          </div>
        )}
      </header>

      {/* Indicador de navegación por deslizamiento - justo debajo del header */}
      {isMobile && (
        <div className="w-full border-t border-white/20 bg-blue-900/60">
          <div className="flex justify-center py-2">
            <div className="scroll-indicator-mobile flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="text-white text-xs font-medium">Desliza</div>
              <div className="h-4 w-8 border border-white/70 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white/70 rounded-full animate-slide-horizontal"></div>
              </div>
              <div className="flex gap-1">
                <ArrowLeft className="h-3 w-3 text-white/70" />
                <ArrowRight className="h-3 w-3 text-white/70" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Libro principal */}
      <main className="flex-1 flex flex-col items-center justify-center relative py-2 md:py-8">
        {/* Indicador de navegación por scroll - solo para desktop */}
        {!isMobile && (
          <div className="scroll-indicator fixed top-1/2 right-8 transform -translate-y-1/2 flex flex-col items-center gap-4 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full">
            <div className="text-white text-xs font-medium mb-1">Scroll</div>
            <div className="w-6 h-12 border-2 border-white/70 rounded-full flex flex-col items-center justify-between p-1">
              <div className="w-3 h-3 bg-white/70 rounded-full animate-bounce-slow"></div>
            </div>
          </div>
        )}

        {/* Contenedor del libro */}
        <div
          ref={bookRef}
          className={cn(
            "book-container w-full max-w-7xl mx-auto my-1 md:my-4 relative",
            isFlipping ? `flipping ${flipDirection}` : "",
          )}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Página actual */}
          <div className="book-page current-page bg-white rounded-lg shadow-2xl p-6 md:p-10 relative overflow-hidden">
            {/* Textura de papel */}
            <div className="absolute inset-0 bg-paper-texture opacity-10 pointer-events-none" />

            {/* Contenido de la página */}
            {currentPage === 0 && (
              <div className="page-content flex flex-col">
                {/* Hero Section */}
                <div className="relative flex-1 flex flex-col items-center justify-center text-center">
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                      <source src="/placeholder.mp4" type="video/mp4" />
                      <Image
                        src="/placeholder.svg?height=800&width=1920"
                        alt="Ballena en el océano"
                        fill
                        className="object-cover"
                      />
                    </video>
                  </div>

                  <div className="relative z-10 max-w-3xl mx-auto p-6 space-y-6 text-white">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-float">
                      50 Años Protegiendo a las Ballenas
                    </h1>
                    <p className="text-xl md:text-2xl animate-float" style={{ animationDelay: "0.2s" }}>
                      Conmemorando cinco décadas desde la primera campaña de Greenpeace para salvar a estos majestuosos
                      gigantes de los océanos.
                    </p>
                    <div
                      className="flex flex-col sm:flex-row gap-4 pt-4 justify-center animate-float"
                      style={{ animationDelay: "0.4s" }}
                    >
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700"
                        onClick={() => goToPage(1)}
                      >
                        Conoce nuestra historia
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto bg-background/20 hover:bg-background/30 border-white text-white"
                        onClick={() => goToPage(4)}
                      >
                        Cómo ayudar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Número de página */}
                <div className="page-number mt-6 text-center text-sm text-slate-600">Página 1 de {pages.length}</div>
              </div>
            )}

            {currentPage === 1 && (
              <div className="page-content flex flex-col">
                {/* Historia Section */}
                <div className="flex-1">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-slate-800">
                      50 Años de Activismo
                    </h2>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                      En 1975, Greenpeace lanzó su primera campaña para proteger a las ballenas. Desde entonces, hemos
                      logrado avances significativos en la conservación de estos magníficos animales.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="relative">
                      <Image
                        src="/placeholder.svg?height=600&width=800"
                        alt="Primera campaña de Greenpeace"
                        width={800}
                        height={600}
                        className="rounded-lg shadow-lg"
                      />
                      {/* Elemento decorativo */}
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-cyan-500/20 rounded-full animate-pulse-slow" />
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-slate-800">La Primera Campaña</h3>
                        <p className="text-slate-700 leading-relaxed">
                          En 1975, un pequeño grupo de activistas se enfrentó a los balleneros soviéticos en el Pacífico
                          Norte, poniendo sus vidas en riesgo para salvar a las ballenas. Esta valiente acción marcó el
                          inicio de un movimiento global que cambiaría para siempre la forma en que el mundo ve la
                          conservación marina.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-slate-800">Logros Importantes</h3>
                        <p className="text-slate-700 leading-relaxed">
                          En 1982, se logró una moratoria internacional sobre la caza comercial de ballenas, que entró
                          en vigor en 1986. Este fue un hito crucial en la protección de estos mamíferos marinos,
                          salvando millones de vidas y permitiendo que las poblaciones comenzaran a recuperarse.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-slate-800">Desafíos Actuales</h3>
                        <p className="text-slate-700 leading-relaxed">
                          A pesar de los avances, las ballenas siguen enfrentando amenazas como la contaminación
                          plástica, el cambio climático, las colisiones con barcos, el ruido oceánico y la caza bajo
                          pretextos científicos en algunos países.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Número de página */}
                <div className="page-number mt-6 text-center text-sm text-slate-600">Página 2 de {pages.length}</div>
              </div>
            )}

            {currentPage === 2 && (
              <div className="page-content flex flex-col">
                {/* Ballenas Section - Con scroll mejorado */}
                <div className="flex-1 overflow-y-auto scrollable-content">
                  <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-2 md:mb-4 text-slate-800">
                      Especies en Peligro
                    </h2>
                    <p className="text-sm md:text-lg text-slate-600 max-w-3xl mx-auto">
                      Conoce las diferentes especies de ballenas que necesitan nuestra protección y los desafíos que
                      enfrentan en la actualidad.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pb-4">
                    {[
                      {
                        name: "Ballena Azul",
                        description: "El animal más grande que jamás haya existido, puede alcanzar hasta 30 metros.",
                        status: "En peligro",
                      },
                      {
                        name: "Ballena Jorobada",
                        description: "Conocida por sus saltos y cantos que pueden durar hasta 30 minutos.",
                        status: "Vulnerable",
                      },
                      {
                        name: "Ballena Franca",
                        description: "Una de las más amenazadas, con menos de 400 individuos en el Atlántico Norte.",
                        status: "En peligro crítico",
                      },
                      {
                        name: "Ballena Gris",
                        description: "Realiza migraciones de hasta 20,000 km al año entre zonas de alimentación.",
                        status: "En recuperación",
                      },
                      {
                        name: "Cachalote",
                        description: "Posee el cerebro más grande del reino animal y se sumerge hasta 2,000 metros.",
                        status: "Vulnerable",
                      },
                      {
                        name: "Ballena Sei",
                        description: "Una de las ballenas más rápidas, alcanza velocidades de hasta 50 km/h.",
                        status: "En peligro",
                      },
                    ].map((ballena, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow"
                      >
                        <div className="h-24 md:h-28 relative">
                          <Image
                            src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(ballena.name)}`}
                            alt={ballena.name}
                            fill
                            className="object-cover"
                          />
                          {/* Icono decorativo */}
                          <div className="absolute top-2 right-2 w-5 h-5 md:w-6 md:h-6 bg-white/80 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 md:w-4 md:h-4 whale-icon" />
                          </div>
                        </div>
                        <div className="p-2 md:p-3">
                          <div className="flex justify-between items-start mb-1 md:mb-2">
                            <h3 className="text-sm md:text-base font-bold text-slate-800">{ballena.name}</h3>
                            <span
                              className={`px-1 md:px-2 py-1 text-xs rounded-full ${
                                ballena.status === "En peligro crítico"
                                  ? "bg-red-100 text-red-800"
                                  : ballena.status === "En peligro"
                                    ? "bg-orange-100 text-orange-800"
                                    : ballena.status === "Vulnerable"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                              }`}
                            >
                              {ballena.status}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-slate-600">{ballena.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Número de página */}
                <div className="page-number mt-2 md:mt-4 text-center text-sm text-slate-600">
                  Página 3 de {pages.length}
                </div>
              </div>
            )}

            {currentPage === 3 && (
              <div className="page-content flex flex-col">
                {/* Galería Section */}
                <div className="flex-1">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-slate-800">
                      Galería de Imágenes
                    </h2>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                      Explora la belleza y majestuosidad de las ballenas a través de estas impresionantes fotografías.
                    </p>
                  </div>

                  {/* Collage de polaroids - Responsive mejorado */}
                  <div className="polaroid-collage relative max-w-5xl mx-auto">
                    {/* Layout para móviles y tablets */}
                    <div className="block md:hidden">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-2">
                        {Array.from({ length: 9 }).map((_, index) => (
                          <div
                            key={index}
                            className="polaroid-item transform transition-all duration-300 hover:scale-105"
                            style={{
                              transform: `rotate(${[-3, 2, -1, 3, -2, 1, -1, 2, -3][index]}deg)`,
                            }}
                            onClick={() => setSelectedImage(index)}
                          >
                            <div className="polaroid bg-white p-2 pb-8 shadow-md cursor-pointer w-full">
                              <div className="relative h-24 sm:h-32 w-full overflow-hidden">
                                <Image
                                  src={`/placeholder.svg?height=400&width=400&text=Ballena${index + 1}`}
                                  alt={`Imagen de ballena ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <p className="mt-1 text-center text-xs font-handwriting text-slate-700 truncate px-1">
                                {index % 3 === 0
                                  ? "Avistamiento en el Pacífico"
                                  : index % 3 === 1
                                    ? "Ballena saltando"
                                    : "Campaña de protección"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Layout para desktop */}
                    <div className="hidden md:block h-[500px]">
                      {Array.from({ length: 9 }).map((_, index) => {
                        // Posiciones aleatorias pero controladas para el collage
                        const positions = [
                          { top: "5%", left: "10%", zIndex: 3, rotate: -8 },
                          { top: "15%", left: "35%", zIndex: 5, rotate: 5 },
                          { top: "8%", left: "65%", zIndex: 2, rotate: -5 },
                          { top: "40%", left: "5%", zIndex: 4, rotate: 7 },
                          { top: "35%", left: "30%", zIndex: 6, rotate: -3 },
                          { top: "30%", left: "60%", zIndex: 1, rotate: 6 },
                          { top: "55%", left: "20%", zIndex: 7, rotate: -7 },
                          { top: "60%", left: "50%", zIndex: 8, rotate: 4 },
                          { top: "50%", left: "75%", zIndex: 9, rotate: -6 },
                        ]

                        const pos = positions[index]

                        return (
                          <div
                            key={index}
                            className="polaroid-item absolute transform transition-all duration-300 hover:z-50 hover:scale-110"
                            style={{
                              top: pos.top,
                              left: pos.left,
                              zIndex: pos.zIndex,
                              transform: `rotate(${pos.rotate}deg)`,
                            }}
                            onClick={() => setSelectedImage(index)}
                          >
                            <div className="polaroid bg-white p-2 pb-10 shadow-md w-44 cursor-pointer">
                              <div className="relative h-36 w-full overflow-hidden">
                                <Image
                                  src={`/placeholder.svg?height=400&width=400&text=Ballena${index + 1}`}
                                  alt={`Imagen de ballena ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <p className="mt-1 text-center text-sm font-handwriting text-slate-700 truncate px-1">
                                {index % 3 === 0
                                  ? "Avistamiento en el Pacífico"
                                  : index % 3 === 1
                                    ? "Ballena saltando"
                                    : "Campaña de protección"}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Número de página */}
                <div className="page-number mt-6 text-center text-sm text-slate-600">Página 4 de {pages.length}</div>
              </div>
            )}

            {currentPage === 4 && (
              <div className="page-content flex flex-col">
                {/* Call to Action - Contenido más compacto */}
                <div className="flex-1 flex flex-col overflow-y-auto scrollable-content">
                  <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-2 md:mb-4 text-slate-800">
                      Únete a la Causa
                    </h2>
                    <p className="text-base md:text-xl max-w-3xl mx-auto text-slate-700">
                      Después de 50 años de lucha, aún queda mucho por hacer. Tu apoyo es crucial para continuar
                      protegiendo a las ballenas para las generaciones futuras.
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-xl">
                      <div className="absolute inset-0 bg-cyan-700/80 z-10"></div>
                      <Image
                        src="/placeholder.svg?height=400&width=1200&text=Ayuda a las Ballenas"
                        alt="Ayuda a las ballenas"
                        width={1200}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      <div className="relative z-20 p-4 md:p-8 text-white text-center">
                        <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">¿Cómo puedes ayudar?</h3>
                        <p className="mb-4 md:mb-6 text-sm md:text-base">
                          Tu contribución puede marcar la diferencia en la protección de estos majestuosos animales.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 md:gap-4 max-w-lg mx-auto">
                          <Button
                            size="lg"
                            variant="outline"
                            className="w-full border-white text-white hover:bg-white/20 text-sm md:text-base h-10 md:h-12"
                          >
                            Donar ahora
                          </Button>
                          <Button
                            size="lg"
                            className="w-full bg-white text-cyan-700 hover:bg-gray-100 text-sm md:text-base h-10 md:h-12"
                          >
                            Voluntariado
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Contenido adicional para demostrar el scroll */}
                    <div className="mt-6 w-full max-w-2xl mx-auto">
                      <div className="bg-white/90 rounded-lg p-4 shadow-md">
                        <h4 className="text-lg font-bold mb-2 text-slate-800">Otras formas de ayudar</h4>
                        <ul className="space-y-2 text-sm text-slate-700">
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-cyan-100 p-1 mt-0.5">
                              <div className="w-3 h-3 whale-icon"></div>
                            </div>
                            <span>Comparte información sobre la conservación de ballenas en tus redes sociales</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-cyan-100 p-1 mt-0.5">
                              <div className="w-3 h-3 whale-icon"></div>
                            </div>
                            <span>Reduce tu consumo de plásticos de un solo uso que contaminan los océanos</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-cyan-100 p-1 mt-0.5">
                              <div className="w-3 h-3 whale-icon"></div>
                            </div>
                            <span>Participa en limpiezas de playas y costas en tu comunidad</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-cyan-100 p-1 mt-0.5">
                              <div className="w-3 h-3 whale-icon"></div>
                            </div>
                            <span>Apoya el turismo responsable de avistamiento de ballenas</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Número de página */}
                <div className="page-number mt-4 md:mt-6 text-center text-sm text-slate-600">
                  Página 5 de {pages.length}
                </div>
              </div>
            )}

            {currentPage === 5 && (
              <div className="page-content flex flex-col">
                {/* Contacto y Formulario - Mejorado para móviles */}
                <div className="flex-1 overflow-y-auto scrollable-content">
                  <div className="text-center mb-4 md:mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-2 md:mb-4 text-slate-800">
                      Únete a Nosotros
                    </h2>
                    <p className="text-sm md:text-lg text-slate-600 max-w-3xl mx-auto">
                      Firma nuestra petición para continuar protegiendo a las ballenas y mantente informado sobre
                      nuestras campañas.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-8 pb-4">
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border">
                      <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-slate-800">Firma la Petición</h3>
                      <p className="text-sm text-slate-600 mb-3 md:mb-4">
                        Tu firma es importante para continuar la lucha por la protección de las ballenas.
                      </p>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-2">
                              <User className="h-3 w-3 md:h-4 md:w-4" />
                              Nombre
                            </label>
                            <input
                              type="text"
                              placeholder="Nombre"
                              className="flex h-8 md:h-10 w-full rounded-md border border-input bg-background px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-2">
                              <User className="h-3 w-3 md:h-4 md:w-4" />
                              Apellido
                            </label>
                            <input
                              type="text"
                              placeholder="Apellido"
                              className="flex h-8 md:h-10 w-full rounded-md border border-input bg-background px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-2">
                            <FileText className="h-3 w-3 md:h-4 md:w-4" />
                            Documento de identidad
                          </label>
                          <input
                            type="text"
                            placeholder="Documento de identidad"
                            className="flex h-8 md:h-10 w-full rounded-md border border-input bg-background px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-2">
                            <Phone className="h-3 w-3 md:h-4 md:w-4" />
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            placeholder="Teléfono"
                            className="flex h-8 md:h-10 w-full rounded-md border border-input bg-background px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-2">
                            <Mail className="h-3 w-3 md:h-4 md:w-4" />
                            Correo electrónico
                          </label>
                          <input
                            type="email"
                            placeholder="Correo electrónico"
                            className="flex h-8 md:h-10 w-full rounded-md border border-input bg-background px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-sm h-8 md:h-10">
                          Firmar Petición
                        </Button>
                      </div>
                    </div>

                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border">
                      <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-slate-800">
                        Protege a las Ballenas
                      </h3>
                      <div className="relative mb-3 md:mb-4">
                        <Image
                          src="/placeholder.svg?height=200&width=400&text=Ballenas+Unidas"
                          alt="Ballenas nadando juntas"
                          width={400}
                          height={200}
                          className="w-full h-32 md:h-48 object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-sm text-slate-600 mb-3 md:mb-4">
                        Cada firma cuenta en nuestra misión de proteger a estos magníficos animales para las futuras
                        generaciones.
                      </p>

                      <h4 className="text-base md:text-lg font-bold mb-2 text-slate-800">Síguenos en Redes Sociales</h4>
                      <div className="flex gap-3 md:gap-4 mb-3 md:mb-4">
                        <Link
                          href="#"
                          className="flex items-center gap-1 md:gap-2 text-slate-600 hover:text-cyan-600 transition-colors"
                        >
                          <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                          <span className="text-xs md:text-sm">Instagram</span>
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center gap-1 md:gap-2 text-slate-600 hover:text-cyan-600 transition-colors"
                        >
                          <Facebook className="h-4 w-4 md:h-5 md:w-5" />
                          <span className="text-xs md:text-sm">Facebook</span>
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center gap-1 md:gap-2 text-slate-600 hover:text-cyan-600 transition-colors"
                        >
                          <X className="h-4 w-4 md:h-5 md:w-5" />
                          <span className="text-xs md:text-sm">Twitter</span>
                        </Link>
                      </div>

                      <h4 className="text-base md:text-lg font-bold mb-2 text-slate-800">Información de Contacto</h4>
                      <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-slate-600">
                        <li>Email: info@ballenas50.org</li>
                        <li>Teléfono: +34 123 456 789</li>
                        <li>Dirección: Calle del Mar 123, Barcelona</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Número de página */}
                <div className="page-number mt-2 md:mt-4 text-center text-sm text-slate-600">
                  Página 6 de {pages.length}
                </div>
              </div>
            )}

            {/* Esquina de la página (efecto de doblez) */}
            <div className="page-corner"></div>
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="navigation-controls container flex items-center justify-between py-2 z-10">
          <Button
            variant="outline"
            size="lg"
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            className="flex items-center gap-2 bg-cyan-100 hover:bg-cyan-200 border-cyan-300 text-cyan-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Página anterior</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={nextPage}
            disabled={currentPage === pages.length - 1 || isFlipping}
            className="flex items-center gap-2 bg-cyan-100 hover:bg-cyan-200 border-cyan-300 text-cyan-800"
          >
            <span className="hidden sm:inline">Página siguiente</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Indicador de páginas */}
        <div className="page-indicator container flex justify-center gap-2 py-2 z-10">
          {pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => goToPage(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                currentPage === index ? "bg-cyan-400 scale-125" : "bg-white/70 hover:bg-white",
              )}
              aria-label={`Ir a la página ${page.title}`}
              disabled={isFlipping}
            />
          ))}
        </div>
      </main>

      {/* Image Modal */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <div className="relative w-full h-full">
            {selectedImage !== null && (
              <Image
                src={`/placeholder.svg?height=800&width=800&text=Ballena${selectedImage + 1}`}
                alt={`Imagen ampliada de ballena ${selectedImage + 1}`}
                width={800}
                height={800}
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer minimalista */}
      <footer className="bg-blue-900 py-4 text-center text-sm text-white/80">
        <div className="container">
          <p>© {new Date().getFullYear()} Ballenas50. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
