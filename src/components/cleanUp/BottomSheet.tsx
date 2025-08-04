import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Backdrop = ({ onClick }: { onClick: () => void }) => (
  <motion.div
    className='fixed inset-0 bg-black/40 z-40'
    onClick={onClick}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  />
);

const BottomSheet: React.FC<Props> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClick={onClose} />
          <motion.div
            className='fixed w-[393px] bottom-0 left-0 right-0 bg-white z-[999] rounded-t-2xl p-5'
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className='mx-auto mb-10 h-1 w-16 rounded-full bg-gray-300 ' />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
