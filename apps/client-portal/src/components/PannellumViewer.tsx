import { useEffect, useRef } from 'react';
import { withBasePath } from '../utils/basePath';

declare global {
  interface Window {
    pannellum: any;
  }
}

interface PannellumViewerProps {
  imageUrl: string;
  title?: string;
  autoRotate?: boolean;
  className?: string;
}

export function PannellumViewer({ 
  imageUrl, 
  title = "360° View",
  autoRotate = true,
  className = ""
}: PannellumViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const pannellumInstance = useRef<any>(null);

  useEffect(() => {
    // Carregar o CSS do Pannellum
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = withBasePath('/pannellum.css');
    document.head.appendChild(link);
    
    // Carregar o script do Pannellum dinamicamente
    const script = document.createElement('script');
    script.src = withBasePath('/pannellum.js');
    script.async = true;
    
    script.onload = () => {
      if (viewerRef.current && window.pannellum) {
        pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
          type: 'equirectangular',
          panorama: imageUrl,
          autoLoad: true,
          autoRotate: autoRotate ? -2 : 0, // Velocidade de rotação automática
          autoRotateInactivityDelay: 1000, // Retoma rotação após 1 segundo de inatividade
          autoRotateStopDelay: 3000, // Continua rotação mesmo após interação
          showControls: true,
          showFullscreenCtrl: true,
          showZoomCtrl: true,
          mouseZoom: true,
          doubleClickZoom: true,
          draggable: true,
          friction: 0.15,
          compass: false,
          hfov: 100, // Campo de visão horizontal inicial
          minHfov: 50,
          maxHfov: 120,
          pitch: 0,
          yaw: 0,
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup ao desmontar
      if (pannellumInstance.current && pannellumInstance.current.destroy) {
        pannellumInstance.current.destroy();
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [imageUrl, autoRotate, title]);

  return (
    <div 
      ref={viewerRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '500px' }}
    />
  );
}
