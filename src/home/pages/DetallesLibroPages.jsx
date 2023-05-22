import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { CBreadcrumb, CBreadcrumbItem, CButton, CCard, CCardImage, CCol, CContainer, CHeaderDivider, CListGroup, CListGroupItem, CRow, CSpinner } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import bibliotecaApi from '../../api/bibliotecaApi'
import { onAgregarLibroCarrito } from '../../store/prestamos/carritoSlice'
import { onOpenCarrito } from '../../store/ui/uiSlice'
import '../../assets/css/navbar.css'

export const DetallesLibroPages = () => {
    
    const [ libro, setLibro ] = useState(null)

    const { id } = useParams()

    const { carrito } = useSelector(state => state.carrito)

    const dispatch = useDispatch()

    useEffect(() => {
        buscarLibroPorId(id)
    }, [])

    const buscarLibroPorId = async(id) => {
        try {

            const {data} = await bibliotecaApi.get(`libros/buscarId?id_libro=${id}`)

            setLibro(data.data)
                    
        } catch (error) {
        
            console.error(error)
            
        }
    }

    const handleOpenCarrito = (libro) => {

        if(carrito.length < 2){
            
            dispatch(onAgregarLibroCarrito(libro))

        }

        dispatch(onOpenCarrito())
    }

    return (
        <>
            <CHeaderDivider/>
                <CContainer fluid >
                    <CBreadcrumb className='"m-0 ms-2 mt-3'>
                        <CBreadcrumbItem to='home'>Home</CBreadcrumbItem>
                        <CBreadcrumbItem active>Libros</CBreadcrumbItem>
                    </CBreadcrumb>
                </CContainer>
            <CContainer>
                <CRow>
                    {
                        (libro) ? (
                            <>
                                <CCol md={6} lg={3}>
                                    <CCard border="light">
                                        <CCardImage variant="top" src={`http://134.122.124.97/storage/${libro.url}`} />
                                        <CListGroup className="list-group-flush">
                                            <CListGroupItem>Categoría: {libro.categoria_libro}</CListGroupItem>
                                            <CListGroupItem>Páginas:</CListGroupItem>
                                            <CListGroupItem>Año:</CListGroupItem> 
                                        </CListGroup>
                                    </CCard>
                                </CCol>
                                <CCol md={6} lg={9}>
                                    <CRow>
                                        <h1>{libro.titulo_libro} - {libro.autor.label[0]}</h1>
                                    </CRow>
                                    <CRow>
                                        <CListGroup>
                                            <CListGroupItem><CButton color="danger" onClick={() => handleOpenCarrito(libro)}>Agregar <FontAwesomeIcon icon={faCartShopping}/></CButton></CListGroupItem>
                                        </CListGroup>
                                    </CRow>
                                    <CRow>
                                        <h3 className='mt-3'>Reseña "{libro.titulo_libro}": </h3>
                                        <h5 className='mt-2 text-secondary'>{libro.resena_libro}: </h5>
                                    </CRow>
                                </CCol>
                            </>
                        ) : (
                            <>
                                <CSpinner/>
                            </>
                        )
                    }
                </CRow>
            </CContainer>
        </>
    
    )
}
