/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
      'green-gradient': 'linear-gradient(to bottom, #78F4BD, #6BF1B4, #4AE99C, #20DF7F)', //초록 그라
      'lightblue-gradient': 'linear-gradient(to bottom, #4D83FD, #E0EAFF)', //그라데이션
      'darkblue-gradient':  'linear-gradient(to bottom, #061536, #113B9C)', //그라데2
      'bluegray-gradient': 'linear-gradient(to bottom, #949494, #96B6FF)', //HGR1
      'blue-gradient':'linear-gradient(to bottom, #4D83FD, #96B6FF)', //HGR3
      'hgr-gradient':'linear-gradient(to bottom, #D9D9D9, #A6C6FF)', //HGR3, 연한 HGR3
    },
      colors: {
          green:' #78F5BE', //c3
          gray :{
            default : ' #F9F9F9',//c4
            5:' #F6F6F6', //c5
            6:' #8E8E8E',//c6
            7:' #DEDEDE',//c7
            hover:' #797C82',//Dark:hover
            active:' #5A5D62',//Dark:active

          },
          blue : {
            default : ' #4D83FD',//c1
            8:' #E0EAFF',//c8
            '1-1' : '# E0EAFF',//c1-1
          },
          pink : ' #FA9EFA', //c2
        }
      },
  },
  plugins: [],
};
