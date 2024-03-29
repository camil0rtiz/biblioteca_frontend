import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm, Controller } from 'react-hook-form'
import ReactSelect from "react-select"
import { Modal ,Button, Form, InputGroup, Alert } from 'react-bootstrap'
import { onCloseModal } from "../../../store/ui/uiSlice"
import { validaRut } from "../../../helpers/validarRut"
import { startActualizarUsuario, startAgregarUsuario } from "../../../store/auth/thunk"
import { onClearMessageErrorUser, onClearUser } from "../../../store/auth/userSlice"
import bibliotecaApi from "../../../api/bibliotecaApi"
import { formateoRut } from "../../../helpers/formateoRut"
import { customStyles } from '../../../helpers/customStyles.js'
import { formateoMayusculas, formateoMinusculas } from "../../../helpers/formateoMayusculas"
import { validarFecha } from "../../../helpers/validarFecha"
import { validarNumeroEnRango } from "../../../helpers/validarNumeroEnRango"

export const UsuariosModal = () => {

    const [membresia, setMembresia] = useState([])

    const [roles, setRoles] = useState([])

    const { modalOpen } = useSelector(state => state.ui)

    const { initialUsuario, errorMessage } = useSelector(state => state.user)

    const dispatch = useDispatch()

    const { formState: { errors }, handleSubmit, setValue, control} = useForm({ defaultValues: initialUsuario })

    useEffect(() => {

        getMembresia()

    }, [])

    useEffect(() => {

        getRoles()

    }, [])
    
    const onSubmit = ({id,registroRut,registroNombre,registroApellidoPaterno,registroApellidoMaterno,registroFechaNacimiento, registroNumeroCelular,registroCorreo,registroDireccion,registroNumCasa,registroPassword, registroTipoMembresia = '', registroTipoRol = '' }) => {

        const estadoUsuario = 1

        let idRol 
        
        let idMembresia 

        
        if(registroTipoRol){
            
            if(registroTipoRol[0]){

                idRol = registroTipoRol[0].value
                
            }else{
                
                idRol = registroTipoRol.value

            }

        }else{
            
            (idRol = '')

        } 
        
        registroTipoMembresia ? (idMembresia = registroTipoMembresia.value) : (idMembresia = '')

        if(id){

            dispatch(startActualizarUsuario({id,registroRut,registroNombre,registroApellidoPaterno,registroApellidoMaterno,registroFechaNacimiento, registroNumeroCelular,registroCorreo,registroDireccion,registroNumCasa, idRol}))
            
            return
            
        }

        dispatch(startAgregarUsuario({ registroRut,registroNombre,registroApellidoPaterno,registroApellidoMaterno,registroFechaNacimiento,registroNumeroCelular,registroCorreo,registroDireccion,registroNumCasa,registroPassword,idMembresia,estadoUsuario, idRol}))

    }
    
    const handleClose = () => {

        dispatch(onClearUser())
        dispatch(onCloseModal())
        dispatch(onClearMessageErrorUser())

    }

    const getMembresia = async() => {

        try {
            
            const {data} = await bibliotecaApi.get('membresias/listar')

            let membresiasArregladas = data.data.map( item => { 

                return { value: item.id , label : item.tipo_membresia }

            })

            setMembresia(membresiasArregladas)

        } catch (error) {

            console.error(error)

        }

    }

    const getRoles = async() => {

        try {
            
            const {data} = await bibliotecaApi.get('roles/listar')

            let rolesArreglados = data.data.map( item => { 

                return { value: item.id , label : item.tipo_rol }

            })

            rolesArreglados = rolesArreglados.filter(rol => rol.value !== 1)

            setRoles(rolesArreglados)

        } catch (error) {

            console.error(error)

        }

    }

    return (
        <Modal size="lg" show={modalOpen} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>{initialUsuario.id ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body>
                {
                    (errorMessage == true) && (
                        <Alert variant='danger'>
                            El rut del usuario ya se encuentra registrado
                        </Alert>
                    )
                }
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
                            disabled
                        />
                    )}
                />
                <Form.Group className="mb-1">
                    <Form.Label>Rut</Form.Label>
                    <Controller 
                        control={control} 
                        name="registroRut" 
                        defaultValue=""  
                        rules={{
                            onChange: e => formateoRut(e.target.value, setValue),
                                required:{
                                    value: true,
                                    message: "Rut es obligatorio"
                                },
                                minLength: { value: 2, message: 'El rut tiene que ser más largo' },
                                validate: {positive: v => validaRut(v) == true || 'Rut tiene que ser válido'} 
                        }}
                        render={({ field: { onChange, value, ref } }) => (
                            <Form.Control
                                onChange={onChange} 
                                value={value} 
                                ref={ref}  
                                type="text" 
                                placeholder="Ingrega tu rut" 
                                maxLength={10} 
                            />
                        )}
                    />
                    {errors.registroRut && 
                        <Form.Text className="text-danger" variant='danger'>
                            {errors.registroRut.message}
                        </Form.Text> 
                    }                                            
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label>Nombre</Form.Label>
                    <Controller 
                        control={control} 
                        name="registroNombre"
                        defaultValue=""  
                        rules={{
                            required: {value: true, message: 'Nombre es obligatorio'},
                            minLength: { value: 2, message: 'El nombre tiene que ser más largo' },
                        }}
                        render={({ field: { onChange, value, ref } }) => (
                            <Form.Control
                                onChange={e => onChange(formateoMayusculas(e.target.value))}  
                                value={value} 
                                ref={ref}  
                                type="text" 
                                placeholder="Ingresa tu nombre"
                                maxLength={50}  
                            />
                        )}
                    />
                    {errors.registroNombre && 
                        <Form.Text className="text-danger" variant='danger'>
                            {errors.registroNombre.message}
                        </Form.Text> 
                    } 
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label>Apellido paterno</Form.Label>
                    <Controller 
                        control={control} 
                        name="registroApellidoPaterno"
                        defaultValue=""  
                        rules={{
                            required: {value: true, message: 'Apellido paterno es obligatorio'},
                            minLength: { value: 2, message: 'El apellido paterno tiene que ser más largo' },
                        }}
                        render={({ field: { onChange, value, ref } }) => (
                            <Form.Control
                                onChange={e => onChange(formateoMayusculas(e.target.value))} 
                                value={value} 
                                ref={ref}  
                                type="text" 
                                placeholder="Ingresa tu apellido paterno"
                                maxLength={50}  
                            />
                        )}
                    />
                    {errors.registroApellidoPaterno && 
                        <Form.Text className="text-danger" variant='danger'>
                            {errors.registroApellidoPaterno.message}
                        </Form.Text> 
                    } 
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label>Apellido materno</Form.Label>
                    <Controller 
                        control={control} 
                        name="registroApellidoMaterno"
                        defaultValue=""  
                        rules={{
                            required: {value: true, message: 'Apellido paterno es obligatorio'},
                            minLength: { value: 2, message: 'El apellido materno tiene que ser más largo' },
                        }}
                        render={({ field: { onChange, value, ref } }) => (
                            <Form.Control
                                onChange={e => onChange(formateoMayusculas(e.target.value))}  
                                value={value} 
                                ref={ref}  
                                type="text" 
                                placeholder="Ingresa tu apellido materno"
                                maxLength={50}  
                            />
                        )}
                    />
                    {errors.registroApellidoMaterno && 
                        <Form.Text className="text-danger" variant='danger'>
                            {errors.registroApellidoMaterno.message}
                        </Form.Text> 
                    } 
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label >Número celular</Form.Label>
                    <Controller 
                        control={control} 
                        name="registroNumeroCelular"
                        defaultValue=""
                        rules={{
                            required: {value: true, message: 'Número de celular es obligatorio'},
                            pattern: {
                                value: /^(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}$/,
                                message: 'Número de celular inválido',
                            },
                        }}  
                        render={({ field: { onChange, value, ref } }) => (
                            <InputGroup>
                                <InputGroup.Text>+56</InputGroup.Text>
                                <Form.Control
                                    onChange={onChange} 
                                    value={value} 
                                    ref={ref}  
                                    placeholder="Ingresa tu número de celular"
                                    maxLength={9} 
                                />
                            </InputGroup>
                        )}
                    />
                    {errors.registroNumeroCelular && 
                        <Form.Text className="text-danger" variant='danger'>
                            {errors.registroNumeroCelular.message}
                        </Form.Text> 
                    } 
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label>Correo</Form.Label>
                    <Controller 
                        control={control} 
                        name="registroCorreo"
                        defaultValue=""  
                        rules={{
                            required: {value: true, message: 'Correo es obligatorio'},
                            pattern: '^\S+@\S+$',
                            minLength: { value: 2, message: 'El correo tiene que ser más largo' },
                        }}
                        render={({ field: { onChange, value, ref } }) => (
                            <Form.Control
                                onChange={e => onChange(formateoMinusculas(e.target.value))} 
                                value={value} 
                                ref={ref}  
                                type="email" 
                                placeholder="Ingresa tu correo electrónico"
                                maxLength={50}  
                            />
                        )}
                    />
                    {errors.registroCorreo && 
                        <Form.Text className="text-danger" variant='danger'>
                            {errors.registroCorreo.message}
                        </Form.Text> 
                    } 
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label>Fecha de nacimiento</Form.Label>
                    <Controller 
                        control={control} 
                        name="registroFechaNacimiento"
                        defaultValue=""  
                        rules={{
                            required: {value: true, message: 'Fecha de nacimiento es obligatoria'},
                            validate: {positive: v => validarFecha(v) == true || 'Fecha de nacimiento con rango inválido'} 
                        }}
                        render={({ field: { onChange, value, ref } }) => (
                            <Form.Control
                                onChange={onChange} 
                                value={value} 
                                ref={ref}  
                                type="date"  
                                placeholder="Ingresa tu fecha de nacimiento" 
                            />
                        )}
                    />
                    {errors.registroFechaNacimiento && 
                        <Form.Text className="text-danger" variant='danger'>
                            {errors.registroFechaNacimiento.message}
                        </Form.Text> 
                    } 
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label>Dirección</Form.Label>
                    <Controller 
                        control={control} 
                        name="registroDireccion"
                        defaultValue=""  
                        rules={{
                            required: {value: true, message: 'La dirección de domicilio es obligatorio'},
                            minLength: { value: 2, message: 'La dirección tiene que ser más larga' }
                        }}
                        render={({ field: { onChange, value, ref } }) => (
                            <Form.Control
                                onChange={e => onChange(formateoMayusculas(e.target.value))}  
                                value={value} 
                                ref={ref}  
                                type="text"  
                                placeholder="Ingresa tu dirección de domicilio"
                                maxLength={50}  
                            />
                        )}
                    />
                    {errors.registroDireccion && 
                        <Form.Text className="text-danger" variant='danger'>
                            {errors.registroDireccion.message}
                        </Form.Text> 
                    } 
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label>Número de domicilio</Form.Label>
                    <Controller 
                        control={control} 
                        name="registroNumCasa"
                        defaultValue=""  
                        rules={{
                            required: {value: true, message: 'Número de domicilio es obligatorio'},
                            minLength: { value: 2, message: 'El número de domicilio tiene que ser más largo'},
                            validate: {positive: v => validarNumeroEnRango(v) == true || 'Número de casa debe estar entre 1 a 10000'} 
                        }}
                        render={({ field: { onChange, value, ref } }) => (
                            <Form.Control
                                onChange={onChange} 
                                value={value} 
                                ref={ref}  
                                type="number" 
                                placeholder="Ingresa tu número de domicilio"
                                min="1" 
                                max="10000" 
                                step="1"
                            />
                        )}
                    />
                    {errors.registroNumCasa && 
                        <Form.Text className="text-danger" variant='danger'>
                            {errors.registroNumCasa.message}
                        </Form.Text> 
                    } 
                </Form.Group>                                         
                    {
                        (!initialUsuario.id) && (
                            <>  
                                <Form.Group  className="mb-1">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Controller 
                                        control={control} 
                                        name="registroPassword"
                                        defaultValue=""  
                                        rules={{
                                            required: {value: true, message: 'Contraseña es obligatoria'},
                                        }}
                                        render={({ field: { onChange, value, ref } }) => (
                                            <Form.Control
                                                onChange={onChange} 
                                                value={value} 
                                                ref={ref}  
                                                type="password"  
                                                placeholder="Ingresa contraseña"
                                                maxLength={50}  
                                            />
                                        )}
                                    />
                                    {errors.registroPassword && 
                                        <Form.Text className="text-danger" variant='danger'>
                                            {errors.registroPassword.message}
                                        </Form.Text> 
                                    } 
                                </Form.Group>
                                <Form.Group  className="mb-1">
                                <Form.Label>Membresía</Form.Label>
                                    <Controller
                                        name="registroTipoMembresia"
                                        control={control}
                                        render={({ field, fieldState: { invalid } }) => (
                                            <ReactSelect
                                                {...field}
                                                styles={customStyles}
                                                options={membresia}
                                                noOptionsMessage={() => "No hay resultados"}
                                                isClearable
                                                placeholder='Seleccione una membresía'
                                            />
                                        )} 
                                    />
                                    {errors.registroTipoMembresia && 
                                        <Form.Text className="text-danger" variant='danger'>
                                            {errors.registroTipoMembresia.message}
                                        </Form.Text> 
                                    } 
                                </Form.Group>
                            </>
                        )
                    }
                    <Form.Group  className="mb-1">
                        <Form.Label>Rol</Form.Label>
                        <Controller
                            name="registroTipoRol"
                            control={control}
                            render={({ field, fieldState: { invalid } }) => (
                                <ReactSelect
                                    {...field}
                                    styles={customStyles}
                                    options={roles? roles : 'hola'}
                                    noOptionsMessage={() => "No hay resultados"}
                                    isClearable
                                    placeholder='Seleccione un rol'
                                />
                            )} 
                        />
                        {errors.registroTipoRol && 
                            <Form.Text className="text-danger" variant='danger'>
                                {errors.registroTipoRol.message}
                            </Form.Text> 
                        } 
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" type='submit'>
                        {initialUsuario.id ? 'Editar Usuario' : 'Guardar Usuario'}
                    </Button>
                </Modal.Footer>
                </Form>
        </Modal>
    )
}
