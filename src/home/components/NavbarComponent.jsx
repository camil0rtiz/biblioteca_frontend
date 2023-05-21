import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { CContainer, CCollapse, CNavbar, CNavbarToggler, CNavbarNav, CImage, CDropdownDivider, CNavbarBrand, CNavItem, CNavLink, CDropdown, CDropdownToggle, CAvatar, CDropdownMenu, CDropdownHeader, CDropdownItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilLockLocked } from '@coreui/icons'
import { startLogout } from '../../store/auth/thunk'
import { onOpenCarrito } from '../../store/ui/uiSlice'
import logo from '../../assets/img/bcnv.jpg'
import usuario from './../../assets/img/2.jpg'

export const NavbarComponent = () => {

    const [visible, setVisible] = useState(false)

    const { status, user } = useSelector(state => state.auth)

    const { carrito } = useSelector(state => state.carrito)

    const dispatch = useDispatch()

    const onClickLogout = () => {

        dispatch(startLogout())
        
    }

    const openCarrito = () => {

        dispatch(onOpenCarrito())

    }

    return (

        <>
            <CNavbar expand="lg" colorScheme="dark" className="bg-dark">
                <CContainer fluid>
                    <CNavbarBrand to="/home" component={NavLink}><CImage style={{ width: 50, height: 50}} src={logo}/> Biblioteca VN</CNavbarBrand>
                    <CNavbarToggler
                        aria-label="Toggle navigation"
                        aria-expanded={visible}
                        onClick={() => setVisible(!visible)}
                    />
                    <CCollapse className="navbar-collapse justify-content-between" visible={visible}>
                        <CNavbarNav className="me-auto mb-2 mb-lg-0">
                            <CNavItem>
                                <CNavLink to="/libros" component={NavLink}>
                                    Libros
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink to="/eventos" component={NavLink}>
                                    Eventos
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink to="#" component={NavLink}>
                                    <CIcon onClick={() => openCarrito()} icon={cilBell} size="lg" />
                                </CNavLink>
                            </CNavItem>
                        </CNavbarNav>
                        {
                            ( status == 'not-authenticated' ) ? 
                            ( 
                                <div>
                                    <CNavbarNav className="me-auto mb-2 mb-lg-0">
                                        <CNavItem>
                                            <CNavLink to="/auth/registro" component={NavLink}>
                                                Registrate
                                            </CNavLink>
                                        </CNavItem>
                                        <CNavItem>
                                            <CNavLink to="/auth/login" component={NavLink}>
                                                Iniciar Sesión
                                            </CNavLink>
                                        </CNavItem>
                                    </CNavbarNav>
                                </div>
                            ) : 
                            (
                                <div>
                                    <CNavbarNav className="me-auto mb-2 mb-lg-0">
                                        
                                    </CNavbarNav>
                                    <CDropdown variant="btn-group" direction="center">
                                        <CDropdownToggle color='dark' placement="bottom-end" className="py-0" caret={false}>
                                            <CAvatar src={usuario} size="md"/> Camilo Ortiz
                                        </CDropdownToggle>
                                        <CDropdownMenu className="pt-0" placement="bottom-end">
                                            <CDropdownHeader className="bg-light fw-semibold py-2">Cuenta</CDropdownHeader>
                                            <NavLink className="dropdown-item" to="/admin"><CIcon customClassName="icon me-2" icon={cilBell} className="me-2" />
                                                Ir a Admin
                                            </NavLink>
                                            <CDropdownDivider />
                                            <CDropdownItem href="#" onClick={() => handleLogout()}>
                                                <CIcon icon={cilLockLocked} className="me-2" />
                                                    Cerrar Sesión
                                            </CDropdownItem>
                                        </CDropdownMenu>
                                    </CDropdown>
                                </div>
                                
                                // <CButton onClick={onClickLogout} color="danger">Cerrar Sesión</CButton>
                            )
                        }
                    </CCollapse>
                </CContainer>
            </CNavbar>
        </>
    
    )
}
