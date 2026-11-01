'use client';

import { BadgeCheck, Hexagon, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import type { PointerEvent } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import styles from './CampusIdCard.module.css';

interface CampusIdCardProps {
  displayName: string;
  email: string;
  accountType: string;
  campusName: string;
  memberId: string;
  avatarUrl?: string;
  verified: boolean;
  qrCode: string;
}

export function CampusIdCard({
  displayName,
  email,
  accountType,
  campusName,
  memberId,
  avatarUrl,
  verified,
  qrCode,
}: CampusIdCardProps) {
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse') return;

    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    card.style.setProperty('--pointer-x', `${x}px`);
    card.style.setProperty('--pointer-y', `${y}px`);
    card.style.setProperty('--card-rotate-x', `${((y / bounds.height) - 0.5) * -6}deg`);
    card.style.setProperty('--card-rotate-y', `${((x / bounds.width) - 0.5) * 7}deg`);
  }

  function resetPointer(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty('--card-rotate-x', '0deg');
    event.currentTarget.style.setProperty('--card-rotate-y', '0deg');
  }

  return (
    <section
      id="student-id-card"
      className={styles.card}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      aria-label="Digital campus ID card"
    >
      <div className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandMark}><Hexagon size={21} strokeWidth={2.2} aria-hidden="true" /></span>
          <span>hivai</span>
        </div>
        <span className={styles.passLabel}>Campus pass <span aria-hidden="true">·</span> 01</span>
      </div>

      <div className={styles.content}>
        <Avatar src={avatarUrl} name={displayName} size="xl" className={styles.avatar} />
        <div className={styles.member}>
          <p className={styles.kicker}>MEMBER ID</p>
          <h2 className={styles.name}>{displayName}</h2>
          <p className={styles.role}>{accountType} <span aria-hidden="true">·</span> {campusName}</p>
          <p className={styles.email}>{email}</p>
        </div>
        <div className={styles.qrWrap}>
          {/* This QR contains only the member's HIVAI account ID. */}
          <Image
            className={styles.qrCode}
            src={qrCode}
            alt={`QR code for HIVAI member ID ${memberId}`}
            width={256}
            height={256}
            unoptimized
          />
          <span className={styles.qrCaption}>MEMBER QR</span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.memberCode}><ShieldCheck size={15} aria-hidden="true" /> HIVAI ID · {memberId}</span>
        <span className={styles.verification}>
          <BadgeCheck size={16} aria-hidden="true" />
          {verified ? 'Email verified' : 'Email unverified'}
        </span>
      </div>
    </section>
  );
}
