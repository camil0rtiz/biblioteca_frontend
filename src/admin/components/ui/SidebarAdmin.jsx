import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { CAvatar, CNavGroup, CNavItem, CNavTitle, CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPuzzle, cilHome, cilUser, cilBook, cilCart, cilWindowMaximize } from '@coreui/icons'
import { onCloseSidebar } from '../../../store/ui/uiSlice'
import logo from './../../../assets/img/bcnv.jpg'

export const SidebarAdmin = () => {

    const { user } = useSelector(state => state.auth)

    const { sidebarAdmin } = useSelector(state => state.ui)

    const dispatch = useDispatch()

    const handleSidebar = () => {

        dispatch(onCloseSidebar())

    }

    return (

        <CSidebar
            position="fixed"
            visible={sidebarAdmin}
        >
            <CSidebarBrand><CAvatar className='mx-2' src={logo} size="md"/>Biblioteca VN</CSidebarBrand>
            <CSidebarNav>
                <CNavTitle>Perfil : {user.tipo_rol} </CNavTitle>
                <CNavItem to='home' component={NavLink}>
                    <CIcon customClassName="nav-icon" icon={cilHome} />
                    Inicio
                </CNavItem>
                {
                    ((user.tipo_rol == 'Bibliotecario') || (user.tipo_rol == 'Administrador')) && (
                        <>             
                            <CNavGroup toggler={<><CIcon customClassName="nav-icon" icon={cilUser} /> Usuarios</>}>
                                <NavLink className="nav-link" to="usuarios"><CIcon customClassName="nav-icon" icon={cilPuzzle} />Usuarios</NavLink>
                            </CNavGroup>
                            <CNavGroup toggler={<><CIcon customClassName="nav-icon" icon={cilBook} /> Libros</>}>
                                <NavLink className="nav-link" to="libros"><CIcon customClassName="nav-icon" icon={cilPuzzle} />Libros</NavLink>
                                <NavLink className="nav-link" to="editoriales"><CIcon customClassName="nav-icon" icon={cilPuzzle} />Editoriales</NavLink>
                                <NavLink className="nav-link" to="autores"><CIcon customClassName="nav-icon" icon={cilPuzzle} />Autores</NavLink>
                            </CNavGroup>
                            <CNavGroup toggler={<><CIcon customClassName="nav-icon" icon={cilWindowMaximize} /> Eventos y noticias</>}>
                                <NavLink className="nav-link" to="eventos"><CIcon customClassName="nav-icon" icon={cilPuzzle} />Eventos</NavLink>
                            </CNavGroup>
                        </>
                    )
                }
                {
                    (user.tipo_rol === 'Voluntario') && (
                        <>             
                            <CNavGroup toggler={<><CIcon customClassName="nav-icon" icon={cilBook} /> Libros</>}>
                                <NavLink className="nav-link" to="libros"><CIcon customClassName="nav-icon" icon={cilPuzzle} />Libros</NavLink>
                            </CNavGroup>
                        </>
                    )
                }
                <CNavGroup toggler={<><CIcon customClassName="nav-icon" icon={cilCart} /> Prestamos y Reservas</>}>
                    <NavLink className="nav-link" to="reservas"><CIcon customClassName="nav-icon" icon={cilPuzzle} />Reservas</NavLink>
                    <NavLink className="nav-link" to="prestamos"><CIcon customClassName="nav-icon" icon={cilPuzzle} />Prestamos</NavLink>
                </CNavGroup>
            </CSidebarNav>
            <CSidebarToggler
                className="d-none d-lg-flex" 
                onClick={() => handleSidebar()}
            />
        </CSidebar>
    )
}
