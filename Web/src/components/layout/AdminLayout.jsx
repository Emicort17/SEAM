
import React, {useState, useContext, useEffect, Suspense} from 'react';
import { slide as Menu } from 'react-burger-menu'
import { FiMenu } from "react-icons/fi";
import { useLocation, Outlet, Link } from 'react-router-dom';
import {Avatar, Navbar, Sidebar, Spinner} from 'flowbite-react';
import { FaUserDoctor } from "react-icons/fa6";
import { Dropdown } from 'flowbite-react';
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { PiUserListLight, PiUserCircleLight } from "react-icons/pi";
import { GoUpload } from "react-icons/go";
import { LogOutAlert } from '../../config/alerts/alert';

import AuthContext from '../../config/context/auth-context';

import '../../assets/adminlayout.css';
import welcomeImage from '../../assets/Images/welcomeImage.png';
import limon from '../../assets/Images/limon.png';


const AdminLayout = () => {
  const [showLemon, setShowLemon] = useState(false);
  const handleWelcomeImageClick = () => {
    setShowLemon(!showLemon);
  };

  const location = useLocation();
  const isRoot = location.pathname === '/';

  const [selectedSection, setSelectedSection] = useState('');
  const [userName, setUserName] = useState('');
  const [lastname, setLastname] = useState(``)
  const [middleName, setMiddleName] = useState('')
  const [role, setRole] = useState('')

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const { dispatch } = useContext(AuthContext);

  const Logout = async () => {
    try {
      const result = await LogOutAlert(); // Mostrar la alerta
      if (result.isConfirmed) { // Si el usuario confirmó la acción
        localStorage.removeItem('user'); // Eliminar el usuario del almacenamiento local
        dispatch({ type: 'SIGNOUT' }); // Realizar la acción de cerrar sesión
        <Link to={'/'}></Link>; // Redirigir al usuario a la página de inicio
      }
    } catch (error) {
      console.error(error);
    }
  };


  const loadUserName = async () => {
    try {
      // Simulando la carga de datos de sesión
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData = localStorage.getItem('user');

      if (userData) {
        const user = JSON.parse(userData);
        if (user && user.user) {
          if (user.user.user != null) {
            setUserName(user.user.user);
            setRole(user?.authorities[0]?.authority)
          } else {
            setRole(user?.authorities[0]?.authority)
            setUserName(user.user.personBean.name);
            setMiddleName(user.user.personBean.middleName)
            setLastname(user.user.personBean?.lastName)
          }
        }
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadUserName();
    };

    load();
  }, []);

  const [menuOpen, setMenuOpen] = useState(true);

  const handleClick = () => {
    setMenuOpen(!menuOpen)
  }
  return (
      <>
        <header>
          <Navbar style={{ backgroundColor: "#03104A", color: "#ffffff" }} fluid
                  className="fixed w-full z-20 top-0 start-0">
            <div className='ml-2'>
              <FiMenu onClick={handleClick} className="showSelection" name="menu" size={34}
                      style={{ cursor: 'pointer' }} />
            </div>
            <Navbar.Brand as={Link} className='showSelection'>
            <span
                className="self-center whitespace-nowrap text-xl font-semibold dark:text-white ml-1">SAEM</span>
            </Navbar.Brand>

            <Navbar.Collapse>

              <div className="flex md:order-2 ">
                <Dropdown

                    arrowIcon={false}
                    inline
                    label={
                      <Avatar
                          className='showSelection'
                          placeholderInitials={userName.charAt(0) + middleName?.charAt(0)}
                          rounded bordered color='gray' />
                    }

                    className="bg-neutral-800 rounded-xl  menuconfg">

                  <div className="contimg">

                    <Avatar
                        size='lg'
                        style={{ fontSize: '40px' }}
                        placeholderInitials={userName.charAt(0) + middleName?.charAt(0)}
                        rounded bordered color='gray' />

                  </div>

                  <div className="saludo">

                    {userName ? (
                        <p>¡Hola, {userName}!</p>
                    ) : (
                        <p>Cargando...</p>
                    )}

                  </div>

                  <div className="centrar">
                    <Suspense fallback={<Loading/>}>
                      {role !== 'ADMIN_ROLE' ? (
                          <Link to={'/gestionarCuenta'}>
                            <button className="menuconfgitem"><IoSettingsOutline size={25}
                                                                                 className="iconoseparacion" />
                              <p>Gestionar tu cuenta</p></button>
                          </Link>
                      ) : null}
                    </Suspense>
                    <Link>
                      <button className="menuconfgitem" onClick={Logout}><IoIosLogOut size={30}
                                                                                      className="iconoseparacion" />
                        <p>Cerrar sesión</p></button>
                    </Link>

                  </div>


                </Dropdown>
                <Navbar.Toggle />
              </div>
            </Navbar.Collapse>
          </Navbar>
        </header>

        <main>
          <aside>
            <Menu styles={styles}
                  noOverlay isOpen={menuOpen} disableCloseOnEsc>
              <Sidebar style={{height: "100vh"}} className="grid gap-y-7">
                <Sidebar.Items>
                  <Sidebar.ItemGroup className='flex flex-col space-y-4'>
                    {role === 'ADMIN_ROLE' ?
                        (<Suspense fallback={<Loading/>}>
                          <li className='showSelection'>
                            <Link
                                style={{backgroundColor: "#1C3344", color: "#ffff"}}
                                to={'medicos'}
                                onClick={() => handleSectionChange('medicos')}
                                className={` cursor-pointer flex items-center justify-center rounded-lg p-2 text-base font-normal opacity-10 ${selectedSection === 'medicos'
                                    ? 'text-zinc-950 bg-white font-bold'
                                    : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                                }`}
                            >
                              <FaUserDoctor
                                  className="h-6 w-6 flex-shrink-0 text-white transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"/>
                              <span className="px-3 flex-1 whitespace-nowrap">
                          Medicos
                        </span>
                            </Link>

                          </li>


                          <li className='showSelection'>
                            <Link style={{backgroundColor: "#1C3344", color: "#ffff"}}
                                  to={'Subirdatos'}
                                  onClick={() => handleSectionChange('Subirdatos')}
                                  className={`flex items-center justify-center rounded-lg p-2 text-base font-normal ${selectedSection === 'Subirdatos'
                                      ? 'text-zinc-950 bg-white font-bold'
                                      : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                                  }`}>
                              <GoUpload
                                  className="h-6 w-6 flex-shrink-0 text-white transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"/>
                              <span className="px-3 flex-1 whitespace-nowrap">
                        Subir datos
                      </span>
                            </Link>

                          </li>
                        </Suspense>) : (<li className='showSelection'>
                          <Link style={{backgroundColor: "#1C3344", color: "#ffff"}}
                                to={''}
                                onClick={() => handleSectionChange('')}
                                className={`flex items-center justify-center rounded-lg p-2 text-base font-normal ${selectedSection === ''
                                    ? 'text-zinc-950 bg-white font-bold'
                                    : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                                }`}>
                            <GoUpload
                                className="h-6 w-6 flex-shrink-0 text-white transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"/>
                            <span className="px-3 flex-1 whitespace-nowrap">
                        Seguimiento
                      </span>
                          </Link>

                        </li>)}
                    <li className='showSelection'>
                      <Link style={{backgroundColor: "#1C3344", color: "#ffff"}}
                            to={'pacientes'}
                            onClick={() => handleSectionChange('pacientes')}
                            className={`flex items-center justify-center rounded-lg p-2 text-base font-normal ${selectedSection === 'pacientes'
                                ? 'text-zinc-950 bg-white font-bold'
                                : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                            }`}>
                        <PiUserListLight
                            className="h-6 w-6 flex-shrink-0 text-white transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"/>
                        <span className="px-3 flex-1 whitespace-nowrap">
                        Pacientes
                      </span>
                      </Link>
                    </li>

                    <li className='md:hidden lg:hidden'>
                      <Dropdown

                          arrowIcon={false}
                          inline
                          label={
                            <Avatar
                                className='showSelection'
                                placeholderInitials={userName.charAt(0) + lastname?.charAt(0)}
                                rounded bordered>
                              <div className="space-y-1 font-medium dark:text-white">
                                <div>{`${userName} ${middleName} ${lastname}`}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Cuenta
                                </div>
                              </div>
                            </Avatar>
                          }

                          className="bg-neutral-800 rounded-xl  menuconfg">

                        <div className="contimg">

                          <img className="imgmenuconfig" alt="User settings"
                               src="src/assets/Images/Login.png"/>

                        </div>

                        <div className="saludo">

                          {userName ? (
                              <p>¡Hola, {userName}!</p>
                          ) : (
                              <p>Cargando...</p>
                          )}

                        </div>

                        <div className="centrar">
                          <Suspense fallback={<Loading/>}>
                            {role !== 'ADMIN_ROLE' ? (
                                <Link to={'/gestionarCuenta'}>
                                  <button className="menuconfgitem"><IoSettingsOutline size={25}
                                                                                       className="iconoseparacion"/>
                                    <p>Gestionar tu cuenta</p></button>
                                </Link>
                            ) : null}
                          </Suspense>
                          <Link>
                            <button className="menuconfgitem" onClick={Logout}><IoIosLogOut size={30}
                                                                                            className="iconoseparacion"/>
                              <p>Cerrar sesión</p></button>
                          </Link>

                        </div>


                      </Dropdown>
                    </li>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </Sidebar>
            </Menu>
          </aside>
          <section style={{marginTop: '50px', marginLeft: menuOpen ? '250px' : '0'}}>
            {isRoot ? (
                <div className="w-full flex justify-center items-center text-center pt-60">
                  <img
                      src={welcomeImage}
                      alt="Bienvenida"
                      style={{maxWidth: '100%', height: '100%'}}
                      onClick={handleWelcomeImageClick}
                  />
                  {showLemon && (
                      <img className="mt-3" src={limon} alt="Limon" style={{maxWidth: '100%', height: '100%'}}/>
                  )}
                </div>
            ) : (
                <Outlet/>
            )}
          </section>
        </main>
      </>
  );
};

export default AdminLayout;

const styles = {
  bmBurgerButton: {
    display: 'none'
  },
  bmBurgerBars: {
    background: 'white'
  },
  bmBurgerBarsHover: {
    background: '#a90000'
  },
  bmMenuWrap: {
    height: '100%',
    top: '60px',
    left: '0'
  }
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}