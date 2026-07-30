import { resumeContent } from '../../content/resume'
import styles from './ResumeWindow.module.css'

export function ResumeWindow() {
  return (
    <>
      <div className={styles.menubar}>
        <span>File</span>
        <span>Edit</span>
        <span>Format</span>
        <span>Help</span>
      </div>
      <div className={styles.body}>
        {resumeContent.name.toUpperCase()}
        {'\n'}
        {resumeContent.title}
        {'\n\n'}
        EXPERIENCE
        {'\n'}
        {resumeContent.experience
          .map((entry) => `${entry.years}   ${entry.role}, ${entry.organization}`)
          .join('\n')}
        {'\n\n'}
        SKILLS
        {'\n'}
        {resumeContent.skills.join(', ')}
        {'\n\n'}
        EDUCATION
        {'\n'}
        {resumeContent.education}
        {'\n\n'}
        {resumeContent.resumePdfUrl ? (
          <a className={styles.downloadLink} href={resumeContent.resumePdfUrl}>
            [Download full resume as PDF]
          </a>
        ) : (
          '[TODO: add downloadable resume PDF]'
        )}
      </div>
    </>
  )
}
