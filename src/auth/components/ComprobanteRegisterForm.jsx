import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { Form, Button, ProgressBar, Alert } from 'react-bootstrap'
import { startAgregarUsuario } from "../../store/auth/thunk"
import { CCard, CCardBody, CCardGroup } from "@coreui/react"
import Swal from 'sweetalert2'
import { validaImagenes } from "../../helpers/validarImagenes"

export const ComprobanteRegisterForm = ({ goBackPage }) => {
    
    const { initialUsuario } = useSelector(state => state.user)
    
    const dispatch =  useDispatch()

    const navigate = useNavigate()

    const { formState: { errors }, handleSubmit, setValue, control } = useForm()

    const onConfirmRegister = ({registroComproTransferencia, registroComproDomicilio}) => {

        const estadoUsuario = 2

        Swal.fire({
            title: '¿Estás seguro de querer registrarte?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, deseo registrarme',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(startAgregarUsuario({...initialUsuario, estadoUsuario, registroComproTransferencia, registroComproDomicilio}))
                navigate('/')
                Swal.fire(
                    '¡Felicidades!',
                    'Has sido registrado correctamente.',
                    'success'
                )
            }
        })

    };

    const handleFileChange = (name) => (e) => {

        const file = e.target.files[0]

        setValue(name, file)
        
    }
    
    return (
    
        <CCardGroup>
            <CCard className="p-4">
                <CCardBody>
                <ProgressBar className="mb-3" animated variant="primary" now={100} label={'Paso 3'}  />
                    <div className="text-center">
                        <h3>Datos de Tranferencia y Domicilio</h3>
                    </div>
                    <Alert variant="success">
                        <Alert.Heading>Datos de tranferencia</Alert.Heading>
                        <p className="mb-0">Banco: Banco de Chile</p>
                        <p className="mb-0">Tipo cuenta: Cuenta corriente</p>
                        <p className="mb-0">Número de cuenta: 9999999999</p>
                        <p className="mb-0">Correo: bibliotecavallenoble@gmail.com</p>
                    </Alert>
                    <Form onSubmit={handleSubmit(onConfirmRegister)}>  
                        <div>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Subir comprobante de transferencia</Form.Label>
                                <Controller 
                                    control={control} 
                                    name="registroComproTransferencia" 
                                    defaultValue=""
                                    rules={{
                                        required:{
                                            value: true,
                                            message: "Comprobante de transferencia es obligatorio"
                                        },
                                        validate: {positive: v => validaImagenes(v,1) == true || 'Formato de imagen no válido. Solo se permiten archivos PNG, JPG y JPEG.'} 
                                    }}
                                    render={({ field: { ref } }) => (
                                        <Form.Control 
                                            onChange={handleFileChange("registroComproTransferencia")} 
                                            ref={ref} 
                                            type="file" 
                                        />
                                    )}
                                />
                                {errors.registroComproTransferencia && 
                                    <Form.Text className="text-danger" variant='danger'>
                                        {errors.registroComproTransferencia.message}
                                    </Form.Text> 
                                }
                            </Form.Group>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Subir comprobante de domicilio o boleta de servicio</Form.Label>
                                <Controller 
                                    control={control} 
                                    name="registroComproDomicilio" 
                                    defaultValue=""
                                    rules={{
                                        required:{
                                            value: true,
                                            message: "Comprobante de domicilio es obligatorio"
                                        },
                                        validate: {positive: v => validaImagenes(v,1) == true || 'Formato de imagen no válido. Solo se permiten archivos PNG, JPG y JPEG.'} 
                                    }}
                                    render={({ field: { ref } }) => (
                                        <Form.Control 
                                            onChange={handleFileChange("registroComproDomicilio")} 
                                            ref={ref} 
                                            type="file" 
                                        />
                                    )}
                                />
                                {errors.registroComproDomicilio && 
                                    <Form.Text className="text-danger" variant='danger'>
                                        {errors.registroComproDomicilio.message}
                                    </Form.Text> 
                                }
                            </Form.Group>
                        </div>
                        <div className="d-flex justify-content-between">
                            <Button variant="danger" onClick={goBackPage}>Atrás</Button>
                            <Button variant="success" type="submit">Confirmar</Button>
                        </div>
                    </Form>
                </CCardBody>
            </CCard>
        </CCardGroup>

    )
}
