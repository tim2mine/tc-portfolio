import type { ComponentType } from 'react'
import type { Project } from '../../content/types'
import styles from './ProjectFolderWindow.module.css'

export function createProjectFolderWindow(project: Project): ComponentType {
  return function ProjectFolderWindow() {
    return (
      <div className={styles.body}>
        <p className={styles.summary}>{project.summary}</p>
        <div className={styles.metaRow}>
          <div className={styles.metaLabel}>Role:</div>
          <div>{project.role}</div>
        </div>
        <div className={styles.metaRow}>
          <div className={styles.metaLabel}>Stack:</div>
          <div>{project.stack}</div>
        </div>
        <div className={styles.filesLabel}>Files</div>
        {project.files.map((file) => (
          <div key={file.name} className={styles.file}>
            <span className={styles.fileIcon}>📄</span>
            <span className={styles.fileName}>{file.name}</span>
            <span className={styles.fileDescription}>— {file.description}</span>
          </div>
        ))}
      </div>
    )
  }
}
