

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="w-full h-full bg-black/00 absolute top-0 left-0 flex items-center justify-center z-1 backdrop-blur-xs" onClick={onClose}>
      <div onClick={(e) => {e.stopPropagation()}}>
        { children }
      </div>
    </div>
  )
}
