import { useCallback, useEffect, useRef, useState } from 'react'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export type LatLng = { lat: number; lng: number }

// Estado de São Paulo (centro e limites para o mapa)
const CENTRO_SP: [number, number] = [-22.3, -48.7]
const LIMITES_SP = L.latLngBounds([-26.0, -54.5], [-19.0, -43.0])

/**
 * Mapa Leaflet em que o usuário clica para marcar o local da ocorrência.
 * `ativo` indica se o elemento do mapa está na tela (some na tela de sucesso):
 * quando volta a ficar ativo, o mapa é recriado limpo.
 */
export function useMapaSelecao(ativo: boolean) {
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const pinRef = useRef<L.Marker | null>(null)
  const [ponto, setPonto] = useState<LatLng | null>(null)

  useEffect(() => {
    if (!ativo || !mapDivRef.current) return

    const map = L.map(mapDivRef.current, {
      maxBounds: LIMITES_SP,
      maxBoundsViscosity: 1,
      minZoom: 6,
    }).setView(CENTRO_SP, 6)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; contribuidores do OpenStreetMap',
    }).addTo(map)

    // Clicar marca (ou move) o local da ocorrência
    map.on('click', (e: L.LeafletMouseEvent) => {
      const p = { lat: e.latlng.lat, lng: e.latlng.lng }
      if (!pinRef.current) {
        const pin = L.marker([p.lat, p.lng], { draggable: true }).addTo(map)
        pin.on('dragend', () => {
          const ll = pin.getLatLng()
          setPonto({ lat: ll.lat, lng: ll.lng })
        })
        pinRef.current = pin
      } else {
        pinRef.current.setLatLng([p.lat, p.lng])
      }
      setPonto(p)
    })

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      pinRef.current = null
    }
  }, [ativo])

  /** Anima o mapa até as coordenadas. */
  const voarPara = useCallback((lat: number, lng: number, zoom = 12) => {
    mapRef.current?.flyTo([lat, lng], zoom)
  }, [])

  /** Remove o marcador e zera o ponto escolhido. */
  const limparMarcador = useCallback(() => {
    pinRef.current?.remove()
    pinRef.current = null
    setPonto(null)
  }, [])

  return { mapDivRef, ponto, voarPara, limparMarcador }
}
