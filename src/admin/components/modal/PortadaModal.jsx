import { Modal, Button, Form } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { validaImagenes } from '../../../helpers/validarImagenes'
import { onClearLibros } from '../../../store/biblioteca/libroSlice'
import { startCambiarPortadaLibro } from '../../../store/biblioteca/thunk'
import { onCloseModalPortada } from '../../../store/ui/uiSlice'

export const PortadaModal = () => {

    const { initialLibro } = useSelector(state => state.libro)

    const { modalOpenPortada } = useSelector(state => state.ui)

    const dispatch = useDispatch()

    const {formState: { errors }, handleSubmit, setValue , control} = useForm({defaultValues: initialLibro})

    const onSubmit = ({id,idPortada,portadaLibro}) => {

        dispatch(startCambiarPortadaLibro(id, idPortada, portadaLibro))

    }

    const handleClose = () => {
        
        dispatch(onClearLibros())
        dispatch(onCloseModalPortada())

    }

    const handleFileChange = (name) => (e) => {

        const file = e.target.files[0]

        setValue(name, file)
        
    }

    return (
        <Modal size="xs" show={modalOpenPortada} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>Cambiar portada</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    <Form.Group>
                        <Controller 
                            control={control} 
                            name="id" 
                            defaultValue=""
                            render={({ field: { onChange, value, ref } }) => (
                                <Form.Control 
                                    onChange={onChange} 
                                    value={value} 
                                    ref={ref}  
                                    type="hidden" 
                                />
                            )}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Controller 
                            control={control} 
                            name="idPortada" 
                            defaultValue=""
                            render={({ field: { onChange, value, ref } }) => (
                                <Form.Control 
                                    onChange={onChange} 
                                    value={value} 
                                    ref={ref}  
                                    type="hidden" 
                                />
                            )}
                        />
                    </Form.Group>
                    <div className='d-flex justify-content-center align-items-center mb-3'>
                        {/* <img src={`http://localhost/biblioteca_vn_backend/storage/app/public/${initialLibro.url}`} alt="Portada del libro" width="200" /> */}
                        <img src={`http://134.122.124.97/storage/${initialLibro.url}`} alt="Portada del libro" width="200" />
                    </div>
                    <Form.Group>
                        <Form.Label>Subir imagen de portada</Form.Label>
                        <Controller 
                            control={control} 
                            name="portadaLibro" 
                            defaultValue=""
                            rules={{
                                required:{
                                    value: true,
                                    message: "Imagen de portada es obligatoria"
                                },
                                validate: {positive: v => validaImagenes(v,1) == true || 'Formato de imagen no válido. Solo se permiten archivos PNG, JPG y JPEG.'} 
                            }}
                            render={({ field: {ref } }) => (
                                <Form.Control 
                                    onChange={handleFileChange("portadaLibro")} 
                                    ref={ref}  
                                    type="file"
                                />
                            )}
                        />
                        {errors.portadaLibro && 
                            <Form.Text className="text-danger" variant='danger'>
                                {errors.portadaLibro.message}
                            </Form.Text> 
                        } 
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" type='submit'>
                        Cambiar Portada
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}
