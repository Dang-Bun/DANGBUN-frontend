import React from 'react';
import ReactModal from 'react-modal';
import Button from '../button/PopUpButton';
import UploadIcon from '../../assets/home/upload.svg';
import UpLoad from '../home/UpLoad';

interface UpLoadPopUpProps {
  isOpen: boolean;
  onRequestClose: () => void;

  title?: React.ReactNode;
  descript?: React.ReactNode;

  onCancel?: () => void;
  onConfirm?: (file: File) => void;
}

const UpLoadPopUp: React.FC<UpLoadPopUpProps> = ({
  isOpen,
  onRequestClose,
  title = (
    <>
      ‘청소 이름’ 완료를 위해
      <br />
      사진을 업로드 해주세요.
    </>
  ),
  descript,
  onCancel,
  onConfirm,
}) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const galleryRef = React.useRef<HTMLInputElement | null>(null);
  const cameraRef = React.useRef<HTMLInputElement | null>(null);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const handleFilePicked = (f: File | null) => {
    setFile(f || null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleFilePicked(f);
  };

  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(null);
    setMenuOpen(false);
    onRequestClose();
  };

  const handleCancel = () => {
    onCancel?.();
    handleClose();
  };

  const handleConfirm = () => {
    if (!file) return;
    onConfirm?.(file);
    handleClose();
  };

  const handleSelect = (type: 'low' | 'high') => {
    if (type === 'low') galleryRef.current?.click();
    if (type === 'high') cameraRef.current?.click();
    closeMenu();
  };

  React.useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(t) &&
        anchorRef.current &&
        !anchorRef.current.contains(t)
      ) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [menuOpen]);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleClose}
      ariaHideApp={false}
      className='flex justify-center items-center h-screen'
      overlayClassName='fixed inset-0 w-[393px] h-screen mx-auto bg-black/60 z-50 flex justify-center items-center'
    >
      <div
        className='relative flex flex-col justify-center items-center w-[306px] pt-8 pb-8 bg-[#fff] rounded-[8px] whitespace-pre-line'
        style={{ boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.05)' }}
      >
        <h2 className='text-[16px] font-[600] text-center'>{title}</h2>
        {descript && (
          <p className='!mt-3 text-[12px] font-[400] text-[#8e8e8e] text-center'>
            {descript}
          </p>
        )}

        <div ref={anchorRef} className='relative mt-6'>
          <button
            type='button'
            onClick={openMenu}
            className=' w-[120px] h-[120px] rounded-full flex items-center justify-center overflow-hidden'
            aria-label='사진 업로드 옵션 열기'
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt='미리보기'
                className='object-cover w-full h-full'
              />
            ) : (
              <img
                src={UploadIcon}
                alt='업로드 아이콘'
                className='w-[120px] h-[120px]'
              />
            )}
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className='absolute right-[-120px] bottom-[20px] translate-y-full z-10'
            >
              <UpLoad onSelect={handleSelect} />
            </div>
          )}
        </div>

        <input
          ref={galleryRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleChange}
        />
        <input
          ref={cameraRef}
          type='file'
          accept='image/*'
          capture='environment'
          className='hidden'
          onChange={handleChange}
        />

        <div className='flex flex-row items-center w-[263px] mt-7 justify-between'>
          <Button variant='gray' onClick={handleCancel}>
            취소
          </Button>

          <Button
            variant={file ? 'blue' : 'thickGray'}
            style={{ cursor: file ? 'pointer' : 'default' }}
            onClick={handleConfirm}
          >
            완료
          </Button>
        </div>
      </div>
    </ReactModal>
  );
};

export default UpLoadPopUp;
