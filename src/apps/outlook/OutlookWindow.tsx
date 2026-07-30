import { useState, type FormEvent } from 'react'
import { contactContent } from '../../content/contact'
import styles from './OutlookWindow.module.css'

const emailLink = contactContent.links.find((link) => link.label === 'Email')

export function OutlookWindow() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className={styles.body}>
      <div className={styles.toolbar}>New Message</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>To:</span>
          <span className={styles.fieldInput}>{emailLink?.value}</span>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="outlook-subject">
            Subject:
          </label>
          <input
            id="outlook-subject"
            className={styles.fieldInput}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What's this about?"
          />
        </div>
        <textarea
          className={styles.messageArea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message…"
        />
        <div className={styles.actions}>
          <button type="submit" className={styles.sendBtn}>
            Send
          </button>
          {submitted && (
            <span className={styles.status}>
              Sending isn't wired up yet — email me directly at{' '}
              <a href={emailLink?.href}>{emailLink?.value}</a> in the meantime.
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
