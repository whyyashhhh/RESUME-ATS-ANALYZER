import { Link, useLocation } from 'react-router-dom';

type SidebarProps = {
  onLogout?: () => void;
};

export function Sidebar({ onLogout }: SidebarProps) {

  const location = useLocation();


  const menu = [
    {
      name: 'DASHBOARD',
      path: '/dashboard'
    },
    {
      name: 'HISTORY',
      path: '/history'
    },
  ];


  return (

    <aside
      className="
      w-full
      max-w-xs
      bg-black
      border
      border-[#262626]
      p-6
      min-h-screen
      "
    >


      <div>


        <p
        className="
        text-xs
        tracking-[2px]
        text-gray-500
        uppercase
        "
        >
          AI RESUME SYSTEM
        </p>



        <h1
        className="
        mt-4
        text-3xl
        font-bold
        tracking-wide
        text-white
        uppercase
        "
        >
          ATS
          <br/>
          COPILOT
        </h1>



        <div
        className="
        mt-5
        h-[3px]
        w-20
        bg-gradient-to-r
        from-blue-600
        via-blue-400
        to-red-600
        "
        />



        <p
        className="
        mt-5
        text-sm
        leading-6
        text-[#aaa]
        "
        >
          AI powered resume intelligence platform.
          Analyze, optimize and improve your career profile.
        </p>


      </div>




      <nav
      className="
      mt-12
      grid
      gap-3
      "
      >


      {
        menu.map(item=>(


          <Link

          key={item.path}

          to={item.path}

          className={`
          
          px-4
          py-4
          border
          text-sm
          tracking-[1.5px]
          transition

          ${
            location.pathname === item.path

            ?

            'border-white text-white bg-[#1a1a1a]'

            :

            'border-[#262626] text-[#999] hover:text-white hover:border-white'

          }

          `}

          >

          {item.name}


          </Link>


        ))
      }





      <button

      onClick={onLogout}

      className="
      mt-4
      px-4
      py-4
      text-left
      border
      border-[#262626]
      text-[#999]
      text-sm
      tracking-[1.5px]
      hover:text-white
      hover:border-white
      transition
      "

      >

      LOGOUT

      </button>



      </nav>


    </aside>

  );

}