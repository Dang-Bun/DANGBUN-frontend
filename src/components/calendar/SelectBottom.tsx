import React from 'react'
import grayBar from '../../assets/grayBar.svg';

const SelectBottom = () => {
  return (
    <div className='h-[212px] gapx-[18px] bg-white rounded-[24px] flex flex-col items-center justify-center '>
        <img src={grayBar} alt="바" className='pt-[20px]'/>
        <div className='flex flex-col p-[18px]'>
            <div>
                <p className='p-[10px] flex justify-center'>사진 보기</p>
                <div className='w-[339px] h-[1px] bg-[#DEDEDE]'></div>
            </div>
            <div>
                <p className='p-[10px] flex justify-center'>해당 청소 정보</p>
                <div className='w-[339px] h-[1px] bg-[#DEDEDE]'></div>
            </div>
            <div>
                <p className='p-[10px] flex justify-center'>체크리스트에서 청소 삭제</p>
            </div>
        </div>
    </div>
  )
}
export default SelectBottom