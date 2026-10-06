import { useEffect, useState } from 'react'
import { AutoAwesomeRounded, CloseRounded } from '@mui/icons-material'
import { splitTitle } from '../lib/utils'

export default function Modal({ open, title, eyebrow, description, children, onClose, width = '720px' }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { if (open) requestAnimationFrame(() => setVisible(true)); else setVisible(false) }, [open])
  if (!open) return null
  const [head, accent] = splitTitle(title)
  return <div className={`modal-backdrop ${visible ? 'modal-visible' : ''}`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal-card" style={{ maxWidth: width }} role="dialog" aria-modal="true" aria-label={title}><div className="modal-head"><div>{eyebrow && <span className="banner-kicker"><AutoAwesomeRounded /> {eyebrow}</span>}<h2>{head && <>{head} </>}<em>{accent}</em></h2>{description && <p>{description}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><CloseRounded /></button></div><div className="modal-body">{children}</div></div></div>
}
