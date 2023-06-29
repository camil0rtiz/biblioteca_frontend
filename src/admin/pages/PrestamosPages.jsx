import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CCard, CCardHeader, CCol, CContainer, CRow, CCardBody, CButton } from '@coreui/react'
import { FiltroComponent } from '../components/FiltroComponent'
import DataTable from 'react-data-table-component'
import { startListarPrestamos } from '../../store/prestamos/thunk'

const paginacionOpciones = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
}

export const PrestamosPages = () => {
    
    const [ filterText, setFilterText ] = useState('')

    const { prestamos } = useSelector(state => state.prestamo)

    const dispatch = useDispatch()

    console.log(prestamos);

    useEffect(() => {

        dispatch(startListarPrestamos())
        
    }, [])

    const handleDevolucionLibro = () => {

    }

    const columns = [
        
        {
            name: 'Rut usuario',
            selector: row => row.rut_usuario,
            sortable: true,
        },
        {
            name: 'Nombre',
            selector: row => row.nombre_usuario,
            sortable: true,
        },
        {
            name: 'Título libro',
            selector: row => row.titulo_libro,
            sortable: true,
        },
        {
            name: 'Dewey',
            selector: row => row.dewey_unic_ejemplar,
            sortable: true,
        },
        {
            name: 'Fecha prestamo',
            selector: row => row.fecha_prestamo,
            sortable: true,
        },
        {
            name: 'Fecha devolución',
            selector: row => row.fecha_entrega_prestamo,
            sortable: true,
        },
        {
            name: 'Estado prestamo',
            selector: row => row.estado_prestamo,
            sortable: true,
        },
        {
            name: 'Acciones',
            button: true,
            cell: (data) => <div className='d-flex justify-content-between'>
                                <div className="mx-2">
                                    <CButton color="primary" onClick={() => handleDevolucionLibro()}>
                                        Devolución
                                    </CButton>
                                </div>
                            </div>,
            width: "250px" 
        }, 
    ];

    return (
        <CContainer lg>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Prestamos</strong> 
                        </CCardHeader>
                        <CCardBody>
                            <DataTable
                                title="Tabla libros prestados"
                                responsive
                                pagination
                                columns={columns}
                                data={prestamos}
                                highlightOnHover={true}
                                paginationComponentOptions={paginacionOpciones}
                                noDataComponent={<span className='mt-4'>No se encontro ningún elemento</span>}
                                fixedHeader
                                fixedHeaderScrollHeight="600px"
                                persistTableHead
                                striped
                                subHeader
                                subHeaderComponent={<FiltroComponent onFilter={e => setFilterText(e.target.value)} filterText={filterText} onPlaceholder={'Filtra por nombre'} />}
                                // actions={ <AccionesTable onExport={usersPendientes} onNombreBoton={'Agregar Autor'} />}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    )
}
