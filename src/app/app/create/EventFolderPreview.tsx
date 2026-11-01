'use client';

import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { ImagePlus, RotateCcw } from 'lucide-react';
import styles from './EventFolderPreview.module.css';

type EventFolderPreviewProps = {
  title: string;
  eventType: string;
  eventLabel: string;
  date: string;
  venue: string;
};

type FolderStyle = CSSProperties & {
  '--folder-accent': string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
};

const categoryAccents: Record<string, string> = {
  sports: 'var(--color-success)',
  mun: 'var(--color-info)',
  cultural: 'var(--color-secondary)',
  hackathon: 'var(--color-accent)',
  workshop: 'var(--color-accent)',
  other: 'var(--color-accent)',
};

function formatEventDate(date: string) {
  if (!date) return 'DATE TO BE SET';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export default function EventFolderPreview({
  title,
  eventType,
  eventLabel,
  date,
  venue,
}: EventFolderPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [artwork, setArtwork] = useState<{ file: File; url: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const displayTitle = title.trim() || 'Your next big idea';
  const displayDate = formatEventDate(date);
  const folderStyle: FolderStyle = {
    '--folder-accent': categoryAccents[eventType] ?? 'var(--color-accent)',
  };

  useEffect(() => {
    if (!artwork) return;
    return () => URL.revokeObjectURL(artwork.url);
  }, [artwork]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !stage || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particles: Particle[] = Array.from({ length: 34 }, () => ({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      radius: Math.random() * 1.4 + 0.6,
      alpha: Math.random() * 0.35 + 0.16,
    }));
    const pointer = pointerRef.current;
    let width = 0;
    let height = 0;
    let frame = 0;
    let previousTime = 0;

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      particles.forEach((particle) => {
        particle.x = Math.random() * width;
        particle.y = Math.random() * height;
      });
    };

    const render = (time: number) => {
      const elapsed = Math.min((time - (previousTime || time)) / 16.67, 2);
      previousTime = time;
      context.clearRect(0, 0, width, height);

      for (let first = 0; first < particles.length; first += 1) {
        const particle = particles[first];
        for (let second = first + 1; second < particles.length; second += 1) {
          const neighbor = particles[second];
          const dx = particle.x - neighbor.x;
          const dy = particle.y - neighbor.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 84) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(neighbor.x, neighbor.y);
            context.strokeStyle = `rgba(210, 162, 78, ${(1 - distance / 84) * 0.16})`;
            context.lineWidth = 0.6;
            context.stroke();
          }
        }

        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 110) {
          const force = (1 - distance / 110) * 0.32;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }

        particle.vx *= 0.985;
        particle.vy *= 0.985;
        particle.x += particle.vx * elapsed;
        particle.y += particle.vy * elapsed;
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(210, 162, 78, ${particle.alpha})`;
        context.fill();
      }

      if (!reducedMotion) frame = window.requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    resize();
    render(0);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  function moveFolder(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    const pose = event.currentTarget.querySelector<HTMLElement>('[data-folder-pose]');
    if (pose) pose.style.transform = `rotateY(${-18 + x * 25}deg) rotateX(${8 - y * 20}deg)`;

    const canvasBounds = canvasRef.current?.getBoundingClientRect();
    if (canvasBounds) {
      pointerRef.current.x = event.clientX - canvasBounds.left;
      pointerRef.current.y = event.clientY - canvasBounds.top;
    }
  }

  function resetFolderPose(event: PointerEvent<HTMLDivElement>) {
    const pose = event.currentTarget.querySelector<HTMLElement>('[data-folder-pose]');
    if (pose) pose.style.transform = 'rotateY(-18deg) rotateX(8deg)';
    pointerRef.current.x = -1000;
    pointerRef.current.y = -1000;
  }

  function toggleCover() {
    setIsOpen((open) => !open);
  }

  function handleCoverKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleCover();
    }
  }

  function handleArtworkChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setArtwork(file ? { file, url: URL.createObjectURL(file) } : null);
  }

  function removeArtwork() {
    setArtwork(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <section className={styles.preview} aria-label="Interactive 3D event cover">
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Live event cover</p>
        <p className={styles.description}>A physical 3D file that updates as you shape your event.</p>
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        onPointerMove={moveFolder}
        onPointerLeave={resetFolderPose}
      >
        <div className={styles.ambientOrb} aria-hidden="true" />
        <canvas ref={canvasRef} className={styles.particles} aria-hidden="true" />
        <div className={styles.folderPose} data-folder-pose>
          <div className={styles.folder} style={folderStyle}>
            <div className={`${styles.face} ${styles.back}`} aria-hidden="true" />
            <div className={`${styles.face} ${styles.spine}`} aria-hidden="true">
              <span className={styles.spineBrand}>H / ARCHIVE</span>
              <span className={styles.spineTitle}>{displayTitle}</span>
              <span className={styles.spineCategory}>{eventLabel}</span>
            </div>
            <div className={`${styles.face} ${styles.foreEdge}`} aria-hidden="true" />
            <div className={`${styles.face} ${styles.topEdge}`} aria-hidden="true" />
            <div className={`${styles.face} ${styles.bottomEdge}`} aria-hidden="true" />

            <div className={styles.paperBlock} aria-hidden="true">
              <div className={styles.paperWriting}>
                <small>HIVAI / EVENT RECORD</small>
                <strong>{displayTitle}</strong>
                <span>{displayDate}</span>
                <span>{venue.trim() || 'VENUE TO BE CONFIRMED'}</span>
                <b>EVENT FILE</b>
              </div>
            </div>

            <div className={styles.coverHinge}>
              <div
                className={`${styles.coverLeaf} ${isOpen ? styles.open : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`${isOpen ? 'Close' : 'Open'} the 3D event cover`}
                aria-expanded={isOpen}
                onClick={toggleCover}
                onKeyDown={handleCoverKeyDown}
              >
                <div className={`${styles.face} ${styles.front}`}>
                  <span className={styles.folderTab}>{eventLabel}</span>
                  <span className={styles.clip} aria-hidden="true" />
                  <span className={styles.angledLabel}>{eventLabel} / FILE</span>
                  {artwork ? (
                    <div
                      className={styles.coverArtwork}
                      role="img"
                      aria-label={`Custom cover artwork for ${displayTitle}`}
                      style={{ backgroundImage: `url("${artwork.url}")` }}
                    />
                  ) : (
                    <div className={styles.proceduralArt} aria-hidden="true">
                      <i /><i /><i /><i />
                    </div>
                  )}
                  <div className={styles.coverPrint}>
                    <span className={styles.archiveNumber}>HIVAI / EVENT FILE</span>
                    <h3>{displayTitle}</h3>
                    <span className={styles.coverRule} />
                    <span className={styles.coverMeta}>{displayDate}</span>
                    <span className={styles.coverMeta}>{venue.trim() || 'VENUE TO BE CONFIRMED'}</span>
                    <span className={styles.statusStamp}>DRAFT</span>
                  </div>
                </div>
                <div className={`${styles.face} ${styles.coverInside}`} aria-hidden="true">
                  HIVAI ARCHIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.hint}>Move over the file to explore the 3D parallax, or open the cover.</p>
      <div className={styles.controls}>
        <label className={styles.uploadButton}>
          <ImagePlus size={16} aria-hidden="true" />
          <span>{artwork ? 'Change cover art' : 'Add cover art'}</span>
          <input
            ref={fileInputRef}
            className={styles.fileInput}
            type="file"
            accept="image/*"
            aria-label="Upload event cover artwork"
            onChange={handleArtworkChange}
          />
        </label>
        {artwork && (
          <button type="button" className={styles.textButton} onClick={removeArtwork}>
            <RotateCcw size={14} aria-hidden="true" />
            Remove
          </button>
        )}
        {artwork && <span className={styles.fileName}>{artwork.file.name}</span>}
      </div>
      <button type="button" className={styles.toggleButton} onClick={toggleCover}>
        {isOpen ? 'Close 3D cover' : 'Open 3D cover'}
      </button>
    </section>
  );
}
