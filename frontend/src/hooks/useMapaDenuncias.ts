import { useCallback, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { DenunciaMapa } from '../services/denunciasPublicas'

/**
 * Mapa Leaflet da tela pública: cria o mapa uma vez, desenha um marcador por denúncia
 * (colorido pelo status) e expõe `localizar` para centralizar numa denúncia.
 * `cores` e `rotulosStatus` devem ser constantes (referência estável).
 */
export function useMapaDenuncias(
  pontos: DenunciaMapa[],
  cores: Record<string, string>,
  rotulosStatus: Record<string, string>,
) {
  const mapaRef = useRef<HTMLDivElement>(null)
  const instanciaMapa = useRef<L.Map | null>(null)
  const camadaMarcadores = useRef<L.LayerGroup | null>(null)
  const marcadores = useRef<Map<string, L.CircleMarker>>(new Map())

  // Inicializa o mapa uma única vez.
  useEffect(() => {
    if (!mapaRef.current || instanciaMapa.current) return

    const mapa = L.map(mapaRef.current).setView([-14.235, -51.925], 4)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapa)

    instanciaMapa.current = mapa
    camadaMarcadores.current = L.layerGroup().addTo(mapa)

    const timer = window.setTimeout(() => mapa.invalidateSize(), 200)
    const marcadoresAtuais = marcadores.current

    return () => {
      window.clearTimeout(timer)
      mapa.remove()
      instanciaMapa.current = null
      camadaMarcadores.current = null
      marcadoresAtuais.clear()
    }
  }, [])

  // Atualiza os marcadores sempre que a lista de pontos mudar.
  useEffect(() => {
    const mapa = instanciaMapa.current
    const camada = camadaMarcadores.current
    if (!mapa || !camada) return

    camada.clearLayers()
    marcadores.current.clear()

    const coords: L.LatLngExpression[] = []

    pontos.forEach((d) => {
      if (d.lat === null || d.lng === null) return

      const marcador = L.circleMarker([d.lat, d.lng], {
        radius: 8,
        color: '#ffffff',
        weight: 2,
        fillColor: cores[d.status] ?? '#64748b',
        fillOpacity: 0.95,
      })

      // Popup montado com textContent (evita injetar HTML vindo do banco)
      const popup = document.createElement('div')
      const titulo = document.createElement('strong')
      titulo.textContent = d.titulo

      const protocolo = document.createElement('p')
      protocolo.textContent = `Protocolo: ${d.protocolo}`

      const local = document.createElement('p')
      local.textContent = `${d.comunidade ? `${d.comunidade}, ` : ''}${d.municipio}`

      const situacao = document.createElement('p')
      situacao.textContent = `Status: ${rotulosStatus[d.status] ?? d.status}`

      popup.append(titulo, protocolo, local, situacao)
      marcador.bindPopup(popup)
      marcador.addTo(camada)

      marcadores.current.set(d.id, marcador)
      coords.push([d.lat, d.lng])
    })

    if (coords.length > 1) {
      mapa.fitBounds(L.latLngBounds(coords), { padding: [30, 30], maxZoom: 13 })
    } else if (coords.length === 1) {
      mapa.setView(coords[0], 13)
    }
  }, [pontos, cores, rotulosStatus])

  /** Centraliza o mapa na denúncia e abre o popup dela. */
  const localizar = useCallback((d: DenunciaMapa) => {
    const marcador = marcadores.current.get(d.id)
    const mapa = instanciaMapa.current
    if (!marcador || !mapa || d.lat === null || d.lng === null) return

    mapa.setView([d.lat, d.lng], 15)
    marcador.openPopup()
  }, [])

  return { mapaRef, localizar }
}
