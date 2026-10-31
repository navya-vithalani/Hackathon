'use client';

import { useRef, useState } from 'react';
import { Check, Plus, Send, Sparkles, Trash2, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import styles from '../../discovery.module.css';

interface Teammate {
  id: number;
}

export default function XplorerRegistrationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const nextMemberId = useRef(1);

  function addTeammate() {
    if (teammates.length >= 4) return;
    setTeammates((current) => [...current, { id: nextMemberId.current++ }]);
  }

  function removeTeammate(id: number) {
    setTeammates((current) => current.filter((teammate) => teammate.id !== id));
  }

  function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setTeammates([]);
    setIsOpen(false);
    setSubmitted(true);
  }

  return (
    <>
      <div id="register" className={styles.xplorerFloatingWrap}>
        <div className={styles.xplorerFloatingSparkle} aria-hidden="true"><Sparkles size={18} /></div>
        <div className={styles.xplorerFloatingCopy}>
          <strong>Good things are better in a group.</strong>
          <span>Bring your crew — up to 5 builders per team.</span>
        </div>
        <button type="button" onClick={() => setIsOpen(true)} className={styles.xplorerFloatingButton}>
          Register your team <Users size={17} aria-hidden="true" />
        </button>
      </div>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Bring your whole crew"
        size="lg"
        className={styles.xplorerRegistrationModal}
      >
        <div className={styles.xplorerModalIntro}>
          <span><Users size={17} /> GROUP REGISTRATION · UP TO 5 PEOPLE</span>
          <p>One team captain, up to four teammates. Flying solo? Register just yourself and we’ll help you meet your crew.</p>
        </div>

        <form onSubmit={submitRegistration} className={styles.xplorerRegistrationForm}>
          <label className={styles.xplorerFormField}>
            Team name
            <input required name="team" placeholder="Give your crew a name" />
          </label>

          <fieldset className={styles.xplorerCaptain}>
            <legend><span>01</span> Team captain</legend>
            <div className={styles.xplorerMemberFields}>
              <label className={styles.xplorerFormField}>
                Full name
                <input required name="captain-name" autoComplete="name" placeholder="e.g. Alex Sharma" />
              </label>
              <label className={styles.xplorerFormField}>
                Email address
                <input required type="email" name="captain-email" autoComplete="email" placeholder="you@college.edu" />
              </label>
              <label className={styles.xplorerFormField}>
                College
                <input required name="college" autoComplete="organization" defaultValue="Gatik Jr. College" />
              </label>
              <label className={styles.xplorerFormField}>
                Grade / year
                <input required name="captain-grade" placeholder="e.g. Grade 12" />
              </label>
              <label className={styles.xplorerFormField}>
                Your build vibe
                <select name="experience" defaultValue="curious">
                  <option value="curious">Curious beginner</option>
                  <option value="some">I’ve tried a few projects</option>
                  <option value="builder">I build things regularly</option>
                </select>
              </label>
            </div>
          </fieldset>

          {teammates.map((teammate, index) => (
            <fieldset key={teammate.id} className={styles.xplorerCaptain}>
              <legend><span>{String(index + 2).padStart(2, '0')}</span> Teammate {index + 1}</legend>
              <div className={styles.xplorerMemberFields}>
                <label className={styles.xplorerFormField}>
                  Full name
                  <input required name={`member-${teammate.id}-name`} autoComplete="name" placeholder="Teammate’s name" />
                </label>
                <label className={styles.xplorerFormField}>
                  Email address
                  <input required type="email" name={`member-${teammate.id}-email`} autoComplete="email" placeholder="teammate@college.edu" />
                </label>
                <label className={styles.xplorerFormField}>
                  Grade / year
                  <input required name={`member-${teammate.id}-grade`} placeholder="e.g. Grade 12" />
                </label>
                <button type="button" onClick={() => removeTeammate(teammate.id)} className={styles.xplorerRemoveMember}>
                  <Trash2 size={14} /> Remove teammate
                </button>
              </div>
            </fieldset>
          ))}

          <div className={styles.xplorerFormActions}>
            <button type="button" onClick={addTeammate} disabled={teammates.length >= 4} className={styles.xplorerAddMember}>
              <Plus size={16} /> {teammates.length >= 4 ? 'Team is full (5/5)' : `Add teammate (${teammates.length + 2}/5)`}
            </button>
            <p>Demo only — nothing is sent or saved.</p>
          </div>
          <Button type="submit" size="lg" className={styles.xplorerSubmitButton}><Send size={16} aria-hidden="true" /> Submit team registration</Button>
        </form>
      </Modal>

      {submitted && (
        <div role="status" aria-live="polite" className={`ai-result ${styles.xplorerToast}`}>
          <span className={styles.xplorerToastIcon}><Check size={18} aria-hidden="true" /></span>
          <span className={styles.xplorerToastCopy}><strong>Your team is on the Xplorer list!</strong><small>Demo confirmation only — no details were sent or stored.</small></span>
          <button type="button" aria-label="Dismiss confirmation" onClick={() => setSubmitted(false)}><X size={16} /></button>
        </div>
      )}
    </>
  );
}
